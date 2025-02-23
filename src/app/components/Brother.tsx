interface BrotherProps {
  currentFloor: string;
}

export default function Brother({ currentFloor }: BrotherProps) {
  return (
    <>
      {currentFloor === 'up' && (
        <>
          <div
            className="absolute"
            style={{
              left: `600px`,
              top: `500px`,
              width: `150px`,
              height: `150px`,
              zIndex: 9,
            }}
          >
            <img 
              src="/mickey_moving/MMC_Brother.png"
              alt="Brother"
              style={{ 
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Add Exclamation Mark above Brother */}
          <div
            className="absolute"
            style={{
              left: `638px`,
              top: `450px`,
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
                top: 0,
                left: 0,
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

          {/* Debug: Brother's Exclamation Mark Collision Box */}
          <div
            className="absolute opacity-50"
            style={{
              left: `615px`,
              top: `500px`,
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