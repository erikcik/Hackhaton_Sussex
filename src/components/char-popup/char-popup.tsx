'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from './char-popup.module.css';
import { Character } from "@/types/character-types";
import { useAudioRecording } from '@/hooks/useAudioRecording';

interface Question {
    text: string;
    answer: string;
}

interface CharPopupProps {
    character: Character;
    onClose: () => void;
    onQuestionComplete: (characterId: string, questionIndex: number, completed?: boolean) => void;
}

export default function CharPopup({ character, onClose, onQuestionComplete }: CharPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [text, setText] = useState("");
    const [heartCount, setHeartCount] = useState(3);
    const [disappearingHeart, setDisappearingHeart] = useState<number | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(character.currentQuestionIndex);
    const [mickeyResponse, setMickeyResponse] = useState("");
    const fullText = `Hi! I'm ${character.name}! Welcome to our magical world!`;
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [userQuestion, setUserQuestion] = useState("");
    const [isMicrophoneExpanded, setIsMicrophoneExpanded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    const questions = character.questions;

    // Update the audio recording hooks to handle interim transcripts
    const { isRecording: isAnswerRecording, startRecording: startAnswerRecording, stopRecording: stopAnswerRecording, interimTranscript: answerTranscript } 
        = useAudioRecording((text) => setCurrentAnswer(prev => prev + ' ' + text));
    
    const { isRecording: isQuestionRecording, startRecording: startQuestionRecording, stopRecording: stopQuestionRecording, interimTranscript: questionTranscript } 
        = useAudioRecording((text) => setUserQuestion(prev => prev + ' ' + text));

    useEffect(() => {
        if (!isOpen) {
            setText("");
            setCurrentCharIndex(0);
            return;
        }

        const typingInterval = setInterval(() => {
            if (currentCharIndex < fullText.length) {
                setText(prev => prev + fullText[currentCharIndex]);
                setCurrentCharIndex(prev => prev + 1);
            } else {
                clearInterval(typingInterval);
            }
        }, 50); 
        return () => clearInterval(typingInterval);
    }, [isOpen, currentCharIndex]);

    useEffect(() => {
        // Auto-open the popup when component mounts
        setIsOpen(true);
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const removeHeart = () => {
        if (heartCount > 0) {
            setDisappearingHeart(heartCount - 1);
            setTimeout(() => {
                setHeartCount(prev => prev - 1);
                setDisappearingHeart(null);
            }, 800);
        }
    };

    const fetchExplanation = async (question: string, isFollowUp = false) => {
        setIsLoadingExplanation(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    context: questions[currentQuestionIndex].text,
                    isFollowUp
                }),
            });

            if (!response.ok) throw new Error('Failed to get explanation');

            const data = await response.json();
            if (isFollowUp) {
                setChatHistory(prev => [...prev, { 
                    question, 
                    answer: data.explanation 
                }]);
            } else {
                setExplanation(data.explanation);
            }
        } catch (error) {
            console.error('Error fetching explanation:', error);
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    const handleAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentAnswer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            if (currentQuestionIndex === questions.length - 1) {
                setMickeyResponse("Well done! You completed this level!");
                onQuestionComplete(character.id, currentQuestionIndex, true);
                setTimeout(() => {
                    setIsCompleted(true);
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                }, 2000);
            } else {
                setMickeyResponse("Well done! That's correct!");
                onQuestionComplete(character.id, currentQuestionIndex);
                
                // Clear current answer and error count for next question
                setCurrentAnswer("");
                setErrorCount(0);
                
                // Wait for the success message, then move to next question
                setTimeout(() => {
                    setMickeyResponse("");
                    setCurrentQuestionIndex(prev => prev + 1);
                    // Play the next question's audio
                    playCharacterSpeech(questions[currentQuestionIndex + 1].text);
                }, 1500);
            }
        } else {
            setMickeyResponse("Oops! That's not correct. Try again!");
            setErrorCount(prev => {
                const newCount = prev + 1;
                if (newCount === 3) {
                    fetchExplanation(questions[currentQuestionIndex].text);
                    setShowSecondPopup(true);
                }
                return newCount;
            });
            if (heartCount > 0) {
                setDisappearingHeart(heartCount - 1);
                setTimeout(() => {
                    setHeartCount(prev => {
                        const newHeartCount = prev - 1;
                        if (newHeartCount === 0) {
                            setShowSecondPopup(true);
                        }
                        return newHeartCount;
                    });
                    setDisappearingHeart(null);
                    setMickeyResponse("");
                }, 800);
            }
        }
        setCurrentAnswer("");
    };

    // Add effect to read explanation when it's loaded
    useEffect(() => {
        if (!isLoadingExplanation && explanation && showSecondPopup) {
            playCharacterSpeech("Let's learn it! " + explanation);
        }
    }, [isLoadingExplanation, explanation, showSecondPopup]);

    // Add function to handle chat response voice-over
    const handleChatResponse = (question: string, answer: string) => {
        playCharacterSpeech(answer);
    };

    // Update handleQuestionSubmit to include voice-over
    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userQuestion.trim()) return;

        setChatHistory(prev => [...prev, { 
            question: userQuestion, 
            answer: '...' 
        }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: userQuestion,
                    context: questions[currentQuestionIndex].text,
                    isFollowUp: true
                }),
            });

            if (!response.ok) throw new Error('Failed to get explanation');

            const data = await response.json();
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].answer = data.explanation;
                return newHistory;
            });
            
            // Voice-over the response
            handleChatResponse(userQuestion, data.explanation);
        } catch (error) {
            console.error('Error fetching explanation:', error);
        }
        
        setUserQuestion('');
    };

    // Update the microphone click handlers
    const handleMicrophoneClick = () => {
        if (isQuestionRecording) {
            stopQuestionRecording();
        } else {
            setUserQuestion(''); // Clear previous input when starting new recording
            startQuestionRecording();
        }
        setIsMicrophoneExpanded(!isMicrophoneExpanded);
    };

    const handleAnswerMicrophoneClick = () => {
        if (isAnswerRecording) {
            stopAnswerRecording();
        } else {
            setCurrentAnswer(''); // Clear previous input when starting new recording
            startAnswerRecording();
        }
    };

    const handleBackgroundClick = () => {
        setIsCompleted(true);
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    // Add a helper function to get the character's GIF path
    const getCharacterGifPath = (characterId: string) => {
        const characterPaths = {
            brother: '/front_movs/MMC_Brother_FrontUp_Anim.gif',
            neighbour: '/front_movs/MMC_Neighbour_FrontUp_Anim.gif',
            mother: '/front_movs/MMC_Mother_FrontUp_Anim.gif',
            father: '/front_movs/MMC_Father_FrontUp_Anim.gif'
        };
        return characterPaths[characterId as keyof typeof characterPaths];
    };

    // Add helper function to get character's static image path
    const getCharacterStaticPath = (characterId: string) => {
        const characterPaths = {
            brother: '/mickey_photos/mickey_brother.png',
            neighbour: '/mickey_photos/mickey_neighbor.png',
            mother: '/mickey_photos/mickey_mother.png',
            father: '/mickey_photos/mickey_father.png'
        };
        return characterPaths[characterId as keyof typeof characterPaths];
    };

    // Update the playCharacterSpeech function to handle streaming
    const playCharacterSpeech = async (text: string) => {
        try {
            // Stop any existing audio
            if (audioElement) {
                audioElement.pause();
                audioElement.remove();
            }

            const response = await fetch('/api/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    characterId: character.id
                }),
            });

            if (!response.ok) throw new Error('Failed to generate speech');

            // Create blob from the response
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create and configure audio element
            const audio = new Audio(audioUrl);
            audio.controls = false;
            audio.autoplay = true;
            
            // Add event listeners
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
                audio.remove();
                setAudioElement(null);
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
                audio.remove();
                setAudioElement(null);
            });

            // Start playing
            setAudioElement(audio);
            setIsPlaying(true);
            document.body.appendChild(audio);
            await audio.play();

        } catch (error) {
            console.error('Error playing speech:', error);
            setIsPlaying(false);
        }
    };

    // Add cleanup effect
    useEffect(() => {
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.remove();
            }
        };
    }, [audioElement]);

    // Add auto-play when popup opens
    useEffect(() => {
        if (isOpen && questions[currentQuestionIndex]) {
            playCharacterSpeech(questions[currentQuestionIndex].text);
        }
    }, [isOpen, currentQuestionIndex]);

    // Update the play button click handler
    const handlePlayClick = () => {
        if (isPlaying && audioElement) {
            audioElement.pause();
            audioElement.remove();
            setAudioElement(null);
            setIsPlaying(false);
        } else {
            playCharacterSpeech(mickeyResponse || questions[currentQuestionIndex].text);
        }
    };

    return (
        <>
            <style>{`
                @keyframes heartPop {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-heart-pop {
                    animation: heartPop 0.5s ease-out forwards;
                }
            `}</style>

            {isOpen && (
                <>
                    <div className="fixed inset-0 flex items-center justify-center z-[1001]">
                        <div 
                            className={`absolute inset-0 bg-black/50 transition-opacity duration-1000 ${
                                isCompleted ? 'opacity-0' : 'opacity-100'
                            }`} 
                            onClick={handleBackgroundClick}
                        />
                        
                        <div className={`relative w-[80%] h-[80%] max-h-[800px] bg-white rounded-lg shadow-xl overflow-hidden ${
                            styles.animatePopup
                        } ${
                            heartCount === 0 ? styles.animatePopupShrink : ''
                        } ${
                            isCompleted ? styles.animatePopupFadeOut : ''
                        }`}>
                            <div className="p-6 h-full flex flex-col">
                                {/* Top section with hearts */}
                                <div className="absolute top-4 right-4">
                                    {heartCount > 0 && (
                                        <div className="flex gap-2">
                                            {[...Array(heartCount)].map((_, index) => (
                                                <div 
                                                    key={index}
                                                    className={`w-12 h-12 relative ${styles.animateHeartPop} ${
                                                        disappearingHeart === index ? styles.animateHeartDisappear : ''
                                                    }`}
                                                    style={{ 
                                                        animationDelay: disappearingHeart === index ? '0ms' : `${index * 100}ms`
                                                    }}
                                                >
                                                    <Image
                                                        src="/images/heart.png"
                                                        alt="Heart"
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                        className="z-[2] relative"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Question counter */}
                                <div className="text-lg font-medium mb-4 text-center">
                                    Question {currentQuestionIndex + 1}/{questions.length}
                                </div>

                                {/* Mickey and question section */}
                                <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                                    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={isPlaying ? getCharacterGifPath(character.id) : getCharacterStaticPath(character.id)}
                                                alt={`${character.name} Character`}
                                                fill
                                                className="object-contain"
                                                style={{ 
                                                    imageRendering: 'pixelated',
                                                    mixBlendMode: 'multiply'
                                                }}
                                                priority
                                            />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold mt-4 mb-6 text-center flex items-center justify-center gap-4">
                                        <button
                                            onClick={handlePlayClick}
                                            className={`p-2 rounded-full transition-all duration-200 ${
                                                isPlaying ? 'bg-red-100 hover:bg-red-200' : 'bg-blue-100 hover:bg-blue-200'
                                            }`}
                                        >
                                            <Image
                                                src={isPlaying ? "/images/pause-icon.svg" : "/images/play-icon.svg"}
                                                alt={isPlaying ? "Pause Voice" : "Play Voice"}
                                                width={24}
                                                height={24}
                                                className="transition-transform hover:scale-110"
                                            />
                                        </button>
                                        <span>{mickeyResponse || questions[currentQuestionIndex].text}</span>
                                    </div>
                                </div>

                                {/* Answer section */}
                                {heartCount > 0 && (
                                    <div className="mt-auto w-full max-w-2xl mx-auto">
                                        <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-4">
                                            {/* Voice input section */}
                                            <div 
                                                onClick={handleAnswerMicrophoneClick}
                                                className={`cursor-pointer flex items-center justify-center p-4 rounded-lg border-2 ${
                                                    isAnswerRecording 
                                                        ? 'border-red-500 bg-red-50' 
                                                        : 'border-blue-300 hover:border-blue-500 bg-blue-50 hover:bg-blue-100'
                                                } transition-all duration-300`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Image
                                                        src="/images/microfone.png"
                                                        alt="Microphone Icon"
                                                        width={48}
                                                        height={48}
                                                        className={`transition-all duration-300 ${
                                                            isAnswerRecording ? 'scale-125' : 'hover:scale-110'
                                                        }`}
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {isAnswerRecording 
                                                            ? "I'm listening... Click to stop" 
                                                            : "Click to answer with voice"
                                                        }
                                                    </span>
                                                    {isAnswerRecording && (
                                                        <div className="flex gap-1 mt-1">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                                style={{ animationDelay: '0ms' }} />
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                                style={{ animationDelay: '300ms' }} />
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                                style={{ animationDelay: '600ms' }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Text input section */}
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <textarea
                                                        value={currentAnswer}
                                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                                        placeholder="Or type your answer here..."
                                                        className="w-full px-4 py-2 text-sm text-gray-600 rounded-lg border border-gray-300 focus:border-gray-400 focus:outline-none resize-none overflow-y-auto min-h-[40px] max-h-[80px]"
                                                        style={{
                                                            height: 'auto',
                                                            minHeight: '40px',
                                                            maxHeight: '80px'
                                                        }}
                                                        onInput={(e) => {
                                                            const target = e.target as HTMLTextAreaElement;
                                                            target.style.height = 'auto';
                                                            target.style.height = `${Math.min(target.scrollHeight, 80)}px`;
                                                        }}
                                                    />
                                                </div>
                                                <Button 
                                                    type="submit" 
                                                    variant="default" 
                                                    className="self-start px-6"
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>

                                        {/* Current answer display */}
                                        {currentAnswer && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600">Your answer:</p>
                                                <p className="mt-1 text-gray-800">{currentAnswer}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Second popup */}
            {isOpen && showSecondPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-[1001]">
                    <div 
                        className="absolute inset-0 bg-black/50" 
                        onClick={handleBackgroundClick}
                    />
                    <div className={`relative w-[80%] h-[80%] max-h-[800px] bg-white rounded-lg shadow-xl overflow-hidden ${styles.animatePopupFromLeft}`}>
                        <div className="p-6 h-full flex flex-row">
                            {/* Left side: Explanation section */}
                            <div className="flex-1 h-full flex flex-col overflow-hidden pr-6">
                                {/* Title and Explanation section */}
                                <div className="mb-8">
                                    <div className="text-3xl font-bold mb-4 flex items-center gap-4">
                                        <button
                                            onClick={() => playCharacterSpeech("Let's learn it! " + explanation)}
                                            className={`p-2 rounded-full transition-all duration-200 ${
                                                isPlaying ? 'bg-red-100 hover:bg-red-200' : 'bg-blue-100 hover:bg-blue-200'
                                            }`}
                                        >
                                            <Image
                                                src={isPlaying ? "/images/pause-icon.svg" : "/images/play-icon.svg"}
                                                alt={isPlaying ? "Pause Voice" : "Play Voice"}
                                                width={24}
                                                height={24}
                                                className="transition-transform hover:scale-110"
                                            />
                                        </button>
                                        <span>Let's learn it!</span>
                                    </div>
                                    <div className="overflow-y-auto pr-4 custom-scrollbar">
                                        {isLoadingExplanation ? (
                                            <div className="animate-pulse">Loading explanation...</div>
                                        ) : (
                                            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {explanation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Chat history section with divider */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="h-px bg-gray-200 my-6"></div>
                                    <div className="font-semibold text-xl mb-4">Follow-up Questions</div>
                                    <div className="custom-scrollbar">
                                        {chatHistory.map((chat, index) => (
                                            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="font-semibold text-blue-600">
                                                    Q: {chat.question}
                                                </div>
                                                <div className="mt-3 text-gray-700 flex items-start gap-3">
                                                    <button
                                                        onClick={() => playCharacterSpeech(chat.answer)}
                                                        className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                                                            isPlaying ? 'bg-red-100 hover:bg-red-200' : 'bg-blue-100 hover:bg-blue-200'
                                                        }`}
                                                    >
                                                        <Image
                                                            src={isPlaying ? "/images/pause-icon.svg" : "/images/play-icon.svg"}
                                                            alt={isPlaying ? "Pause Voice" : "Play Voice"}
                                                            width={20}
                                                            height={20}
                                                            className="transition-transform hover:scale-110"
                                                        />
                                                    </button>
                                                    <span>A: {chat.answer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Mickey and chat input */}
                            <div className="w-[500px] flex flex-col justify-between h-full">
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={isPlaying ? getCharacterGifPath(character.id) : getCharacterStaticPath(character.id)}
                                                alt={`${character.name} Character`}
                                                fill
                                                className="object-contain"
                                                style={{ 
                                                    imageRendering: 'pixelated',
                                                    mixBlendMode: 'multiply'
                                                }}
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Chat input section with updated styling */}
                                <div className="mt-4 w-full max-w-2xl">
                                    <form 
                                        onSubmit={handleQuestionSubmit}
                                        className="flex flex-col gap-4"
                                    >
                                        {/* Voice input section */}
                                        <div 
                                            onClick={handleMicrophoneClick}
                                            className={`cursor-pointer flex items-center justify-center p-4 rounded-lg border-2 ${
                                                isQuestionRecording 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-blue-300 hover:border-blue-500 bg-blue-50 hover:bg-blue-100'
                                            } transition-all duration-300`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Image
                                                    src="/images/microfone.png"
                                                    alt="Microphone Icon"
                                                    width={48}
                                                    height={48}
                                                    className={`transition-all duration-300 ${
                                                        isQuestionRecording ? 'scale-125' : 'hover:scale-110'
                                                    }`}
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {isQuestionRecording 
                                                        ? "I'm listening... Click to stop" 
                                                        : "Ask your follow-up question with voice"
                                                    }
                                                </span>
                                                {isQuestionRecording && (
                                                    <div className="flex gap-1 mt-1">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                            style={{ animationDelay: '0ms' }} />
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                            style={{ animationDelay: '300ms' }} />
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                                                            style={{ animationDelay: '600ms' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Text input section */}
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <textarea
                                                    value={userQuestion}
                                                    onChange={(e) => setUserQuestion(e.target.value)}
                                                    placeholder="Or type your follow-up question here..."
                                                    className="w-full px-4 py-2 text-sm text-gray-600 rounded-lg border border-gray-300 focus:border-gray-400 focus:outline-none resize-none overflow-y-auto min-h-[40px] max-h-[80px]"
                                                    style={{
                                                        height: 'auto',
                                                        minHeight: '40px',
                                                        maxHeight: '80px'
                                                    }}
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = 'auto';
                                                        target.style.height = `${Math.min(target.scrollHeight, 80)}px`;
                                                    }}
                                                />
                                            </div>
                                            <Button 
                                                type="submit" 
                                                variant="default" 
                                                className="self-start px-6"
                                            >
                                                Ask
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Current question display */}
                                    {userQuestion && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-600">Your question:</p>
                                            <p className="mt-1 text-gray-800">{userQuestion}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom scrollbar styles */}
            <style jsx global>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.5);
                    border-radius: 3px;
                }
            `}</style>
        </>
    );
}