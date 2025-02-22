'use client';
import { useEffect, useState } from 'react';

export default function HomeMap() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  const [direction, setDirection] = useState('front');
  const [currentFloor, setCurrentFloor] = useState('down');
  
  const moveSpeed = 5;
  const boundaryWidth = 800;
  const boundaryHeight = 800;
  const characterSize = 150;  // Visual size
  const collisionSize = 50;   // Much smaller collision box (about 1/3 of visual size)
  const frameRate = 1000 / 30;
  let lastFrameTime = 0;

  // Define stair areas for both floors with more accurate positions
  const stairs = {
    down: {
      x: 320,    // Keep same x position
      y: 300,    // Moved to middle section (was 100)
      width: 150, // Keep same width
      height: 50  // Reduced height for more precise trigger area
    },
    up: {
      x: 320,    // Keep same x position
      y: 700,    // Keep same for upper floor
      width: 150, // Keep same width
      height: 50  // Keep same height
    }
  };

  // Update wall areas to have a gap for the stairs
  const wallAreas = [
    {
      // Left wall section
      x: 0,
      y: 0,
      width: 320, // Stop where stairs begin (stairs.down.x)
      height: 350
    },
    {
      // Right wall section
      x: 470,    // Start after stairs (stairs.down.x + stairs.down.width)
      y: 0,
      width: 330, // Rest of the wall to right edge
      height: 350
    }
  ];

  // Add bed collision area
  const bedArea = {
    x: 50,     // Keep same distance from left wall
    y: 500,    // Moved up to account for doubled height
    width: 100, // Reduced from 150 to 100 for narrower width
    height: 300 // Doubled from 150 to 300 for taller height
  };

  // Add bath collision area
  const bathArea = {
    x: 500,    // Moved left to accommodate doubled width (was 650)
    y: 650,    // Keep same bottom position
    width: 300, // Doubled from 150 to 300
    height: 150 // Keep same height
  };

  // Update TV collision area with much taller height to include TV stand
  const tvArea = {
    x: 50,      // Keep same x position
    y: 500,     // Keep same top position
    width: 50,  // Keep same width
    height: 200 // Increase height from 100 to 200 to extend to bottom of stand
  };

  // Update sofa collision area with increased height
  const sofaArea = {
    x: 200,     // Keep same x position
    y: 550,     // Keep same y position
    width: 120, // Keep same wider width
    height: 150 // Increase height from 100 to 150 to extend lower
  };

  // Update collision box to be at Mickey's feet
  const getCollisionBox = (pos: { x: number, y: number }) => {
    const footHeight = 10;   // Reduced from 40 to 10
    const footWidth = 10;    // Reduced from 20 to 10
    
    return {
      x: pos.x + (characterSize - footWidth) / 2,  // Still centered but very narrow
      y: pos.y + (characterSize - footHeight),     // Same foot position
      width: footWidth,
      height: footHeight
    };
  };

  // Handle teleportation with adjusted positions
  const handleTeleport = () => {
    if (currentFloor === 'down') {
      setCurrentFloor('up');
      // When going up, place Mickey right above the steps on the upper floor
      setPosition({ x: stairs.up.x, y: stairs.up.y - characterSize - 20 });
    } else {
      setCurrentFloor('down');
      // When going down, place Mickey at the bottom of the tall stairs
      setPosition({ x: stairs.down.x, y: stairs.down.y + stairs.down.height - characterSize - 10 });
    }
  };

  // Update wall collision detection to check both wall sections
  const wouldCollideWithWall = (newX: number, newY: number) => {
    const collisionBox = getCollisionBox({ x: newX, y: newY });
    
    // Check collision with both wall sections
    return wallAreas.some(wall => (
      collisionBox.x < wall.x + wall.width &&
      collisionBox.x + collisionBox.width > wall.x &&
      collisionBox.y < wall.y + wall.height &&
      collisionBox.y + collisionBox.height > wall.y
    ));
  };

  // Update stairs collision detection
  const isOnStairs = (pos: { x: number, y: number }) => {
    const currentStairs = stairs[currentFloor as 'up' | 'down'];
    const collisionBox = getCollisionBox(pos);
    
    if (currentFloor === 'down') {
      return (
        collisionBox.x < currentStairs.x + currentStairs.width &&
        collisionBox.x + collisionBox.width > currentStairs.x &&
        collisionBox.y < currentStairs.y + currentStairs.height &&
        collisionBox.y + collisionBox.height > currentStairs.y
      );
    }
    
    // Keep upper floor collision the same
    return (
      collisionBox.x < currentStairs.x + currentStairs.width &&
      collisionBox.x + collisionBox.width > currentStairs.x &&
      collisionBox.y + collisionBox.height > currentStairs.y &&
      collisionBox.y + collisionBox.height < currentStairs.y + currentStairs.height
    );
  };

  // Update collision detection to include all furniture
  const wouldCollideWithFurniture = (newX: number, newY: number) => {
    const collisionBox = getCollisionBox({ x: newX, y: newY });
    
    // Check wall collision for both floors
    const wallCollision = wouldCollideWithWall(newX, newY);
    
    if (currentFloor === 'down') {
        // Add TV and sofa collision checks
        const tvCollision = (
            collisionBox.x < tvArea.x + tvArea.width &&
            collisionBox.x + collisionBox.width > tvArea.x &&
            collisionBox.y < tvArea.y + tvArea.height &&
            collisionBox.y + collisionBox.height > tvArea.y
        );
        
        const sofaCollision = (
            collisionBox.x < sofaArea.x + sofaArea.width &&
            collisionBox.x + collisionBox.width > sofaArea.x &&
            collisionBox.y < sofaArea.y + sofaArea.height &&
            collisionBox.y + collisionBox.height > sofaArea.y
        );
        
        return wallCollision || tvCollision || sofaCollision;
    } else {
        // Upper floor collisions (bed and bath)
        const bedCollision = (
            collisionBox.x < bedArea.x + bedArea.width &&
            collisionBox.x + collisionBox.width > bedArea.x &&
            collisionBox.y < bedArea.y + bedArea.height &&
            collisionBox.y + collisionBox.height > bedArea.y
        );
        
        const bathCollision = (
            collisionBox.x < bathArea.x + bathArea.width &&
            collisionBox.x + collisionBox.width > bathArea.x &&
            collisionBox.y < bathArea.y + bathArea.height &&
            collisionBox.y + collisionBox.height > bathArea.y
        );
        
        return wallCollision || bedCollision || bathCollision;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed((prev) => ({ ...prev, [key]: true }));
      
      switch (key) {
        case 'w':
          setDirection('back');
          // Check for stair teleportation when pressing up
          if (isOnStairs(position) && currentFloor === 'down') {
            handleTeleport();
          }
          break;
        case 's':
          setDirection('front');
          // Check for stair teleportation when pressing down
          if (isOnStairs(position) && currentFloor === 'up') {
            handleTeleport();
          }
          break;
        case 'a':
          setDirection('left');
          break;
        case 'd':
          setDirection('right');
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    const moveCharacter = (timestamp: number) => {
      if (timestamp - lastFrameTime < frameRate) {
        return;
      }
      lastFrameTime = timestamp;

      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (keysPressed['w']) newY = Math.max(0, prev.y - moveSpeed);
        if (keysPressed['s']) newY = Math.min(boundaryHeight - characterSize, prev.y + moveSpeed);
        if (keysPressed['a']) newX = Math.max(0, prev.x - moveSpeed);
        if (keysPressed['d']) newX = Math.min(boundaryWidth - characterSize, prev.x + moveSpeed);

        // Check collision with both wall and bed
        if (wouldCollideWithFurniture(newX, newY)) {
          return prev; // Don't move if would collide
        }

        return { x: newX, y: newY };
      });
    };

    let animationFrameId: number;
    const animate = (timestamp: number) => {
      moveCharacter(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [keysPressed, position, currentFloor]);

  const getCharacterGif = () => {
    switch (direction) {
      case 'back':
        return '/mickey_moving/MMC_Back_Anim.gif';
      case 'front':
        return '/mickey_moving/MMC_Front_Anim.gif';
      case 'left':
        return '/mickey_moving/MMC_Left_Anim.gif';
      case 'right':
        return '/mickey_moving/MMC_Right_Anim.gif';
      default:
        return '/mickey_moving/MMC_Front_Anim.gif';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div 
        className="relative border-4 border-black"
        style={{ 
          width: `${boundaryWidth}px`, 
          height: `${boundaryHeight}px`,
          backgroundImage: `url("/mickey_moving/House_${currentFloor === 'down' ? 'Down' : 'Up'}%20(1).png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${characterSize}px`,  // Keep visual size large
            height: `${characterSize}px`,
            zIndex: 10,
          }}
        >
          <img 
            src={getCharacterGif()}
            alt="Mickey Mouse"
            width={characterSize}
            height={characterSize}
            style={{ 
              imageRendering: 'pixelated',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
