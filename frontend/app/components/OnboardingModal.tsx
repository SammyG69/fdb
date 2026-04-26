'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
type Goal = 'lose_weight' | 'maintain' | 'build_muscle' | 'improve_fitness';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

const GOALS: { value: Goal; label: string; description: string; icon: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight', description: 'Reduce body fat through a calorie deficit', icon: '↓' },
  { value: 'maintain', label: 'Maintain Weight', description: 'Keep your current weight and body composition', icon: '⟷' },
  { value: 'build_muscle', label: 'Build Muscle', description: 'Increase muscle mass with a calorie surplus', icon: '↑' },
  { value: 'improve_fitness', label: 'Improve Fitness', description: 'Enhance overall health and performance', icon: '◎' },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1–3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3–5 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6–7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise and physical job' },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export default function OnboardingModal() {
  const { userId } = useAuth();
  const { user } = useUser();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  // Step 1 fields
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');

  // Step 2 fields
  const [goal, setGoal] = useState<Goal | ''>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const done = localStorage.getItem('onboarding_complete');
    if (!done) setVisible(true);
  }, []);

  const displayName = user?.firstName ?? user?.username ?? 'there';

  function calcAge(dateStr: string): number | undefined {
    if (!dateStr) return undefined;
    const ms = Date.now() - new Date(dateStr).getTime();
    return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
  }

  async function handleComplete() {
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weight ? Number(weight) : undefined,
          height: height ? Number(height) : undefined,
          age: calcAge(dob),
          gender: gender || undefined,
          goal: goal || undefined,
          activity_level: activityLevel || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save profile');
      }
      localStorage.setItem('onboarding_complete', 'true');
      setVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    localStorage.setItem('onboarding_complete', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">

        {/* Progress bar */}
        <div className="flex gap-1.5 p-5 pb-0">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${step * 50}%)`, width: '200%' }}
        >
          {/* ── Step 1: Personal Details ── */}
          <div className="w-1/2 p-7">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Step 1 of 2</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Welcome, {displayName}!
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Let&apos;s set up your profile so we can personalise your nutrition plan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Current Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 75"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-slate-400"
                />
                {dob && (
                  <p className="mt-1 text-xs text-slate-400">Age: {calcAge(dob)} years</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setGender(value)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        gender === value
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-sm text-slate-400 transition hover:text-slate-600"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep(1)}
                className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue →
              </button>
            </div>
          </div>

          {/* ── Step 2: Goals & Activity ── */}
          <div className="w-1/2 p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Step 2 of 2</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Your Goals</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Tell us what you&apos;re working towards and how active you are.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-600">Primary Goal</p>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(({ value, label, description, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setGoal(value)}
                      className={`rounded-2xl p-3 text-left transition-all ${
                        goal === value
                          ? 'bg-slate-900 text-white ring-0'
                          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-base">{icon}</span>
                      <span className="mt-1 block text-xs font-semibold">{label}</span>
                      <span className={`mt-0.5 block text-xs leading-tight ${goal === value ? 'text-slate-300' : 'text-slate-400'}`}>
                        {description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-slate-600">Activity Level</p>
                <div className="space-y-1.5">
                  {ACTIVITY_LEVELS.map(({ value, label, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActivityLevel(value)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                        activityLevel === value
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <span className={`text-xs ${activityLevel === value ? 'text-slate-300' : 'text-slate-400'}`}>
                        {description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 ring-1 ring-red-200">{error}</p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => setStep(0)}
                className="text-sm text-slate-400 transition hover:text-slate-600"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={submitting}
                className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? 'Saving…' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
