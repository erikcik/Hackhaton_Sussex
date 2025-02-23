import { useMemo } from 'react';

interface FlowerProps {
  count: number;
}

export default function Flowers({ count }: FlowerProps) {
  const FLOWER_SIZE = 48;
  const MIN_DISTANCE = FLOWER_SIZE + 80; // Large gap between flowers
  
  // Fixed game area dimensions
  const GAME_WIDTH = 1024;
  const GAME_HEIGHT = 768;

  const flowerPositions = useMemo(() => {
    const positions = [];
    const houseArea = {
      left: 400,
      right: 1200,
      top: 300,
      bottom: 1100
    };

    // Add corner flowers first
    const cornerPositions = [
      { left: 20, top: 20 },                    // Top-left
      { left: GAME_WIDTH - 100, top: 20 },      // Top-right
      { left: 20, top: GAME_HEIGHT - 100 },     // Bottom-left
      { left: GAME_WIDTH - 100, top: GAME_HEIGHT - 100 }  // Bottom-right
    ];
    
    positions.push(...cornerPositions);

    const isTooClose = (newPos: { left: number, top: number }) => {
      return positions.some(pos => {
        const distance = Math.sqrt(
          Math.pow(newPos.left - pos.left, 2) + 
          Math.pow(newPos.top - pos.top, 2)
        );
        return distance < MIN_DISTANCE;
      });
    };

    // Add remaining flowers
    let attempts = 0;
    while (positions.length < 50 && attempts < 1000) {
      let left = Math.floor(Math.random() * (GAME_WIDTH - FLOWER_SIZE));
      let top = Math.floor(Math.random() * (GAME_HEIGHT - FLOWER_SIZE));
      
      const newPos = { left, top };

      if (
        !(left > houseArea.left && left < houseArea.right && 
          top > houseArea.top && top < houseArea.bottom) &&
        !isTooClose(newPos)
      ) {
        positions.push(newPos);
      }
      attempts++;
    }

    return positions;
  }, []); 

  return (
    <>
      {flowerPositions.slice(0, count).map((position, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: `${FLOWER_SIZE}px`,
            height: `${FLOWER_SIZE}px`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/mickey_moving/flower.png"
            alt="Flower"
            style={{
              imageRendering: 'pixelated',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      ))}
    </>
  );
} 