"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

const characters = [
  { id: 1, name: "Lily", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Max", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Zoe", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 4, name: "Tom", avatar: "/placeholder.svg?height=100&width=100" },
]

export default function MainMenu() {
  const [isWalking, setIsWalking] = useState(false)
  const router = useRouter()

  const handleStartClick = () => {
    setIsWalking(true)
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between overflow-hidden relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      {/* Full-width grass (moved to the back) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[150px] bg-repeat-x"
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4J10EwLFsP5VcJMV5YzebjEivFvPBG.png)`,
          backgroundSize: "auto 100%",
          filter: "hue-rotate(-10deg) saturate(80%) brightness(110%)",
          zIndex: 1,
        }}
      />

      {/* Sun */}
      <motion.img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sun-5MVQLy7uTC1M1cevjol7QipWjwratJ.png"
        alt="Pixel art sun"
        className="absolute right-[5vw] top-[5vh] w-[25vmin] h-[25vmin] z-10"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="flex flex-col items-center justify-start pt-[15vh] z-20">
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-800 mb-6 text-center font-comic"
          initial={{ rotate: -5, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TinyTalkers
        </motion.h1>

        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white text-2xl sm:text-3xl py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 font-comic"
          onClick={handleStartClick}
          disabled={isWalking}
        >
          Start the Fun!
        </Button>

        <motion.div
          className="flex justify-center mt-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          {characters.map((character) => (
            <motion.div key={character.id} className="mx-2 sm:mx-3" whileHover={{ y: -5 }}>
              <img
                src={character.avatar || "/placeholder.svg"}
                alt={character.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* House and Garden */}
      <div className="w-full h-[55vh] relative" style={{ zIndex: 2 }}>
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

