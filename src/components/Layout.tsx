import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Apple, User, ShoppingCart, MessageSquare, Stethoscope, ScanLine, LogOut, HomeIcon } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { Button } from './Button';

export const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path: string) =>
    location.pathname === path ? 'p-2 bg-gray-100 rounded-lg text-[#646cff]' : 'p-2 hover:bg-gray-100 rounded-lg text-gray-500';

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-[#646cff]">
                <Apple className="h-8 w-8" />
                <span className="ml-2 font-semibold text-xl">NutriScan</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Home Icon */}
              <Link to="/" className={getLinkClass('/')}>
                <HomeIcon className="h-5 w-5" />
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/medical-history" className={getLinkClass('/medical-history')}>
                    <User className="h-5 w-5" />
                  </Link>
                  <Link to="/cart" className={getLinkClass('/cart')}>
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <Link to="/chat" className={getLinkClass('/chat')}>
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                  <Link to="/doctors" className={getLinkClass('/doctors')}>
                    <Stethoscope className="h-5 w-5" />
                  </Link>
                  <Link to="/scan" className={getLinkClass('/scan')}>
                    <ScanLine className="h-5 w-5" />
                  </Link>
                  <Button variant="secondary" onClick={logout} className="flex items-center space-x-2 px-4 py-2 rounded-lg  hover:transition-all">
                    <LogOut className="h-4 w-4 " />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-[#646cff] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <Link to="/about" className="block hover:underline">About Us</Link>
              <Link to="/contact" className="block hover:underline">Contact</Link>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <Link to="/privacy" className="block hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="block hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
