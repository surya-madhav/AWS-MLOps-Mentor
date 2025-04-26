import { getUserLearningData } from '@/lib/db/queries';
import Dashboard from '@/components/dashboard/dashboard';
import { auth } from '@/app/(auth)/auth';
import { notFound } from 'next/navigation';
import { use } from 'react';
export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    return notFound();
  }
  console.log('session', session);
  const userId = session.user.id as string;

  // Fetch all learning data for the user
  const learningData = await getUserLearningData({ userId });

  return (
    <main className="container mx-auto px-4 py-6">
      <Dashboard learningData={learningData} userId={userId} />
    </main>
  );
}
