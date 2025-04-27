'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/app/(auth)/auth';

export const SignOutForm = () => {
  const router = useRouter();
  
  return (
    <form
      className="w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        await signOut({
          redirectTo: '/',
        });
        router.push('/'); // Ensure client-side navigation
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </form>
  );
};
