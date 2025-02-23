"use client"

import Image from "next/image"
import Link from "next/link"
import { Wheat, MapPin, MessageSquare, HelpCircle } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import Modal from "@/components/Modal"
import CloudTransition from "@/components/CloudTransition"
import { Fireworks } from 'fireworks-js'

export default function Dashboard() {
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const dataChannel = useRef<RTCDataChannel | null>(null)
  const audioStream = useRef<MediaStream | null>(null)
  const [isEntering, setIsEntering] = useState(true)
  const [showAIHelp, setShowAIHelp] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("from-pink-300 to-yellow-200")
  const [customBgColor, setCustomBgColor] = useState<string | null>(null)

  // Add fireworks ref
  const fireworksContainer = useRef<HTMLDivElement>(null)
  const fireworksInstance = useRef<Fireworks | null>(null)

  // Define the functions that can be called by the AI
  const fns = {
    getPageHTML: () => {
      return { success: true, html: document.documentElement.outerHTML }
    },
    changeBackgroundColor: ({ color }: { color: string }) => {
      setCustomBgColor(color)
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
    openGameInvite: ({ message }: { message: string }) => {
      setModalMessage(message)
      setIsModalOpen(true)
      return { success: true, message: "Game invitation opened" }
    },
    showFireworks: ({ duration }: { duration: number }) => {
      if (fireworksContainer.current && !fireworksInstance.current) {
        fireworksInstance.current = new Fireworks(fireworksContainer.current, {
          explosion: 10,
          intensity: 30,
          traceLength: 3,
          delay: { min: 30, max: 60 },
        })
        fireworksInstance.current.start()
        
        // Stop after duration
        setTimeout(() => {
          if (fireworksInstance.current) {
            fireworksInstance.current.stop()
            fireworksInstance.current = null
          }
        }, duration)
      }
      return { success: true, message: "Fireworks started" }
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

      // ... existing WebRTC setup code ...
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
              // ... other tools ...
              {
                type: "function",
                name: "openGameInvite",
                description: "Opens a game invitation modal with a custom message",
                parameters: {
                  type: "object",
                  properties: {
                    message: { 
                      type: "string", 
                      description: "The message to show in the game invitation" 
                    },
                  },
                },
              },
              {
                type: "function",
                name: "showFireworks",
                description: "Shows a fireworks animation on the screen",
                parameters: {
                  type: "object",
                  properties: {
                    duration: {
                      type: "number",
                      description: "Duration in milliseconds to show the fireworks"
                    },
                  },
                },
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
      const answer = await answerResponse.text()
      if (!peerConnection.current) return
      await peerConnection.current.setRemoteDescription({
        sdp: answer,
        type: "answer",
      })

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

  useEffect(() => {
    // Start with transition visible
    setIsEntering(true)
    // After a brief moment, hide the transition
    const timer = setTimeout(() => {
      setIsEntering(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="min-h-screen text-brown-800 font-bubblegum relative"
      style={{
        background: customBgColor 
          ? customBgColor 
          : 'linear-gradient(to bottom, rgb(249, 168, 212), rgb(254, 240, 138))'
      }}
    >
      {/* Add fireworks container */}
      <div 
        ref={fireworksContainer} 
        className="fixed inset-0 pointer-events-none z-50"
      />
      
      <CloudTransition isTransitioning={isEntering} />
      
      <nav className="bg-wood p-4 text-cream shadow-md border-b-4 border-brown-800">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link href="/" className="text-2xl hover:text-yellow-400 transition-colors transform hover:scale-110 inline-block">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-2xl hover:text-yellow-400 transition-colors transform hover:scale-110 inline-block">
              About Us
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 sm:p-6">
        <header className="text-center mb-8">
          <h1 className="dashboard-title text-6xl text-purple-800 drop-shadow-[2px_2px_0px_#000]">
            TinyTalker
          </h1>
          <p className="text-2xl text-purple-900 font-bold">Your Magical Speaking Friend!</p>
        </header>

        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          {/* Main Mickie Chat Section - Full Width */}
          <div className="w-full bg-white rounded-xl p-8 shadow-[8px_8px_0px_0px_#000] border-4 border-black">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 relative w-full justify-center">
                <h2 className="text-4xl text-center text-purple-800 font-bold mb-4">
                  Talk with Mickie!
                </h2>
                <button
                  onClick={() => setShowAIHelp(!showAIHelp)}
                  className="bg-purple-100 p-2 rounded-full hover:bg-purple-200 transition-colors"
                  aria-label="Show AI capabilities"
                >
                  <HelpCircle className="w-6 h-6 text-purple-800" />
                </button>
                
                {/* AI Capabilities Popup */}
                {showAIHelp && (
                  <div className="absolute top-full mt-2 right-0 z-10 bg-white rounded-xl p-6 shadow-lg border-4 border-purple-300 w-80">
                    <h3 className="text-xl font-bold text-purple-800 mb-3">
                      What can Mickie do?
                    </h3>
                    <ul className="space-y-2 text-purple-900">
                      <li className="flex items-start gap-2">
                        <span>🎨</span>
                        <span>Change page colors and appearance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🎮</span>
                        <span>Invite you to play fun games</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🗣️</span>
                        <span>Chat with you using voice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✨</span>
                        <span>Show interactive demonstrations</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => setShowAIHelp(false)}
                      className="mt-4 text-sm text-purple-600 hover:text-purple-800"
                    >
                      Click anywhere to close
                    </button>
                  </div>
                )}
              </div>
              <div className="relative w-80 h-80 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-2xl border-4 border-black p-4 transform hover:scale-105 transition-transform">
                <Image
                  src="/mickey_moving/MMC_FrontUp_Anim.gif"
                  width={280}
                  height={280}
                  alt="AI Character"
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    isAISpeaking ? "animate-bounce" : ""
                  }`}
                />
                {isAISpeaking && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                )}
              </div>
              <button
                onClick={toggleAISpeaking}
                disabled={isLoading}
                className={`w-full max-w-md text-2xl py-4 px-8 rounded-xl border-4 border-black transform active:translate-y-1 transition-transform ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isAISpeaking 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_0px_0px_#000]' 
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                {isLoading ? '🎤 Connecting...' : (isAISpeaking ? '🔴 Stop Talking' : '🎤 Start Talking!')}
              </button>
            </div>
          </div>

          {/* Bottom Section with Map and Games */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* TinyTown Map - 2/3 Width */}
            <div className="lg:w-2/3 bg-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col h-full">
                <h2 className="text-3xl flex items-center mb-3 text-blue-800 font-bold">
                  <MapPin className="mr-2" size={28} />
                  Explore TinyTown!
                </h2>
                <p className="text-lg text-blue-700 mb-4">
                  Visit our magical village where every corner holds a new adventure!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/house.png"
                      width={180}
                      height={180}
                      alt="TinyTown House"
                      className="rounded-lg object-contain shadow-md"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl text-blue-900 font-semibold">
                        🏠 Your Adventure Awaits!
                      </h3>
                      <ul className="text-blue-800 space-y-1">
                        <li className="flex items-center">
                          <span className="mr-2">🌟</span> Meet friendly townspeople
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🎨</span> Discover colorful places
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🎮</span> Play mini-games
                        </li>
                      </ul>
                    </div>
                    
                    <Link 
                      href="/tiny_town" 
                      className="button bg-blue-600 text-white text-xl py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:transform hover:translate-y-1 transition-all text-center self-start"
                    >
                      🗺️ Start Exploring!
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Games - 1/3 Width */}
            <div className="lg:w-1/3 bg-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-3xl flex items-center mb-3 text-green-800 font-bold">
                <Wheat className="mr-2" size={28} />
                Fun Games
              </h2>
              <p className="text-lg text-green-700 mb-4">
                Exciting new games coming soon!
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Image
                    src="/images/lock.png"
                    width={160}
                    height={160}
                    alt="Coming Soon"
                    className="rounded-lg object-contain shadow-md"
                  />
                </div>
                <Link 
                  href="/games" 
                  className="button bg-green-600 text-white text-xl py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:transform hover:translate-y-1 transition-all text-center w-full"
                >
                  🎮 Coming Soon!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  )
}

