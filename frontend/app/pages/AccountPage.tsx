export default function AccountPage() {
  const user = {
    name: 'Jordan Smith',
    email: 'jordan.smith@example.com',
    username: 'jordans',
    joined: '2024-01-08',
    plan: 'Premium',
    location: 'San Francisco, CA',
    phone: '+1 (415) 555-0123',
  };

  const accountStats = {
    mealsLogged: 1240,
    goalsHit: 67,
    friends: 12,
    streakDays: 18,
  };

  const securitySettings = [
    { label: 'Two-Factor Authentication', value: 'Enabled' },
    { label: 'Last Password Change', value: '3 days ago' },
    { label: 'Connected Devices', value: '3 active' },
  ];

  const preferences = [
    { label: 'Email Notifications', value: 'On' },
    { label: 'SMS Alerts', value: 'Off' },
    { label: 'Weekly Progress Emails', value: 'On' },
  ];

  return (
    <div className= min-h-screen bg-slate-50 p-6 md:p-10>
      <div className=mx-auto max-w-7xl>
        <div className=mb-8 flex flex-col gap-2>
          <h1 className=text-3xl font-bold text-slate-900>Account Dashboard</h1>
          <p className=text-sm text-slate-600>
            Manage your profile, subscription, and security settings.
          </p>
        </div>

        <div className=grid grid-cols-1 gap-6 lg:grid-cols-3>
          <div className=space-y-6 lg:col-span-1>
            <div className=rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200>
              <div className=mb-4 flex items-center justify-between>
                <h2 className=text-lg font-semibold text-slate-900>Profile</h2>
                <span className=rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700>
                  {user.plan}
                </span>
              </div>

              <p className=text-2xl font-bold text-slate-900>{user.name}</p>
              <p className=text-sm text-slate-500>{user.email}</p>
              <p className=mt-2 text-sm text-slate-500>User since {user.joined}</p>

              <div className=mt-5 space-y-2 rounded-2xl bg-slate-50 p-4>
                <p className=text-xs uppercase tracking-wide text-slate-500>Username</p>
                <p className=text-sm text-slate-800>{user.username}</p>

                <p className=text-xs uppercase tracking-wide text-slate-500>Location</p>
                <p className=text-sm text-slate-800>{user.location}</p>

                <p className=text-xs uppercase tracking-wide text-slate-500>Phone</p>
                <p className=text-sm text-slate-800>{user.phone}</p>
              </div>

              <button className=mt-5 w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90>
                Edit Profile
              </button>
            </div>

            <div className=rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200>
              <h2 className=mb-3 text-lg font-semibold text-slate-900>Account Stats</h2>
              <div className=grid grid-cols-2 gap-4>
                <div className=rounded-2xl bg-slate-50 p-4 text-center>
                  <p className=text-xs text-slate-500>Meals Logged</p>
                  <p className=mt-1 text-2xl font-bold text-slate-900>{accountStats.mealsLogged}</p>
                </div>
                <div className=rounded-2xl bg-slate-50 p-4 text-center>
                  <p className=text-xs text-slate-500>Goals Hit</p>
                  <p className=mt-1 text-2xl font-bold text-slate-900>{accountStats.goalsHit}%</p>
                </div>
                <div className=rounded-2xl bg-slate-50 p-4 text-center>
                  <p className=text-xs text-slate-500>Friends</p>
                  <p className=mt-1 text-2xl font-bold text-slate-900>{accountStats.friends}</p>
                </div>
                <div className=rounded-2xl bg-slate-50 p-4 text-center>
                  <p className=text-xs text-slate-500>Streak</p>
                  <p className=mt-1 text-2xl font-bold text-slate-900>{accountStats.streakDays} days</p>
                </div>
              </div>
            </div>
          </div>

          <div className=lg:col-span-2 space-y-6>
            <div className=rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200>
              <div className=mb-6 flex items-center justify-between>
                <div>
                  <h2 className=text-lg font-semibold text-slate-900>Security</h2>
                  <p className=mt-1 text-sm text-slate-500>Update your login and verification settings</p>
                </div>
                <button className=rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90>
                  Manage Security
                </button>
              </div>

              <div className=space-y-3>
                {securitySettings.map((setting) => (
                  <div key={setting.label} className=flex items-center justify-between rounded-2xl bg-slate-50 p-4>
                    <p className=text-sm font-medium text-slate-700>{setting.label}</p>
                    <p className=text-sm text-slate-600>{setting.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className=rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200>
              <div className=mb-6 flex items-center justify-between>
                <div>
                  <h2 className=text-lg font-semibold text-slate-900>Preferences</h2>
                  <p className=mt-1 text-sm text-slate-500>Notification and app preferences</p>
                </div>
                <button className=rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90>
                  Edit Preferences
                </button>
              </div>

              <div className=space-y-3>
                {preferences.map((pref) => (
                  <div key={pref.label} className=flex items-center justify-between rounded-2xl bg-slate-50 p-4>
                    <p className=text-sm font-medium text-slate-700>{pref.label}</p>
                    <p className=text-sm text-slate-600>{pref.value}</p>
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
