'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('onboarding_complete')) {
      router.replace('/onboarding');
    }
  }, [router]);

  return null;
}
