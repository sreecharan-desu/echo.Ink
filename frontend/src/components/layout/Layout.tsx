import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from '../common/BackButton';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[--background]">
      <Navbar />
      <BackButton />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}