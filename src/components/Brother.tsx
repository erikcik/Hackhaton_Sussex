// Update Brother component to check completed status
interface BrotherProps {
    currentFloor: string;
    isCompleted?: boolean;
}

export default function Brother({ currentFloor, isCompleted }: BrotherProps) {
    if (currentFloor !== 'up') return null;

    return (
        <div className="absolute" style={{ left: '650px', top: '500px', width: '120px', height: '150px' }}>
            <img
                src="/mickey_moving/MMC_Brother_FrontUp_Anim.gif"
                alt="Brother"
                style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
            {!isCompleted && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    !
                </div>
            )}
        </div>
    );
} 