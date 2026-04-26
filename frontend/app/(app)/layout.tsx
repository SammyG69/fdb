import Sidebar from '../components/Sidebar';
import OnboardingModal from '../components/OnboardingModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <OnboardingModal />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
