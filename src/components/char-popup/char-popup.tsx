'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from './char-popup.module.css';

interface Question {
    text: string;
    answer: string;
}

export default function CharPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [text, setText] = useState("");
    const [heartCount, setHeartCount] = useState(3);
    const [disappearingHeart, setDisappearingHeart] = useState<number | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mickeyResponse, setMickeyResponse] = useState("");
    const fullText = "Hi! I'm Mickey Mouse! Welcome to our magical world!";
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [userQuestion, setUserQuestion] = useState("");
    const [isMicrophoneExpanded, setIsMicrophoneExpanded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const questions: Question[] = [
        {
            text: "What is 2 + 3?",
            answer: "5"
        },
        {
            text: "What is 10 - 4?",
            answer: "6"
        },
        {
            text: "What is 3 × 2?",
            answer: "6"
        },
        {
            text: "What is 8 ÷ 2?",
            answer: "4"
        },
        {
            text: "What is 7 + 5?",
            answer: "12"
        }
    ];

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

    const removeHeart = () => {
        if (heartCount > 0) {
            setDisappearingHeart(heartCount - 1);
            setTimeout(() => {
                setHeartCount(prev => prev - 1);
                setDisappearingHeart(null);
            }, 800);
        }
    };

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentAnswer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            // Correct answer
            if (currentQuestionIndex === questions.length - 1) {
                // Last question completed
                setMickeyResponse("Well done! You completed this level!");
                setTimeout(() => {
                    setIsCompleted(true);  // Start fade out animation
                    setTimeout(() => {
                        setIsOpen(false);  // Close popup after animation
                    }, 1000);
                }, 2000);
            } else {
                setMickeyResponse("Well done! That's correct!");
                setTimeout(() => {
                    setMickeyResponse("");
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 1500);
            }
        } else {
            // Incorrect answer
            setMickeyResponse("Oops! That's not correct. Try again!");
            if (heartCount > 0) {
                setDisappearingHeart(heartCount - 1);
                setTimeout(() => {
                    setHeartCount(prev => {
                        const newHeartCount = prev - 1;
                        if (newHeartCount === 0) {
                            // Show second popup immediately when shrink starts
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

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle the question submission here
        console.log("Question submitted:", userQuestion);
        setUserQuestion(""); // Clear input after submission
    };

    const handleMicrophoneClick = () => {
        setIsMicrophoneExpanded(!isMicrophoneExpanded);
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

            {/* Hearts container */}
            {isOpen && (
                <div className="fixed top-4 right-4 z-[1002]">
                    {/* Remove heart button */}
                    <Button
                        variant="outline"
                        className="mb-2 w-full"
                        onClick={removeHeart}
                    >
                        Remove Heart
                    </Button>
                    
                    {/* Only show background if there are hearts */}
                    {heartCount > 0 && (
                        <div className="bg-white rounded-md p-1" style={{ width: '168px' }}>
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
                        </div>
                    )}
                </div>
            )}

            <Button
                variant="default"
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    zIndex: 1000,
                }}
                onClick={() => setIsOpen(true)}
            >
                Open Popup
            </Button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[1001]">
                    <div className={`absolute inset-0 bg-black/50 transition-opacity duration-1000 ${
                        isCompleted ? 'opacity-0' : 'opacity-100'
                    }`} onClick={() => setIsOpen(false)} />
                    
                    <div className={`relative w-[70%] h-[70%] bg-white rounded-lg shadow-xl ${
                        styles.animatePopup
                    } ${
                        heartCount === 0 ? styles.animatePopupShrink : ''
                    } ${
                        isCompleted ? styles.animatePopupFadeOut : ''
                    }`}>
                        <Button
                            variant="ghost"
                            className="absolute top-2 right-2 z-[1002]"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </Button>
                        
                        <div className="p-6 h-full flex flex-col items-center justify-center">
                            <div className="text-lg font-medium mb-2">
                                Question {currentQuestionIndex + 1}/5
                            </div>
                            <div className={`relative w-[500px] h-[500px] transition-all duration-800`}>
                                <Image
                                    src="/images/mickey_speek_Anim.gif"
                                    alt="Mickey Mouse"
                                    width={500}
                                    height={500}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                            <div className="text-2xl font-bold mt-4 text-center">
                                {mickeyResponse || questions[currentQuestionIndex].text}
                            </div>
                            {/* Only show form if hearts are not zero */}
                            {heartCount > 0 && (
                                <form onSubmit={handleAnswerSubmit} className="mt-6 w-full max-w-md">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentAnswer}
                                            onChange={(e) => setCurrentAnswer(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                        <Button type="submit" variant="default">
                                            Answer
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Second popup */}
            {isOpen && showSecondPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-[1001]">
                    <div className={`relative w-[70%] h-[70%] bg-white rounded-lg shadow-xl ${styles.animatePopupFromLeft}`}>
                        <Button
                            variant="ghost"
                            className="absolute top-2 right-2 z-[1002]"
                            onClick={() => {
                                setShowSecondPopup(false);
                                setIsOpen(false);
                            }}
                        >
                            ✕
                        </Button>
                        
                        <div className="p-6 h-full flex flex-row items-center justify-between">
                            {/* Text on the left */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-4">
                                        Let's learn it!
                                    </div>
                                    <div className="text-lg text-gray-700 leading-relaxed">
                                        English grammar is the set of structural rules of the English language.
                                        <br />
                                        This includes the structure of words,
                                        <br />
                                        phrases, clauses, sentences, and whole texts.
                                    </div>
                                </div>
                            </div>

                            {/* Mickey and chat input on the right */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-[500px] h-[500px] mb-[-50px]">
                                    <Image
                                        src="/images/mickey_speek_Anim.gif"
                                        alt="Mickey Mouse"
                                        width={500}
                                        height={500}
                                        style={{ objectFit: 'contain' }}
                                        priority
                                    />
                                </div>
                                
                                {/* Chat input section */}
                                <form 
                                    onSubmit={handleQuestionSubmit}
                                    className="w-[80%] flex gap-2 relative z-10"
                                >
                                    <div className="flex-1 relative flex items-center">
                                        <div 
                                            onClick={handleMicrophoneClick}
                                            className="cursor-pointer absolute left-3 flex items-center gap-2"
                                        >
                                            <Image
                                                src="/images/microfone.png"
                                                alt="Microphone Icon"
                                                width={32}
                                                height={32}
                                                className={`hover:opacity-80 transition-all duration-200 ${
                                                    isMicrophoneExpanded ? 'scale-[1.5]' : 'hover:scale-110'
                                                }`}
                                            />
                                            {isMicrophoneExpanded && (
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={userQuestion}
                                            onChange={(e) => setUserQuestion(e.target.value)}
                                            placeholder="Ask Mickey a question..."
                                            className="flex-1 px-20 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        variant="default"
                                        className="h-[50px]"
                                    >
                                        Ask
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}