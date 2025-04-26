'use server'

import { updateUserContentProgress } from '@/lib/db/queries'
import { revalidatePath } from 'next/cache'

export async function updateProgress(
  userId: string,
  contentItemId: string,
  isCompleted: boolean,
  notes?: any,
  videos?: any
) {
  try {
    await updateUserContentProgress({
      userId,
      contentItemId,
      isCompleted,
      notes,
      videos,
    })
    
    // Revalidate the dashboard page to refresh data
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to update progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}
