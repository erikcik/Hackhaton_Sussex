"use client"

import { useEffect, useState } from 'react'

export default function CloudTransition({ isTransitioning }: { isTransitioning: boolean }) {
  return (
    <>
      {/* Left curtain cloud */}
      <div className={`fixed left-0 top-0 bottom-0 z-50 flex
                      transition-all ease-in-out
                      ${isTransitioning ? 'w-[50vw]' : 'w-0'}`}
           style={{ transitionDuration: '2s' }}>
        <div className="w-full h-full bg-white/70"/>
        <div className="h-full flex flex-col w-6 flex-shrink-0">
          {[...Array(20)].map((_, index) => (
            <CloudRight key={index} />
          ))}
        </div>
      </div>

      {/* Right curtain cloud */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 flex
                      transition-all ease-in-out
                      ${isTransitioning ? 'w-[50vw]' : 'w-0'}`}
           style={{ transitionDuration: '2s' }}>
        <div className="h-full flex flex-col w-6 flex-shrink-0">
          {[...Array(20)].map((_, index) => (
            <CloudLeft key={index} />
          ))}
        </div>
        <div className="w-full h-full bg-white/70"/>
      </div>
    </>
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