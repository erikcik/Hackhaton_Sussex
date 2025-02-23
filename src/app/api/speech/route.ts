import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = 'sk_aeec6c0f218715a81f9b9d79fe819096de7da261d87c037a';

// Define voice IDs for different characters
const characterVoices = {
    mother: 'pNInz6obpgDQGcFmaJgB', // Female voice
    father: 'VR6AewLTigWG4xSOukaG', // Male voice
    brother: 'ThT5KcBeYPX3keUQqHPh', // Default Mickey-like voice
    neighbour: 'ThT5KcBeYPX3keUQqHPh' // Default Mickey-like voice
};

// Define character pitch settings
const characterPitches = {
    mother: 1.3,  // Higher pitch for mother
    father: 0.7,  // Lower pitch for father
    brother: 1.1, // Slightly higher for brother
    neighbour: 0.9 // Slightly lower for neighbour
};

export async function POST(request: Request) {
    try {
        const { text, characterId } = await request.json();
        
        // Get the appropriate voice ID for the character
        const voiceId = characterVoices[characterId as keyof typeof characterVoices] || 'ThT5KcBeYPX3keUQqHPh';
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    pitch: characterPitches[characterId as keyof typeof characterPitches] || 1,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate speech');
        }

        const audioBuffer = await response.arrayBuffer();
        
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString()
            }
        });
    } catch (error) {
        console.error('Speech generation error:', error);
        return new NextResponse('Error generating speech', { status: 500 });
    }
} 