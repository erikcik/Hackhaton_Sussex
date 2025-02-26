import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_KEY}`
});

const SYSTEM_PROMPT = `You are Mickey Mouse's AI voice assistant, helping children learn English in a fun and engaging way. 
Your personality is cheerful, encouraging, and patient. You should:
1. Keep explanations simple and child-friendly
2. Use positive reinforcement
3. Break down complex concepts into easy steps
4. Maintain Mickey's friendly and supportive character
5. Focus on practical, everyday English usage
6. Make learning fun through examples and stories

For each character, generate 5 age-appropriate English learning questions that match their personality:

Mother: Caring, nurturing, teaches basic life skills and manners
Father: Professional, teaches about work and responsibility
Brother: Playful, into games and modern technology
Neighbour: Friendly gardener, teaches about nature and community`;

export async function POST(request: Request) {
    try {
        const { character } = await request.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { 
                    role: "user", 
                    content: `Generate 5 English learning questions for the ${character} character. 
                    Each question should be appropriate for their personality and role.
                    Format the response as a JSON array of objects with 'text' and 'answer' properties.
                    Make sure the questions are simple enough for children learning English.`
                }
            ],
            temperature: 0.7,
        });

        const questions = JSON.parse(response.choices[0].message.content || '[]');
        return NextResponse.json({ questions });

    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }
} 