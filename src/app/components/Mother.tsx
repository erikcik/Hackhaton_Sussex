interface MotherProps {
  currentFloor: string;
}

export default function Mother({ currentFloor }: MotherProps) {
  return (
    <>
      {currentFloor === 'down' && (
        <>
          <div
            className="absolute"
            style={{
              left: `520px`,
              top: `280px`,
              width: `150px`,
              height: `150px`,
              zIndex: 9,
            }}
          >
            <img 
              src="/mickey_moving/MMC_Mother.png"
              alt="Mother"
              style={{ 
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Add Exclamation Mark above Mother */}
          <div
            className="absolute"
            style={{
              left: `555px`,
              top: `230px`,
              width: `75px`,
              height: `75px`,
              zIndex: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* White Circle Background */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'white',
                filter: 'blur(25px)',
                zIndex: 7,
              }}
            />
            <img 
              src="/mickey_moving/ExclamationMark (1).png"
              alt="Exclamation Mark"
              style={{ 
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
                zIndex: 8,
              }}
            />
          </div>

          {/* Debug: Mother's Exclamation Mark Collision Box */}
          <div
            className="absolute opacity-50"
            style={{
              left: `535px`,
              top: `280px`,
              width: `120px`,
              height: `150px`,
              zIndex: 5,
            }}
          />
        </>
      )}
    </>
  );
} 