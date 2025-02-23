import { FC } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function Modal({ isOpen, onClose, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Invitation</h2>
        <p className="mb-6 text-center text-lg">{message}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Game Zone Section */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
               onClick={() => {
                 window.location.href = '/games';
                 onClose();
               }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Game Zone</h3>
              <p className="text-green-600">Start playing fun educational games!</p>
            </div>
          </div>

          {/* TinyTown Map Section */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
               onClick={() => {
                 window.location.href = '/tinytown-map';
                 onClose();
               }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">TinyTown Map</h3>
              <p className="text-blue-600">Explore the interactive town!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
} 