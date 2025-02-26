import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_KEY}`
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return new Response('No audio file provided', { status: 400 });
        }

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
        });

        return new Response(JSON.stringify({ text: transcription.text }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Transcription error:', error);
        return new Response('Error processing audio', { status: 500 });
    }
} 