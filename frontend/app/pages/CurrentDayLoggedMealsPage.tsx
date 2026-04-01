export default function FoodDashboard() {
  const dailyGoals = {
    calories: 2400,
    protein: 180,
    carbs: 220,
    fats: 80,
  };

  const current = {
    calories: 1685,
    protein: 132,
    carbs: 154,
    fats: 58,
  };

  const meals = [
    {
      name: "Breakfast",
      time: "8:00 AM",
      calories: 420,
      protein: 32,
      carbs: 38,
      fats: 14,
      items: ["Greek yogurt bowl", "Banana", "Granola"],
    },
    {
      name: "Lunch",
      time: "1:00 PM",
      calories: 610,
      protein: 48,
      carbs: 62,
      fats: 18,
      items: ["Chicken rice bowl", "Avocado", "Mixed vegetables"],
    },
    {
      name: "Snack",
      time: "4:30 PM",
      calories: 185,
      protein: 20,
      carbs: 12,
      fats: 6,
      items: ["Protein shake"],
    },
    {
      name: "Dinner",
      time: "7:30 PM",
      calories: 470,
      protein: 32,
      carbs: 42,
      fats: 20,
      items: ["Salmon", "Potatoes", "Broccoli"],
    },
  ];

  const macroData = [
    { label: "Protein", current: current.protein, goal: dailyGoals.protein, unit: "g" },
    { label: "Carbs", current: current.carbs, goal: dailyGoals.carbs, unit: "g" },
    { label: "Fats", current: current.fats, goal: dailyGoals.fats, unit: "g" },
  ];

  const caloriePercent = Math.min((current.calories / dailyGoals.calories) * 100, 100);
  const remainingCalories = Math.max(dailyGoals.calories - current.calories, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Nutrition Dashboard</h1>
          <p className="text-sm text-slate-600">
            Track your daily calorie target, macro progress, and meals consumed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Calories</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Today
                </span>
              </div>

              <div className="mb-4">
                <p className="text-4xl font-bold text-slate-900">{current.calories}</p>
                <p className="text-sm text-slate-500">of {dailyGoals.calories} kcal goal</p>
              </div>

              <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{Math.round(caloriePercent)}% reached</span>
                <span>{remainingCalories} kcal left</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">Macros Breakdown</h2>
                <p className="mt-1 text-sm text-slate-500">Progress towards your daily macro targets</p>
              </div>

              <div className="space-y-5">
                {macroData.map((macro) => {
                  const percent = Math.min((macro.current / macro.goal) * 100, 100);

                  return (
                    <div key={macro.label}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{macro.label}</span>
                        <span className="text-sm text-slate-500">
                          {macro.current}{macro.unit} / {macro.goal}{macro.unit}
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-700 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Daily Summary</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Protein</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{current.protein}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Carbs</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{current.carbs}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Fats</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{current.fats}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Meals</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{meals.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Meals Consumed</h2>
                  <p className="mt-1 text-sm text-slate-500">A breakdown of meals tracked today</p>
                </div>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  Add Meal
                </button>
              </div>

              <div className="space-y-4">
                {meals.map((meal) => (
                  <div
                    key={`${meal.name}-${meal.time}`}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-slate-900">{meal.name}</h3>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                            {meal.time}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {meal.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:min-w-[280px] md:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Calories</p>
                          <p className="mt-1 font-semibold text-slate-900">{meal.calories}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Protein</p>
                          <p className="mt-1 font-semibold text-slate-900">{meal.protein}g</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Carbs</p>
                          <p className="mt-1 font-semibold text-slate-900">{meal.carbs}g</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Fats</p>
                          <p className="mt-1 font-semibold text-slate-900">{meal.fats}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
