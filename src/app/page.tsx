"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const characters = [
  { 
    id: 1, 
    name: "Mickey", 
    avatar: "/mickey_photos/mickey.png",
    isLocked: false,
    isSelected: true
  },
  { 
    id: 2, 
    name: "Father", 
    avatar: "/mickey_photos/mickey_father.png",
    isLocked: true,
    isSelected: false
  },
  { 
    id: 3, 
    name: "Mother", 
    avatar: "/mickey_photos/mickey_mother.png",
    isLocked: true,
    isSelected: false
  },
  { 
    id: 4, 
    name: "Neighbor", 
    avatar: "/mickey_photos/mickey_neighbor.png",
    isLocked: true,
    isSelected: false
  },
]

export default function MainMenu() {
  const [isWalking, setIsWalking] = useState(false)
  const router = useRouter()

  const handleStartClick = () => {
    setIsWalking(true)
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between overflow-hidden relative">
      {/* Add Map background image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/images/Map.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />

      {/* Content */}
      <div className="flex flex-col items-center justify-start pt-[15vh] z-20">
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-800 mb-6 text-center"
          initial={{ rotate: -5, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TinyTalkers
        </motion.h1>

        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white text-2xl sm:text-3xl py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          onClick={handleStartClick}
          disabled={isWalking}
        >
          Start the Fun!
        </Button>

        <motion.div
          className="flex justify-center mt-6 gap-4"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          {characters.map((character) => (
            <motion.div 
              key={character.id} 
              className={`relative group ${character.isSelected ? 'scale-110' : ''}`}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <div className={`
                  rounded-full border-4 
                  ${character.isSelected ? 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-white'} 
                  overflow-hidden relative
                `}>
                  <Image
                    src={character.avatar}
                    alt={character.name}
                    width={80}
                    height={80}
                    className={`transition-transform group-hover:scale-110 ${character.isLocked ? 'opacity-50' : ''}`}
                  />
                  {character.isLocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Image
                        src="/images/lock.png"
                        alt="Locked"
                        width={30}
                        height={30}
                        className="opacity-90"
                      />
                    </div>
                  )}
                </div>
                {character.isSelected && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-yellow-400 rotate-45 shadow-lg" />
                  </div>
                )}
              </div>
              <p className={`text-center mt-2 font-bold transition-opacity
                ${character.isSelected ? 'text-yellow-500' : 'text-purple-800'} 
                ${character.isLocked ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}>
                {character.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* House and Garden */}
      <div className="w-full h-[55vh] relative z-20">
        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax meet">
          {/* Pixel Art Flowers */}
          {[
            // Left side flowers
            { x: 20, y: 300 },
            { x: 60, y: 320 },
            { x: 270, y: 310 },

            // Center-left flowers
            { x: 320, y: 300 },
            { x: 360, y: 320 },

            // Center-right flowers
            { x: 620, y: 300 },
            { x: 660, y: 320 },

            // Right side flowers
            { x: 920, y: 300 },
            { x: 940, y: 320 },
            { x: 880, y: 310 },
          ].map((flower, index) => (
            <image
              key={index}
              href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flower-dBQG9hDNlQXW7FP7Ycpzgo6rxdifsW.png"
              x={flower.x}
              y={flower.y}
              width="40"
              height="40"
              preserveAspectRatio="xMidYMid meet"
              style={{ mixBlendMode: "multiply" }}
            />
          ))}

          {/* Left Tree */}
          <image
            href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_transparent_Craiyon-NuWMjqB7nchW3rQHupD1YZ9Vo5RaWz.png"
            x="5%"
            y="100"
            width="20%"
            height="200"
            preserveAspectRatio="xMidYMid meet"
            style={{ mixBlendMode: "multiply" }}
          />

          {/* Right Tree */}
          <image
            href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree2-mKW9Un8u06Im7jsCP2ZrpkzeMITqEG.png"
            x="75%"
            y="50"
            width="20%"
            height="250"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Pixel Art House */}
          <image
            href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house2.1-La0zb6Zr2kAvMt4ZKvgyIZaMFUKsny.png"
            x="35%"
            y="50"
            width="30%"
            height="300"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Mickey Mouse Character */}
          <motion.image
            href={
              isWalking
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MMC_Right_Anim-cE3y2tOOosWyWndKk5640Ra7aTzGie.gif"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MMC_Front-2ZB8YN83BoeEMru5JaLMlpZDvVYY9Z.png"
            }
            initial={{ x: 320, y: 270 }}
            style={{
              width: "100px",
              height: "100px",
            }}
            animate={
              isWalking
                ? {
                    x: [320, 420],
                    y: [270, 250],
                    transition: {
                      duration: 4,
                      ease: "easeInOut",
                    },
                  }
                : {
                    x: 320,
                    y: 270,
                  }
            }
            onAnimationComplete={() => {
              if (isWalking) {
                setTimeout(() => {
                  router.push('/preferences')
                }, 300)
              }
            }}
          />
        </svg>
      </div>
    </div>
  )
}

