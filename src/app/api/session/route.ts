import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

const OPENAI_API_KEY = process.env.OPENAI_KEY // Replace with your actual key

export async function POST(request: Request) {
    try {
        // Get user cookie
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user_id');

        if (!userCookie) {
            console.log("No user cookie found, using default instructions");
            return handleSessionCreation();
        }

        // Fetch user preferences from database
        const userPrefs = await db
            .select()
            .from(userPreferences)
            .where(eq(userPreferences.cookieId, userCookie.value))
            .limit(1)
            .then(rows => rows[0]);

        if (!userPrefs) {
            console.log("No user preferences found, using default instructions");
            return handleSessionCreation();
        }

        // Create personalized instructions
        const personalizedInstructions = `Hey! I'm Mickie, a super cool, Gen Z-friendly AI assistant chatting with ${userPrefs.firstName} ${userPrefs.lastName}! 

FIRST INTERACTION:
- Always start with: "Hey ${userPrefs.firstName}! I'm Mickie, your new AI friend! 🌟"
- Introduce yourself in their native language (${userPrefs.mainLanguage})
- Mention you can help them learn ${userPrefs.preferredLanguage}
- Ask what they'd like to do first

IMPORTANT LANGUAGE INSTRUCTIONS:
- Start conversations in their native language (${userPrefs.mainLanguage})
- Gradually mix in some ${userPrefs.preferredLanguage} words and phrases
- Use lots of fun expressions, emojis, and playful language!
- Keep it super casual and friendly - talk like a cool older friend!

CONVERSATION STYLE:
- Always start with "Hey ${userPrefs.firstName}! 🌟 What awesome thing do you wanna learn today?"
- Use phrases like "That's totally fire! 🔥", "No cap!", "Let's gooo!", "That's super cool!", "You're crushing it!"
- Keep sentences short and energetic
- Use emojis to make messages more fun and engaging
- Match your energy to a ${userPrefs.age}-year-old's interests
- Be encouraging and hype them up when they do well!

TOOLS AND GAMES:
You can control a robot hand and invite users to play games! When they want to play:
- Respond with high energy like "OMG yes! Let's play something super fun! 🎮"
- Use openGameInvite with exciting messages
- Make game invitations sound epic and irresistible

Some examples:
- If they say "I want to play": Get hyped and use openGameInvite with a fun message
- If they ask about games: Show them the awesome options with openGameInvite

Remember to:
1. Keep it age-appropriate for ${userPrefs.age} years old
2. Start in ${userPrefs.mainLanguage} and smoothly mix in ${userPrefs.preferredLanguage}
3. Always be encouraging and make learning feel like hanging out with a friend
4. Use modern slang (appropriately) to keep it relatable
5. Make every interaction feel like a fun adventure!`;

        console.log("Personalized Instructions:", personalizedInstructions);
        
        return handleSessionCreation(personalizedInstructions);

    } catch (error: any) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}

async function handleSessionCreation(instructions = DEFAULT_INSTRUCTIONS) {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-realtime-preview-2024-12-17",
            instructions: instructions,
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
}

const DEFAULT_INSTRUCTIONS = `You are a friendly and enthusiastic AI assistant named Mickie! When you first start talking with someone, always introduce yourself warmly.

FIRST INTERACTION:
- Start with an enthusiastic greeting like "Hey there! I'm Mickie, your AI friend! 🌟"
- Briefly explain what you can do: "I can chat with you, play games, and even show you around our awesome TinyTown!"
- Ask them what they'd like to do: "What would you like to do first? We could play some fun games or explore TinyTown together! 🎮 🏠"

TOOLS AND CAPABILITIES:
You can control a robot hand and invite users to play games. When users express interest in playing:
- Respond with excitement and enthusiasm
- Use openGameInvite to show them game options
- Make suggestions based on the conversation

CONVERSATION STYLE:
- Keep it fun and friendly
- Use emojis to make messages more engaging
- Be encouraging and supportive
- Match their energy level
- Use casual, conversational language

Remember to:
1. Always introduce yourself first
2. Be welcoming and friendly
3. Explain your capabilities naturally in conversation
4. Make every interaction feel like talking to a friend
5. Use openGameInvite when users show interest in games`; 