"use client"

import Image from "next/image"
import { useState } from "react"

// Base64 encoded pixel art icons - these are the icons you shared
const CHARACTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYpJREFUWEftl99xgzAMxr8vfQ5D0BF4g2YERugI6QgdoRmBETJCRmhGICN0hI7gPhw+fOeAgQOX3l0fwGDpZ0uyLAn4Z0P+2R/+HGAYhvswDI9pmm7DMNycc1drbdd13TXP832e5/swDI9pmu7DMNycc9e2ba9FUezbtj2XZXnI8/zQtu25KIpDURSHtm3PZVke8jw/tG17Lori8JYA0zQ9nXOXaZqeWJ9zLvV9f+n7/tL3/cU5l6ZpeuJZmqYnACkRHX+c4FSAiGgPgD0wVyI6EdHxNQC+70R0IqLjnANEdASQEtGRiI5EdCSiI4CUAFJKKX+cc7ckSfgsSZIkxHtKKaWUUkrJn1LqRymlUkrJtVJKpZSS+5RSSiml5D2l1I9SSiWAPRHtrbXfxpgvY8yXMebLGPNljPkyxnwZY76MMV/GmC9jzNdsHzDGfBtjvo0x38aYb2PMtzHm2xjzbYz5Nsb8iQNmK2HYcv6UAyG2nD/tQIgt5087EOLL+UsciLHl/CUOFC8pxZbzVwD8Ak5GhyAQHyMLAAAAAElFTkSuQmCC"

const LOCK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAUNJREFUWEftl1sOwiAQRYfFuATX4A7cgWvQxbgDl+AaXIxrcAeuwSWYeJMmDQUK05kyMSZ+8VB65p07D+AfXsmxvzTG3Ky1j977m3Puaa1d5nl+SilzY8zFWvvw3t+dcytjzNJae0/TdPXeL4wxF2ttWuTVYRjWxphFnuePrutuWZbdx3F8z/P8KgBkrKIoyrquV3meP7uuu2VZdgcEQBZ938/iOK7quv4KgiDEzKK+79dxHFd1XX8AkabpI4qiMk3TZxAEZZqmjyiKyjRNn0EQlGmaPqIoKtM0fQRBUKZp+giCoEzT9BEEQZmm6SMIgjJN00cQBGWapo8gCMo0TR9BEJRpmj6CICjTNH0EQVD2n/QxDMNbzv0kTcMwvLMsuxOR+8LvZ0kAiGhDRHvn3J6I9kS0I6IdEe2IaEdEOyLaEdGOiHZEtCOiHRHt/pHoC3RQbyAQgZNJAAAAAElFTkSuQmCC"

const SCHOOL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWVJREFUWEftl0FuwjAQRf+YnKBH6A3oDcoNmhukJ2pvEE7Q3qA9QXuE3qA5QdkFhIVlxx57UkxVVWKVhWV7/t/vGTtZAPhrtWL9vQrgHFwA7gB2AM4ArgAOAD4BvCUFYQHYA3gB8BsUPgF4B/AYFWIBsOEfANcFhY8Anooi3AHYvJvwN/PENhEVwh3AHnGbKfwIgPWxh6gQ7gCU+D8AXEPUc0k4AK44/wSQvhHhAMi5Z8NDQrgA1OZ+ERKiNQBzz9UuHjzXtQSoBXgJcQLAhvNgSc+5AXDxnOcSQgKg3D8BPGQOlgC1EAyQF5L0nBsA557vvSBqAWrFNQDqHWgJYQGgw+UbkEO0AKiFsAAw9/kQSs+5AVDuqefcALjnvJCk59wAuHjW80wOoQDUxlPPuQFQ7qnnXAC4eO5zDqEAYuOpAEqIlgDWc24AXDz1nBuAcs+zXu05NwDlnmf9D8AvwNtxIJoZJ5MAAAAASUVORK5CYII="

export default function PixelMap() {
  const [isExpanding, setIsExpanding] = useState(false);

  const handleHouseClick = () => {
    setIsExpanding(true);
  };

  return (
    <div className="fixed inset-0 bg-[#90B66D] overflow-hidden">
      {/* Grass pattern background */}
      <div className={`absolute inset-0 z-0 transition-all ${isExpanding ? 'opacity-0' : ''}`}
           style={{ transitionDuration: '3s' }}>
        <GrassPattern />
      </div>

      {/* Left curtain cloud */}
      <div className={`fixed left-0 top-0 bottom-0 z-10 flex
                      transition-all ease-in-out
                      ${isExpanding ? 'w-[50vw]' : 'w-12'}`}
           style={{ transitionDuration: '2s' }}>
        <div className="w-full h-full bg-white/70"/>
        <div className="h-full flex flex-col w-6 flex-shrink-0">
          {[...Array(20)].map((_, index) => (
            <CloudRight key={index} />
          ))}
        </div>
      </div>

      {/* Right curtain cloud */}
      <div className={`fixed right-0 top-0 bottom-0 z-10 flex
                      transition-all ease-in-out
                      ${isExpanding ? 'w-[50vw]' : 'w-12'}`}
           style={{ transitionDuration: '2s' }}>
        <div className="h-full flex flex-col w-6 flex-shrink-0">
          {[...Array(20)].map((_, index) => (
            <CloudLeft key={index} />
          ))}
        </div>
        <div className="w-full h-full bg-white/70"/>
      </div>

      <div className="relative h-full flex items-center justify-center z-1">
        <div className="relative h-[178vh] aspect-square">
          {/* Main image */}
          <div className="relative h-full">
            <Image
              src="/images/Map.png"
              alt="Pixel art town map"
              fill
              className={`object-contain transition-all ${isExpanding ? 'opacity-0' : ''}`}
              style={{ 
                imageRendering: "pixelated",
                transitionDuration: '3s'
              }}
            />
            
            {/* Interactive areas */}
            <div className="absolute inset-0">
              {/* House */}
              <button 
                className={`absolute left-[47.5%] top-[66%] w-[5%] h-[5%] 
                           hover:scale-125 hover:cursor-pointer
                           focus:outline-none
                           ${isExpanding ? 'opacity-0' : ''}`}
                style={{ 
                  transition: 'transform 0.5s, opacity 3s',
                }}
                aria-label="House"
                onClick={handleHouseClick}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/house.png"
                    alt="House icon"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    priority
                  />
                </div>
              </button>
              
              {/* School */}
              <button 
                className={`absolute left-[43.3%] top-[33%] w-[5%] h-[5%] 
                           hover:scale-125 hover:cursor-pointer
                           focus:outline-none
                           ${isExpanding ? 'opacity-0' : ''}`}
                style={{ 
                  transition: 'transform 0.5s, opacity 3s',
                }}
                aria-label="School"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/school.png"
                    alt="School icon"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    priority
                  />
                </div>
              </button>
              
              {/* Lock */}
              <button 
                className={`absolute right-[47.6%] top-[45.2%] w-[5%] h-[5%] 
                           hover:scale-125 hover:cursor-pointer
                           focus:outline-none
                           ${isExpanding ? 'opacity-0' : ''}`}
                style={{ 
                  transition: 'transform 0.5s, opacity 3s',
                }}
                aria-label="Lock"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/lock.png"
                    alt="Lock icon"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    priority
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GrassPattern() {
  return (
    <div className="w-full h-full grid grid-cols-12 gap-0">
      {[...Array(200)].map((_, index) => (
        <GrassTile key={index} />
      ))}
    </div>
  )
}

function GrassTile() {
  return (
    <div className="relative aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4">
          {/* Grass details */}
          <div className="absolute top-1/4 left-1/4 w-1 h-2 bg-[#7a9c5c] rotate-12" />
          <div className="absolute top-1/3 right-1/3 w-1 h-2 bg-[#7a9c5c] -rotate-12" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-2 bg-[#7a9c5c] rotate-6" />
        </div>
      </div>
    </div>
  )
}

function CloudRight() {
  return (
    <div className="flex flex-col items-start opacity-70">
      <div className="w-3 h-3 bg-white rounded-r-sm" />
      <div className="w-4 h-4 bg-white rounded-r-sm -mt-1" />
      <div className="w-6 h-6 bg-white rounded-r-sm -mt-2" />
      <div className="w-5 h-5 bg-white rounded-r-sm -mt-2" />
      <div className="w-4 h-4 bg-white rounded-r-sm -mt-1" />
      <div className="w-3 h-3 bg-white rounded-r-sm -mt-1" />
    </div>
  )
}

function CloudLeft() {
  return (
    <div className="flex flex-col items-end opacity-70 scale-y-[-1]">
      <div className="w-3 h-3 bg-white rounded-l-sm" />
      <div className="w-4 h-4 bg-white rounded-l-sm -mt-1" />
      <div className="w-6 h-6 bg-white rounded-l-sm -mt-2" />
      <div className="w-5 h-5 bg-white rounded-l-sm -mt-2" />
      <div className="w-4 h-4 bg-white rounded-l-sm -mt-1" />
      <div className="w-3 h-3 bg-white rounded-l-sm -mt-1" />
    </div>
  )
}

