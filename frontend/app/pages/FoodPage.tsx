'use client';

import { useState } from 'react';

type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fibre: number;
  category: string;
};

const FOODS: Food[] = [
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, fibre: 0, category: 'Protein' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, fibre: 0, category: 'Protein' },
  { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fats: 11, fibre: 0, category: 'Protein' },
  { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, fibre: 0, category: 'Dairy' },
  { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fibre: 0, category: 'Dairy' },
  { name: 'Whole Milk', calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, fibre: 0, category: 'Dairy' },
  { name: 'Brown Rice', calories: 216, protein: 4.5, carbs: 45, fats: 1.8, fibre: 3.5, category: 'Grains' },
  { name: 'Oats', calories: 389, protein: 17, carbs: 66, fats: 7, fibre: 10, category: 'Grains' },
  { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fats: 4.2, fibre: 7, category: 'Grains' },
  { name: 'Quinoa', calories: 368, protein: 14, carbs: 64, fats: 6, fibre: 7, category: 'Grains' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fibre: 2.6, category: 'Fruit' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fibre: 2.4, category: 'Fruit' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fibre: 2.4, category: 'Fruit' },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, fibre: 7, category: 'Fruit' },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fibre: 2.6, category: 'Vegetables' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fibre: 2.2, category: 'Vegetables' },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fibre: 3, category: 'Vegetables' },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, fibre: 12.5, category: 'Nuts & Seeds' },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50, fibre: 6, category: 'Nuts & Seeds' },
  { name: 'Chia Seeds', calories: 486, protein: 17, carbs: 42, fats: 31, fibre: 34, category: 'Nuts & Seeds' },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100, fibre: 0, category: 'Fats & Oils' },
  { name: 'Protein Shake', calories: 120, protein: 25, carbs: 3, fats: 1.5, fibre: 1, category: 'Supplements' },
];

const CATEGORIES = ['All', 'Protein', 'Dairy', 'Grains', 'Fruit', 'Vegetables', 'Nuts & Seeds', 'Fats & Oils', 'Supplements'];

const categoryColors: Record<string, string> = {
  Protein: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  Dairy: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100',
  Grains: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  Fruit: 'bg-pink-50 text-pink-700 ring-1 ring-pink-100',
  Vegetables: 'bg-green-50 text-green-700 ring-1 ring-green-100',
  'Nuts & Seeds': 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  'Fats & Oils': 'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
  Supplements: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
};

export default function FoodPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = FOODS.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Food Database</h1>
          <p className="text-sm text-slate-600">
            Browse and search nutritional info for over 15,000 food items.
          </p>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 shadow-sm">
          <svg className="shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search foods…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {search && ` for "${search}"`}
        </p>

        {/* Food grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-slate-800">No foods found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((food) => (
              <div
                key={food.name}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{food.name}</h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${categoryColors[food.category] ?? 'bg-slate-50 text-slate-600'}`}>
                    {food.category}
                  </span>
                </div>

                <p className="mb-4 text-xs text-slate-400">Per 100g serving</p>

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-3xl font-bold text-slate-900">{food.calories}</span>
                  <span className="text-sm text-slate-500">kcal</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Protein</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{food.protein}g</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Carbs</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{food.carbs}g</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Fats</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{food.fats}g</p>
                  </div>
                </div>

                {food.fibre > 0 && (
                  <p className="mt-3 text-xs text-slate-400">Fibre: {food.fibre}g</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
