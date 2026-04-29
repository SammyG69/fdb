'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

type MealItem = {
  id: number;
  food_id: number;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type TrackedMeal = {
  id: number;
  meal_type: string;
  meal_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  logged_at: string;
  items: MealItem[];
};

const CALORIE_GOAL = 2400;

const reminders = [
  { label: 'Drink water', due: 'in 30 min' },
  { label: 'Add dinner', due: 'by 7:45 PM' },
  { label: 'Review weekly goals', due: 'today' },
];

function formatTime(loggedAt: string) {
  return new Date(loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [meals, setMeals] = useState<TrackedMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/meals/today?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => setMeals(Array.isArray(data) ? data : []))
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const totalCalories = meals.reduce((s, m) => s + (m.total_calories || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.total_protein || 0), 0);
  const totalCarbs = meals.reduce((s, m) => s + (m.total_carbs || 0), 0);
  const totalFats = meals.reduce((s, m) => s + (m.total_fats || 0), 0);
  const completion = Math.min((totalCalories / CALORIE_GOAL) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Daily Dashboard</h1>
          <p className="text-sm text-slate-600">Quick snapshot of your daily goals, activity, and log status.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Nutrition Goal</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Today</span>
              </div>

              <p className="text-4xl font-bold text-slate-900">{Math.round(totalCalories)} kcal</p>
              <p className="text-sm text-slate-500">of {CALORIE_GOAL} kcal target</p>

              <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${completion}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>{Math.round(completion)}% complete</span>
                <span>{Math.max(CALORIE_GOAL - Math.round(totalCalories), 0)} kcal left</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Protein</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{Math.round(totalProtein)}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Carbs</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{Math.round(totalCarbs)}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Fats</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{Math.round(totalFats)}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Meals</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{meals.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Today's Meals</h2>
                  <p className="mt-1 text-sm text-slate-500">Meals you've logged today</p>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-slate-400">Loading...</p>
              ) : meals.length === 0 ? (
                <p className="text-sm text-slate-400">No meals logged yet today.</p>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{meal.meal_type}</p>
                        <p className="text-xs text-slate-500">
                          {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
                          {' · '}
                          {Math.round(meal.total_protein)}g protein
                          {' · '}
                          {Math.round(meal.total_carbs)}g carbs
                          {' · '}
                          {Math.round(meal.total_fats)}g fats
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">{Math.round(meal.total_calories)} kcal</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {formatTime(meal.logged_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Today's Focus</h2>
                  <p className="mt-1 text-sm text-slate-500">Action items and reminders to finish strong</p>
                </div>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  Manage Reminders
                </button>
              </div>

              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.label} className="flex justify-between rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">{reminder.label}</p>
                    <p className="text-sm text-slate-600">{reminder.due}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Weekly Points</h2>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                <div>
                  <p className="text-sm text-slate-600">Total Points</p>
                  <p className="text-3xl font-bold text-slate-900">1,420</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Target</p>
                  <p className="text-xl font-semibold text-slate-900">2,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
