'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type LogItem = {
  food: Food;
  quantity: number;
};

const FOOD_OPTIONS: Food[] = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13 },
  { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  { name: 'Brown Rice', calories: 216, protein: 4.5, carbs: 45, fats: 1.8 },
  { name: 'Oats', calories: 389, protein: 17, carbs: 66, fats: 7 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15 },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50 },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50 },
  { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fats: 4.2 },
  { name: 'Protein Shake', calories: 120, protein: 25, carbs: 3, fats: 1.5 },
  { name: 'Quinoa', calories: 368, protein: 14, carbs: 64, fats: 6 },
  { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fats: 4.3 },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fats: 0.3 },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100 },
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

function scale(val: number, qty: number) {
  return Math.round((val * qty) / 100);
}

export default function LoggingPage() {
  const { userId } = useAuth();
  const [mealType, setMealType] = useState('Breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [items, setItems] = useState<LogItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const foodResults = FOOD_OPTIONS.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + scale(item.food.calories, item.quantity),
      protein: acc.protein + scale(item.food.protein, item.quantity),
      carbs: acc.carbs + scale(item.food.carbs, item.quantity),
      fats: acc.fats + scale(item.food.fats, item.quantity),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  function addItem() {
    if (!selectedFood) return;
    setItems((prev) => [...prev, { food: selectedFood, quantity }]);
    setSelectedFood(null);
    setFoodSearch('');
    setQuantity(100);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (items.length === 0 || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: mealType,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fats,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to log meal');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setItems([]);
    setMealType('Breakfast');
    setNotes('');
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex items-center justify-center">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Meal Logged!</h2>
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-medium text-slate-700">{mealType}</span> — {totals.calories} kcal
          </p>
          <p className="text-sm text-slate-500 mb-6">
            {totals.protein}g protein · {totals.carbs}g carbs · {totals.fats}g fats
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Log Another Meal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Log a Meal</h1>
          <p className="text-sm text-slate-600">
            Add food items to track your daily nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-5">

            {/* Meal type */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Meal Type</h2>
              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                      mealType === type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Food search */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Add Food</h2>

              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <svg className="shrink-0 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search food…"
                  value={foodSearch}
                  onChange={(e) => {
                    setFoodSearch(e.target.value);
                    setSelectedFood(null);
                  }}
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              {/* Search results dropdown */}
              {foodSearch && !selectedFood && (
                <div className="mb-4 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {foodResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-slate-500">No results found</p>
                  ) : (
                    foodResults.map((food) => (
                      <button
                        key={food.name}
                        onClick={() => {
                          setSelectedFood(food);
                          setFoodSearch(food.name);
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <span className="text-sm font-medium text-slate-800">{food.name}</span>
                        <span className="text-xs text-slate-500">{food.calories} kcal / 100g</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Selected food preview */}
              {selectedFood && (
                <div className="mb-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-1">{selectedFood.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedFood.calories} kcal · {selectedFood.protein}g P · {selectedFood.carbs}g C · {selectedFood.fats}g F per 100g
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity (grams)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(10, q - 10))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-24 rounded-xl bg-slate-50 px-3 py-2 text-center text-sm font-medium text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-slate-400"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 10)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="text-sm text-slate-500">g</span>
                </div>
                {selectedFood && (
                  <p className="mt-2 text-xs text-slate-500">
                    ≈ {scale(selectedFood.calories, quantity)} kcal for {quantity}g
                  </p>
                )}
              </div>

              <button
                onClick={addItem}
                disabled={!selectedFood}
                className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Meal
              </button>
            </div>

            {/* Notes */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Notes <span className="text-slate-400 font-normal text-xs">(optional)</span></h2>
              <textarea
                rows={3}
                placeholder="Any notes about this meal…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-none rounded-2xl bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-200 outline-none focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sticky top-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                {mealType} Summary
              </h2>

              {items.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500">No items added yet.</p>
                  <p className="mt-1 text-xs text-slate-400">Search for a food item to get started.</p>
                </div>
              ) : (
                <>
                  {/* Items list */}
                  <div className="mb-4 space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{item.food.name}</p>
                          <p className="text-xs text-slate-500">{item.quantity}g · {scale(item.food.calories, item.quantity)} kcal</p>
                        </div>
                        <button
                          onClick={() => removeItem(i)}
                          className="ml-3 shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="rounded-2xl bg-slate-50 p-4 mb-4">
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-sm text-slate-600">Total Calories</span>
                      <span className="text-xl font-bold text-slate-900">{totals.calories} kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Protein</p>
                        <p className="text-sm font-semibold text-slate-800">{totals.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Carbs</p>
                        <p className="text-sm font-semibold text-slate-800">{totals.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Fats</p>
                        <p className="text-sm font-semibold text-slate-800">{totals.fats}g</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p className="mb-3 text-xs text-red-500">{error}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={items.length === 0 || loading || !userId}
                className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting…' : 'Submit Meal Log'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
