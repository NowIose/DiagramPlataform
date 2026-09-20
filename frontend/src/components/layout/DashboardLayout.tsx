import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Sidebar />
      <div className="pl-72">
        <Header />
        <main className="w-full pt-16 px-8 bg-surface">
          <div className="flex flex-col w-full pb-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
