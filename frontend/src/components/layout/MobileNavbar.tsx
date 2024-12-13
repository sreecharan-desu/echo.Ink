import Logo from '../common/Logo';

export default function MobileNavbar() {
  return (
    <nav className="border-b border-[--border] bg-[--background] md:hidden">
      <div className="px-4 h-14 flex items-center justify-between">
        <Logo variant="small" />
        {/* ... rest of mobile navbar code ... */}
      </div>
    </nav>
  );
} 