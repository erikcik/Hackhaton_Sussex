'use client';
import { useEffect, useState } from 'react';
import Brother from '../components/Brother';
import Mother from '../components/Mother';
import Father from '../components/Father';
import Neighbour from '../components/Neighbour';
import Flowers from '../components/Flowers';
import CharPopup from '@/components/char-popup/char-popup';
import { characters } from '@/data/characters';
import { Character } from '@/types/character-types';

export default function HomeMap() {
  const [position, setPosition] = useState({ x: 320, y: 350 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  const [direction, setDirection] = useState('front');
  const [currentFloor, setCurrentFloor] = useState('down');
  const [showInteraction, setShowInteraction] = useState(false);
  const [showCharPopup, setShowCharPopup] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [completedCharacters, setCompletedCharacters] = useState<string[]>([]);
  const [characterStates, setCharacterStates] = useState<{[key: string]: Character}>({
    brother: characters.brother,
    mother: characters.mother,
    father: characters.father,
    neighbour: characters.neighbour
  });
  
  const moveSpeed = 5;
  const boundaryWidth = 800;
  const boundaryHeight = 800;
  const characterSize = 150;  // Visual size
  const collisionSize = 50;   // Much smaller collision box (about 1/3 of visual size)
  const frameRate = 1000 / 30;
  let lastFrameTime = 0;

  // Define stair areas for both floors
  const stairs = {
    down: {
      x: 290,    // Move slightly more right (was 285)
      y: 300,    // Keep same height
      width: 200, // Keep same width
      height: 50  // Keep same height
    },
    up: {
      x: 290,    // Keep consistent with down stairs
      y: 700,    // Keep same position
      width: 200, // Keep same width
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

  // Update wall areas for the upper floor to fill the gap
  const upperWallAreas = [
    {
      // Left wall section
      x: 0,
      y: 0,
      width: 800, // Full width to cover the gap
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

  // Update stand collision area with flipped dimensions
  const standArea = {
    x: 700,     // Adjust x position if needed
    y: 150,     // Adjust y position to fit the new height
    width: 100, // Original height becomes width
    height: 350 // Original width becomes height
  };

  // Update neighbour's exclamation box position
  const neighbourExclamationBox = {
    x: 665,
    y: 580, // Update to match new position
    width: 120,
    height: 150,
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
    
    if (currentFloor === 'down') {
      // Check collision with lower floor wall sections
      return wallAreas.some(wall => (
        collisionBox.x < wall.x + wall.width &&
        collisionBox.x + collisionBox.width > wall.x &&
        collisionBox.y < wall.y + wall.height &&
        collisionBox.y + collisionBox.height > wall.y
      ));
    } else {
      // Check collision with upper floor wall
      return upperWallAreas.some(wall => (
        collisionBox.x < wall.x + wall.width &&
        collisionBox.x + collisionBox.width > wall.x &&
        collisionBox.y < wall.y + wall.height &&
        collisionBox.y + collisionBox.height > wall.y
      ));
    }
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
        // Add TV, sofa, and stand collision checks
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

        const standCollision = (
            collisionBox.x < standArea.x + standArea.width &&
            collisionBox.x + collisionBox.width > standArea.x &&
            collisionBox.y < standArea.y + standArea.height &&
            collisionBox.y + collisionBox.height > standArea.y
        );
        
        return wallCollision || tvCollision || sofaCollision || standCollision;
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

  const checkInteraction = () => {
    const mickeyBox = getCollisionBox(position);
    
    // Mother's exclamation box (downstairs)
    const motherExclamationBox = {
      x: 535,
      y: 280,
      width: 120,
      height: 150,
    };

    // Father's exclamation box (upstairs)
    const fatherExclamationBox = {
      x: 165,
      y: 500,
      width: 120,
      height: 150,
    };

    // Brother's exclamation box (upstairs)
    const brotherExclamationBox = {
      x: 615,
      y: 500,
      width: 120,
      height: 150,
    };

    if (currentFloor === 'down') {
      // Check mother interaction
      if (checkCollision(mickeyBox, motherExclamationBox)) {
        setShowInteraction(true);
        setCurrentCharacter(characterStates.mother);
      }
      // Check neighbour interaction
      else if (checkCollision(mickeyBox, neighbourExclamationBox)) {
        setShowInteraction(true);
        setCurrentCharacter(characterStates.neighbour);
      }
      else {
        setShowInteraction(false);
        setCurrentCharacter(null);
        // Also close the popup if we're out of range
        setShowCharPopup(false);
      }
    } else {
      // Check father interaction
      if (checkCollision(mickeyBox, fatherExclamationBox)) {
        setShowInteraction(true);
        setCurrentCharacter(characterStates.father);
      }
      // Check brother interaction
      else if (checkCollision(mickeyBox, brotherExclamationBox)) {
        setShowInteraction(true);
        setCurrentCharacter(characterStates.brother);
      }
      else {
        setShowInteraction(false);
        setCurrentCharacter(null);
        // Also close the popup if we're out of range
        setShowCharPopup(false);
      }
    }
  };

  // Helper function to check collision
  const checkCollision = (box1: any, box2: any) => {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  };

  // Update the question completion handler
  const handleQuestionComplete = (characterId: string, questionIndex: number, completed?: boolean) => {
    // Update character's current question index
    setCharacterStates(prev => ({
        ...prev,
        [characterId]: {
            ...prev[characterId],
            currentQuestionIndex: questionIndex + 1
        }
    }));

    // If character completed all questions, add to completed list
    if (completed) {
        setCompletedCharacters(prev => {
            if (!prev.includes(characterId)) {
                return [...prev, characterId];
            }
            return prev;
        });
        // Also close the popup after a delay
        setTimeout(() => {
            setShowCharPopup(false);
        }, 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        
        // If CharPopup is open, only handle T key and prevent movement
        if (showCharPopup) {
            // Optionally handle Escape key to close popup
            if (key === 'escape') {
                setShowCharPopup(false);
            }
            return; // Don't process any other keys when popup is open
        }

        setKeysPressed((prev) => ({ ...prev, [key]: true }));
        
        // Only trigger popup if we're in range of an NPC and T is pressed
        if (key === 't' && showInteraction && currentCharacter) {
            setShowCharPopup(true);
            // Clear all pressed keys to prevent movement when popup opens
            setKeysPressed({});
            return;
        }
        
        switch (key) {
            case 'w':
                setDirection('back');
                if (isOnStairs(position) && currentFloor === 'down') {
                    handleTeleport();
                }
                break;
            case 's':
                setDirection('front');
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
        // If CharPopup is open, don't process movement keys
        if (showCharPopup) return;
        
        setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    const moveCharacter = (timestamp: number) => {
        // If CharPopup is open, don't move character
        if (showCharPopup) return;

        if (timestamp - lastFrameTime < frameRate) {
            return;
        }
        lastFrameTime = timestamp;

        setPosition((prev) => {
            let newX = prev.x;
            let newY = prev.y;

            if (keysPressed['w']) {
                newY = Math.max(0, prev.y - moveSpeed);
                if (isOnStairs(prev) && currentFloor === 'down') {
                    handleTeleport();
                }
            }
            if (keysPressed['s']) {
                newY = Math.min(boundaryHeight - characterSize, prev.y + moveSpeed);
                if (isOnStairs(prev) && currentFloor === 'up') {
                    handleTeleport();
                }
            }
            if (keysPressed['a']) newX = Math.max(0, prev.x - moveSpeed);
            if (keysPressed['d']) newX = Math.min(boundaryWidth - characterSize, prev.x + moveSpeed);

            if (wouldCollideWithFurniture(newX, newY)) {
                return prev;
            }

            return { x: newX, y: newY };
        });

        checkInteraction();
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
}, [keysPressed, position, currentFloor, showInteraction, currentCharacter, showCharPopup]); // Add showCharPopup to dependencies

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
    <div 
      className="min-h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/mickey_moving/Untitled design.png')`,
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden', // Prevent background from causing scrollbars
      }}
    >
      <div 
        className="relative"
        style={{
          width: '800px',
          height: '800px',
          position: 'relative',
          margin: 'auto',
          zIndex: 10, // Ensure game container is above background
        }}
      >
        <div 
          className="relative border-4 border-black"
          style={{ 
            width: `${boundaryWidth}px`, 
            height: `${boundaryHeight}px`,
            backgroundImage: `url("/mickey_moving/House_${currentFloor === 'down' ? 'Down' : 'Up'}%20(1).png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${characterSize}px`,
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

          {/* Interaction Message */}
          {showInteraction && (
            <div
              className="absolute"
              style={{
                left: `${position.x + characterSize / 2 - 50}px`,
                top: `${position.y - 60}px`,
                zIndex: 11,
                position: 'relative',
                display: 'inline-block',
                padding: '12px 16px',
                outline: 'none',
                boxShadow: 'none',
              }}
            >
              {/* Blurred Background */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                  filter: 'blur(7px)',
                  zIndex: 10,
                }}
              />
              <div
                className="relative p-2 inline-block"
                style={{
                  zIndex: 11,
                  fontSize: '20px',
                }}
              >
                Click&nbsp;&nbsp;&nbsp;<span
                  style={{
                    animation: 'breathe 2s infinite ease-in-out',
                    display: 'inline-block',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                    color: '#000',
                    backgroundColor: '#f0f0f0',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 0 #ccc',
                    fontFamily: 'monospace',
                  }}
                >T</span>
              </div>
            </div>
          )}

          <Brother 
            currentFloor={currentFloor} 
            isCompleted={completedCharacters.includes('brother')} 
          />
          <Mother 
            currentFloor={currentFloor} 
            isCompleted={completedCharacters.includes('mother')} 
          />
          <Father 
            currentFloor={currentFloor} 
            isCompleted={completedCharacters.includes('father')} 
          />
          <Neighbour 
            currentFloor={currentFloor} 
            isCompleted={completedCharacters.includes('neighbour')} 
          />

          {/* Debug: Mickey's Collision Box */}
          <div
            className="absolute opacity-50"
            style={{
              left: `${position.x + (characterSize - collisionSize) / 2}px`,
              top: `${position.y + (characterSize - collisionSize)}px`,
              width: `${collisionSize}px`,
              height: `${collisionSize}px`,
              zIndex: 5,
              border: '1px solid transparent'
            }}
          />

          {/* Debug: Stand Collision Box */}
          {currentFloor === 'down' && (
            <div
              className="absolute opacity-50"
              style={{
                left: `${standArea.x}px`,
                top: `${standArea.y}px`,
                width: `${standArea.width}px`,
                height: `${standArea.height}px`,
                zIndex: 5,
                border: '1px solid transparent'
              }}
            />
          )}

          {/* Debug: Stairs Collision Box (both floors) */}
          {currentFloor === 'down' ? (
            <div
              className="absolute opacity-50"
              style={{
                left: `${stairs.down.x}px`,
                top: `${stairs.down.y}px`,
                width: `${stairs.down.width}px`,
                height: `${stairs.down.height}px`,
                zIndex: 5,
              }}
            />
          ) : (
            <div
              className="absolute opacity-50"
              style={{
                left: `${stairs.up.x}px`,
                top: `${stairs.up.y}px`,
                width: `${stairs.up.width}px`,
                height: `${stairs.up.height}px`,
                zIndex: 5,
              }}
            />
          )}

          {/* Add the animation keyframes to your CSS */}
          <style jsx>{`
            @keyframes breathe {
              0% {
                transform: scale(1);
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)';
              }
              50% {
                transform: scale(1.2);
                textShadow: '0 0 20px rgba(255, 255, 255, 1)';
              }
              100% {
                transform: scale(1);
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)';
              }
            }
          `}</style>
        </div>
      </div>
      {showCharPopup && currentCharacter && (
        <CharPopup
          character={characterStates[currentCharacter.id]}
          onClose={() => setShowCharPopup(false)}
          onQuestionComplete={handleQuestionComplete}
        />
      )}
    </div>
  );
}
