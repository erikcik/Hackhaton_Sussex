import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserPreferences } from '@/types/preferences';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = await cookieStore.get('user_id');

    if (!userCookie) {
      return NextResponse.json(
        { error: 'No user cookie found' },
        { status: 401 }
      );
    }

    const preferences: UserPreferences = await request.json();
    
    // Save preferences to database with cookie ID
    await db.insert(userPreferences).values({
      cookieId: userCookie.value,
      firstName: preferences.firstName,
      lastName: preferences.lastName,
      gender: preferences.gender,
      mainLanguage: preferences.mainLanguage,
      preferredLanguage: preferences.preferredLanguage,
      age: preferences.age
    });
    
    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to check for existing preferences
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = await cookieStore.get('user_id');

    if (!userCookie) {
      return NextResponse.json({ preferences: null });
    }

    const existingPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.cookieId, userCookie.value))
      .limit(1)
      .then(rows => rows[0]);

    return NextResponse.json({ preferences: existingPreferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
} 