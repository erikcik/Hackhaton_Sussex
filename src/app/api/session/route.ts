import { NextResponse } from 'next/server';

const OPENAI_API_KEY = "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";
const DEFAULT_INSTRUCTIONS = `You are helpful and have some tools installed.

In the tools you have the ability to control a robot hand.
`;

export async function POST(request: Request) {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                instructions: DEFAULT_INSTRUCTIONS,
                voice: "ash",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenAI API Error:", errorText);
            return NextResponse.json({ error: `OpenAI API Error: ${response.status} - ${errorText}` }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ result });

    } catch (error: any) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
} 