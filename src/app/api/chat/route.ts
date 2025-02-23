import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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'
});

export async function POST(request: Request) {
    try {
        const { question, context, isFollowUp } = await request.json();

        let prompt;
        if (isFollowUp) {
            prompt = `Question: ${question}\nContext: This is a follow-up question about ${context}. Please provide a child-friendly explanation.`;
        } else {
            prompt = `Please explain this concept in a child-friendly way: ${question}\nMake sure to break down the explanation into simple terms and include examples if possible.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        return new Response(JSON.stringify({ 
            explanation: completion.choices[0].message.content 
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('GPT error:', error);
        return new Response('Error generating explanation', { status: 500 });
    }
} 