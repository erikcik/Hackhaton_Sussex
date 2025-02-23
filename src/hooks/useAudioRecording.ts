import { useState, useCallback } from 'react';

export const useAudioRecording = (onTranscriptionComplete: (text: string) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [interimTranscript, setInterimTranscript] = useState('');

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
                audioBitsPerSecond: 16000
            });
            
            const audioChunks: Blob[] = [];
            let lastTranscriptionTime = Date.now();
            const TRANSCRIPTION_INTERVAL = 2000; // Send for transcription every 2 seconds

            recorder.ondataavailable = async (e) => {
                audioChunks.push(e.data);
                
                // Check if enough time has passed for a new transcription
                const now = Date.now();
                if (now - lastTranscriptionTime >= TRANSCRIPTION_INTERVAL) {
                    lastTranscriptionTime = now;
                    
                    // Create a blob from accumulated chunks
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recording.webm');

                    try {
                        const response = await fetch('/api/transcribe', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) throw new Error('Transcription failed');

                        const { text } = await response.json();
                        // Update the input field in real-time
                        onTranscriptionComplete(text);
                        setInterimTranscript(text);
                    } catch (error) {
                        console.error('Error transcribing audio:', error);
                    }
                }
            };

            // Set a shorter timeslice to get data more frequently
            recorder.start(1000); // Get data every second
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [onTranscriptionComplete]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            setMediaRecorder(null);
            setInterimTranscript('');
            
            // Clean up the stream
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }, [mediaRecorder, isRecording]);

    return {
        isRecording,
        startRecording,
        stopRecording,
        interimTranscript
    };
}; 