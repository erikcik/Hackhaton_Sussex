'use server'

import { cookies } from 'next/headers'
import { db } from '@/db'
import { userPreferences, type UserPreferences } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function checkUserPreferences(): Promise<UserPreferences | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user_id')

  if (!userCookie) {
    return null
  }

  const existingPreferences = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.cookieId, userCookie.value))
    .limit(1)
    .then(rows => rows[0] || null)

  return existingPreferences
}

export async function saveUserPreferences(
  preferences: Omit<UserPreferences, 'id' | 'cookieId' | 'createdAt' | 'updatedAt'>
) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user_id')

  if (!userCookie) {
    return { error: 'No user cookie found' }
  }

  try {
    await db.insert(userPreferences).values({
      cookieId: userCookie.value,
      ...preferences,
    })
    return { success: true }
  } catch (error) {
    console.error('Error saving preferences:', error)
    return { error: 'Failed to save preferences' }
  }
} 