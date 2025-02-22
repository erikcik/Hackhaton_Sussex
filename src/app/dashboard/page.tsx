"use client"

import Image from "next/image"
import Link from "next/link"
import { Wheat, MapPin, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [isAISpeaking, setIsAISpeaking] = useState(false)

  const toggleAISpeaking = () => {
    setIsAISpeaking((prev) => !prev)
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
              {/* This button is temporary for demonstration */}
              <button
                onClick={toggleAISpeaking}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Toggle AI Speaking
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

