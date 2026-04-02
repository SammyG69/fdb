export default function DashboardPage() {
  const summary = {
    calories: 1850,
    protein: 140,
    carbs: 170,
    fats: 60,
    meals: 5,
    activeMinutes: 45,
    points: 1_420,
    progress: 76,
  };

  const recentActivities = [
    { title: 'Morning run', detail: '20 min - 200 kcal', status: 'Completed' },
    { title: 'Lunch log', detail: '650 kcal', status: 'Submitted' },
    { title: 'Water intake', detail: '2.5 L', status: 'On track' },
    { title: 'Evening stretch', detail: '15 min', status: 'Planned' },
  ];

  const reminders = [
    { label: 'Drink water', due: 'in 30 min' },
    { label: 'Add dinner', due: 'by 7:45 PM' },
    { label: 'Review weekly goals', due: 'today' },
  ];

  const completion = Math.min((summary.calories / 2400) * 100, 100);

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

              <p className="text-4xl font-bold text-slate-900">{summary.calories} kcal</p>
              <p className="text-sm text-slate-500">of 2400 kcal target</p>

              <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${completion}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>{Math.round(completion)}% complete</span>
                <span>{2400 - summary.calories} kcal left</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Protein</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{summary.protein}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Carbs</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{summary.carbs}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Fats</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{summary.fats}g</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500">Meals</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{summary.meals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Your latest actions and progress items</p>
                </div>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  Add Activity
                </button>
              </div>

              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.title} className="flex justify-between rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.detail}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{activity.status}</span>
                  </div>
                ))}
              </div>
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
                  <p className="text-3xl font-bold text-slate-900">{summary.points.toLocaleString()}</p>
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
