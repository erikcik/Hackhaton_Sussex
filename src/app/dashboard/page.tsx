"use client"

import Image from "next/image"
import Link from "next/link"
import { Wheat, MapPin, MessageSquare } from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"

export default function Dashboard() {
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const dataChannel = useRef<RTCDataChannel | null>(null)
  const audioStream = useRef<MediaStream | null>(null)

  // Define the functions that can be called by the AI
  const fns = {
    getPageHTML: () => {
      return { success: true, html: document.documentElement.outerHTML }
    },
    changeBackgroundColor: ({ color }: { color: string }) => {
      document.body.style.backgroundColor = color
      return { success: true, color }
    },
    changeTextColor: ({ color }: { color: string }) => {
      document.body.style.color = color
      return { success: true, color }
    },
    showFingers: async ({ numberOfFingers }: { numberOfFingers: number }) => {
      console.log(`Showing ${numberOfFingers} fingers`)
      return { success: true, numberOfFingers }
    },
  }

  const stopConnection = useCallback(() => {
    if (dataChannel.current) {
      dataChannel.current.close()
      dataChannel.current = null
    }

    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    if (audioStream.current) {
      audioStream.current.getTracks().forEach(track => track.stop())
      audioStream.current = null
    }

    document.querySelectorAll('audio').forEach(el => el.remove())
    setIsAISpeaking(false)
  }, [])

  const initWebRTC = async () => {
    try {
      setIsLoading(true)
      peerConnection.current = new RTCPeerConnection()

      peerConnection.current.ontrack = (event) => {
        const el = document.createElement("audio")
        el.srcObject = event.streams[0]
        el.autoplay = el.controls = true
        document.body.appendChild(el)
      }

      dataChannel.current = peerConnection.current.createDataChannel("oai-events")

      const configureDataChannel = () => {
        if (!dataChannel.current) return
        const event = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            tools: [
              {
                type: "function",
                name: "changeBackgroundColor",
                description: "Changes the background color of a web page",
                parameters: {
                  type: "object",
                  properties: {
                    color: { type: "string", description: "A hex value of the color" },
                  },
                },
              },
              {
                type: "function",
                name: "changeTextColor",
                description: "Changes the text color of a web page",
                parameters: {
                  type: "object",
                  properties: {
                    color: { type: "string", description: "A hex value of the color" },
                  },
                },
              },
              {
                type: "function",
                name: "showFingers",
                description: "Controls a robot hand to show a specific number of fingers",
                parameters: {
                  type: "object",
                  properties: {
                    numberOfFingers: {
                      enum: [1, 2, 3, 4, 5],
                      description: "Values 1 through 5 of the number of fingers to hold up",
                    },
                  },
                },
              },
              {
                type: "function",
                name: "getPageHTML",
                description: "Gets the HTML for the current page",
              },
            ],
          },
        }
        dataChannel.current.send(JSON.stringify(event))
      }

      dataChannel.current.addEventListener("open", () => {
        console.log("Data channel opened")
        configureDataChannel()
      })

      dataChannel.current.addEventListener("message", async (ev) => {
        const msg = JSON.parse(ev.data)
        if (msg.type === "response.function_call_arguments.done") {
          const fn = fns[msg.name as keyof typeof fns]
          if (fn) {
            console.log(`Calling local function ${msg.name} with ${msg.arguments}`)
            const args = JSON.parse(msg.arguments)
            const result = await fn(args)
            console.log("result", result)

            if (!dataChannel.current) return
            const event = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: msg.call_id,
                output: JSON.stringify(result),
              },
            }
            dataChannel.current.send(JSON.stringify(event))
            dataChannel.current.send(JSON.stringify({ type: "response.create" }))
          }
        }
      })

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStream.current = stream
      stream.getTracks().forEach((track) => {
        if (!peerConnection.current) return
        peerConnection.current.addTransceiver(track, { direction: "sendrecv" })
      })

      const offer = await peerConnection.current.createOffer()
      if (!peerConnection.current) return
      await peerConnection.current.setLocalDescription(offer)

      const tokenResponse = await fetch("/api/session", { method: "POST" })
      const data = await tokenResponse.json()
      const EPHEMERAL_KEY = data.result.client_secret.value
      const baseUrl = "https://api.openai.com/v1/realtime"
      const model = "gpt-4o-realtime-preview-2024-12-17"

      const answerResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      })

      if (!answerResponse.ok) {
        const errorText = await answerResponse.text()
        console.error("OpenAI API Error:", answerResponse.status, errorText)
        setIsLoading(false)
        setIsAISpeaking(false)
        alert(`OpenAI API Error: ${answerResponse.status} - ${errorText}`)
        return
      }
      const answer = await answerResponse.text()
      if (!peerConnection.current) return

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription({
        sdp: answer,
        type: 'answer'
      }))

      setIsAISpeaking(true)
    } catch (error) {
      console.error("Error during WebRTC setup:", error)
      stopConnection()
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAISpeaking = async () => {
    if (isAISpeaking) {
      stopConnection()
    } else {
      await initWebRTC()
    }
  }

  useEffect(() => {
    return () => {
      stopConnection()
    }
  }, [stopConnection])

  const handleVoiceChatError = (error: Error) => {
    console.error('Voice chat error:', error)
    setIsAISpeaking(false)
    // You might want to show an error message to the user here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-green-200 text-brown-800 font-bubblegum">
      <nav className="bg-wood p-4 text-cream shadow-md">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link href="/" className="text-xl hover:text-yellow-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-xl hover:text-yellow-400 transition-colors">
              About Us
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 sm:p-6">
        <header className="text-center mb-8">
          <h1 className="dashboard-title">TinyTalker</h1>
          <p className="text-xl text-green-800">Your friendly language learning buddy</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-grow space-y-6">
            <div className="bg-cream rounded-lg p-4 shadow-md border-2 border-brown-600">
              <h2 className="section-title flex items-center mb-2">
                <Wheat className="mr-2" />
                Game Zone
              </h2>
              <div className="flex items-center justify-between">
                <Link href="/games" className="button bg-green-600 text-cream hover:bg-green-700">
                  Start Playing
                </Link>
                <Image
                  src="/placeholder.svg?height=80&width=160"
                  width={160}
                  height={80}
                  alt="Farm scene"
                  className="rounded-lg border-2 border-brown-600"
                />
              </div>
            </div>

            <div className="bg-cream rounded-lg p-4 shadow-md border-2 border-brown-600 w-72">
              <h2 className="section-title flex items-center mb-2">
                <MapPin className="mr-2" />
                TinyTown Map
              </h2>
              <div className="flex items-center justify-between">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MMC_Front-yH1tPG5KNsxzz0WdL8zmo56DmTzLnJ.png"
                  width={80}
                  height={80}
                  alt="TinyTown Map Character"
                  className="pixelated object-contain"
                />
                <Link href="/tinytown-map" className="button bg-blue-600 text-cream hover:bg-blue-700">
                  Explore Town
                </Link>
              </div>
            </div>
          </main>

          <aside className="lg:w-1/3">
            <div className="bg-cream rounded-lg p-6 shadow-md border-2 border-brown-600 h-full">
              <div className="flex items-start gap-4 mb-4">
                <h2 className="section-title flex items-center m-0">
                  <MessageSquare className="mr-2" />
                  AI Chat
                </h2>
                <div className="bg-[#f4e6d0] rounded-lg p-3 w-32 h-32 border-2 border-yellow-600 flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MMC_Front-yH1tPG5KNsxzz0WdL8zmo56DmTzLnJ.png"
                    width={100}
                    height={100}
                    alt="AI Character"
                    className={`w-full h-full object-contain pixelated transition-opacity duration-300 ${isAISpeaking ? "opacity-100" : "opacity-80"}`}
                  />
                </div>
              </div>
              <div className="h-[calc(100%-12rem)]">
                <div className="bg-green-100 rounded-lg p-4 h-full overflow-y-auto border-2 border-green-600">
                  {/* AI chat messages will be displayed here */}
                  <p className="text-green-800 italic">AI messages will appear here...</p>
                </div>
              </div>
              <button
                onClick={toggleAISpeaking}
                disabled={isLoading}
                className={`mt-4 px-4 py-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' :
                  isAISpeaking 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white rounded transition-colors`}
              >
                {isLoading ? 'Connecting...' : (isAISpeaking ? 'Stop AI Voice Chat' : 'Start AI Voice Chat')}
              </button>
              
            
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

