import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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'
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