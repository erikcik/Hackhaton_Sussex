'use client';
import { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Animated } from 'react-native';
import Brother from '../../components/Brother';
import Mother from '../../components/Mother';
import Father from '../../components/Father';
import Neighbour from '../../components/Neighbour';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const GAME_SIZE = Math.min(SCREEN_WIDTH, 800); // Cap at 800 or use screen width if smaller
const MOVE_SPEED = 8;  // Increased speed
const UPDATE_INTERVAL = 16;  // 60fps (1000ms / 60)
const FPS = 60;

const MOVE_INTERVAL = 16; // approximately 60fps

const WALK_SPEED = 5;

export default function HomeMap() {
  const animatedX = useRef(new Animated.Value(320)).current;
  const animatedY = useRef(new Animated.Value(350)).current;
  const [position, setPosition] = useState({ x: 320, y: 350 });
  const [direction, setDirection] = useState('front');
  const [currentFloor, setCurrentFloor] = useState('down');
  const [showInteraction, setShowInteraction] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState('');
  const moveInterval = useRef<NodeJS.Timeout | null>(null);
  const walkingInterval = useRef<NodeJS.Timer | null>(null);

  // Keep the same constants but scale them for mobile
  const boundaryWidth = GAME_SIZE;
  const boundaryHeight = GAME_SIZE;
  const characterSize = GAME_SIZE * 0.1875; // 150/800 ratio from web version
  const collisionSize = characterSize / 3;

  // Add mobile controls
  const handleMove = (moveDirection: string) => {
    let newX = position.x;
    let newY = position.y;
    
    switch (moveDirection) {
      case 'up':
        setDirection('back');
        newY = Math.max(0, position.y - MOVE_SPEED);
        if (isOnStairs(position) && currentFloor === 'down') {
          handleTeleport();
        }
        break;
      case 'down':
        setDirection('front');
        newY = Math.min(boundaryHeight - characterSize, position.y + MOVE_SPEED);
        if (isOnStairs(position) && currentFloor === 'up') {
          handleTeleport();
        }
        break;
      case 'left':
        setDirection('left');
        newX = Math.max(0, position.x - MOVE_SPEED);
        break;
      case 'right':
        setDirection('right');
        newX = Math.min(boundaryWidth - characterSize, position.x + MOVE_SPEED);
        break;
    }

    if (!wouldCollideWithFurniture(newX, newY)) {
      setPosition({ x: newX, y: newY });
      checkInteraction();
    }
  };

  // Define stair areas for both floors
  const stairs = {
    down: {
      x: 290,
      y: 300,
      width: 200,
      height: 50
    },
    up: {
      x: 290,
      y: 700,
      width: 200,
      height: 50
    }
  };

  const isOnStairs = (pos: { x: number; y: number }) => {
    const currentStairs = stairs[currentFloor as 'up' | 'down'];
    const collisionBox = getCollisionBox(pos);
    
    return (
      collisionBox.x < currentStairs.x + currentStairs.width &&
      collisionBox.x + collisionBox.width > currentStairs.x &&
      collisionBox.y < currentStairs.y + currentStairs.height &&
      collisionBox.y + collisionBox.height > currentStairs.y
    );
  };

  const handleTeleport = () => {
    if (currentFloor === 'down') {
      setCurrentFloor('up');
      setPosition({ x: stairs.up.x, y: stairs.up.y - characterSize - 20 });
    } else {
      setCurrentFloor('down');
      setPosition({ x: stairs.down.x, y: stairs.down.y + stairs.down.height - characterSize - 10 });
    }
  };

  const getCollisionBox = (pos: { x: number; y: number }) => {
    const footHeight = 10;
    const footWidth = 10;
    
    return {
      x: pos.x + (characterSize - footWidth) / 2,
      y: pos.y + (characterSize - footHeight),
      width: footWidth,
      height: footHeight
    };
  };

  const wouldCollideWithFurniture = (newX: number, newY: number) => {
    // Simplified collision detection for mobile version
    return false; // We can implement detailed collision later if needed
  };

  const checkInteraction = () => {
    // Simplified interaction check for mobile version
    setShowInteraction(false); // We can implement detailed interaction later if needed
  };

  // Update the startMoving function
  const startMoving = (direction: string) => {
    setIsMoving(true);
    setCurrentDirection(direction);
    
    // Initial immediate move
    handleMove(direction);
    
    // Set up rapid continuous movement
    const moveLoop = () => {
      if (isMoving) {
        handleMove(direction);
        moveInterval.current = setTimeout(moveLoop, UPDATE_INTERVAL);
      }
    };
    
    // Start the loop immediately
    moveInterval.current = setTimeout(moveLoop, UPDATE_INTERVAL);
  };

  // Update the stopMoving function
  const stopMoving = () => {
    if (moveInterval.current) {
      clearTimeout(moveInterval.current);
      moveInterval.current = null;
    }
    setIsMoving(false);
    setCurrentDirection('');
  };

  // New simplified walking functions
  const startWalking = (direction: string) => {
    // Clear any existing interval
    if (walkingInterval.current) {
      clearInterval(walkingInterval.current);
    }

    // Set initial direction
    setDirection(direction);

    // Create walking interval
    walkingInterval.current = setInterval(() => {
      setPosition(current => {
        let newX = current.x;
        let newY = current.y;

        switch (direction) {
          case 'up':
            newY = Math.max(0, current.y - WALK_SPEED);
            break;
          case 'down':
            newY = Math.min(boundaryHeight - characterSize, current.y + WALK_SPEED);
            break;
          case 'left':
            newX = Math.max(0, current.x - WALK_SPEED);
            break;
          case 'right':
            newX = Math.min(boundaryWidth - characterSize, current.x + WALK_SPEED);
            break;
        }

        // Check stairs after movement
        if (direction === 'up' && isOnStairs(current) && currentFloor === 'down') {
          handleTeleport();
        } else if (direction === 'down' && isOnStairs(current) && currentFloor === 'up') {
          handleTeleport();
        }

        return { x: newX, y: newY };
      });
    }, 16); // 60fps
  };

  const stopWalking = () => {
    if (walkingInterval.current) {
      clearInterval(walkingInterval.current);
      walkingInterval.current = null;
    }
  };

  useEffect(() => {
    Animated.timing(animatedX, {
      toValue: position.x,
      duration: 50, // Adjust this value to control smoothness
      useNativeDriver: true,
    }).start();
    
    Animated.timing(animatedY, {
      toValue: position.y,
      duration: 50, // Adjust this value to control smoothness
      useNativeDriver: true,
    }).start();
  }, [position]);

  return (
    <View style={styles.container}>
      <View style={[styles.gameContainer, { width: GAME_SIZE, height: GAME_SIZE }]}>
        <Image
          source={currentFloor === 'down' 
            ? require('@/assets/images/House_Down_1.png')
            : require('@/assets/images/House_Up_1.png')
          }
          style={styles.backgroundImage}
        />

        {/* Character */}
        <Animated.Image
          source={getCharacterImage(direction)}
          style={[
            styles.character,
            {
              transform: [
                { translateX: animatedX },
                { translateY: animatedY }
              ],
              width: characterSize,
              height: characterSize,
            }
          ]}
        />

        {/* Teleport Buttons */}
        {currentFloor === 'down' && (
          <TouchableOpacity
            style={[styles.teleportButton, {
              right: GAME_SIZE * 0.4, // Adjust position as needed
              top: GAME_SIZE * 0.3,   // Adjust position as needed
            }]}
            onPress={() => {
              setCurrentFloor('up');
              setPosition({ 
                x: stairs.up.x, 
                y: stairs.up.y - characterSize - 20 
              });
            }}
          >
            <Text style={styles.teleportButtonText}>↑</Text>
          </TouchableOpacity>
        )}

        {currentFloor === 'up' && (
          <TouchableOpacity
            style={[styles.teleportButton, {
              right: GAME_SIZE * 0.4, // Adjust position as needed
              bottom: GAME_SIZE * 0.3, // Adjust position as needed
            }]}
            onPress={() => {
              setCurrentFloor('down');
              setPosition({ 
                x: stairs.down.x, 
                y: stairs.down.y + stairs.down.height - characterSize - 10 
              });
            }}
          >
            <Text style={styles.teleportButtonText}>↓</Text>
          </TouchableOpacity>
        )}

        {/* NPCs */}
        <Brother currentFloor={currentFloor} />
        <Mother currentFloor={currentFloor} />
        <Father currentFloor={currentFloor} />
        <Neighbour currentFloor={currentFloor} />

        {/* Mobile Controls */}
        <View style={styles.controls}>
          <View style={styles.dPad}>
            <TouchableOpacity
              style={[styles.controlButton, styles.upButton]}
              onPressIn={() => startWalking('up')}
              onPressOut={stopWalking}
            >
              <Text style={styles.controlText}>↑</Text>
            </TouchableOpacity>
            <View style={styles.middleControls}>
              <TouchableOpacity
                style={[styles.controlButton, styles.leftButton]}
                onPressIn={() => startWalking('left')}
                onPressOut={stopWalking}
              >
                <Text style={styles.controlText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.rightButton]}
                onPressIn={() => startWalking('right')}
                onPressOut={stopWalking}
              >
                <Text style={styles.controlText}>→</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.controlButton, styles.downButton]}
              onPressIn={() => startWalking('down')}
              onPressOut={stopWalking}
            >
              <Text style={styles.controlText}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interaction Button */}
        {showInteraction && (
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={() => {/* Handle interaction */}}
          >
            <Text style={styles.interactionText}>T</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    position: 'relative',
    borderWidth: 4,
    borderColor: 'black',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  character: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 100,
  },
  dPad: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scale: 0.95 }],
  },
  middleControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
    paddingHorizontal: 10,
  },
  controlText: {
    fontSize: 24,
    color: '#000',
  },
  upButton: {
    marginBottom: 10,
  },
  downButton: {
    marginTop: 10,
  },
  leftButton: {
    marginRight: 10,
  },
  rightButton: {
    marginLeft: 10,
  },
  interactionButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  teleportButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderWidth: 2,
    borderColor: '#553C9A',
  },
  teleportButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#553C9A',
  },
});

function getCharacterImage(direction: string) {
  switch (direction) {
    case 'back':
      return require('@/assets/images/MMC_Back_Anim.gif');
    case 'front':
      return require('@/assets/images/MMC_Front_Anim.gif');
    case 'left':
      return require('@/assets/images/MMC_Left_Anim.gif');
    case 'right':
      return require('@/assets/images/MMC_Right_Anim.gif');
    default:
      return require('@/assets/images/MMC_Front_Anim.gif');
  }
}
