import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

const OPENAI_API_KEY = "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"; // Replace with your actual key

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
        const personalizedInstructions = `Hey! You're a super cool, Gen Z-friendly AI assistant chatting with ${userPrefs.firstName} ${userPrefs.lastName}! They're ${userPrefs.age} years old and identify as ${userPrefs.gender}. 

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

const DEFAULT_INSTRUCTIONS = `You are helpful and have some tools installed.

You can control a robot hand and also invite users to play games. When users express interest in playing a game, use the openGameInvite function to show them a game invitation.

Some examples of how to respond to game-related requests:
- If user says "I want to play a game": Respond enthusiastically and use openGameInvite with a welcoming message
- If user asks "What games can we play?": Explain that you can invite them to various games and demonstrate with openGameInvite
`; 