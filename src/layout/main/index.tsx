import { Outlet } from 'react-router-dom';

import Navigation from '../../components/navigation';

export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col justify-between w-full divide-y divide-orange-800">
      <Navigation />
      <main className="h-full p-4 bg-orange-100">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
