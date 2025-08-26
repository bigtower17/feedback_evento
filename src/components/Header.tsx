// Header.tsx
import React from 'react';
import logo from '../assets/images/Senza titolo-2.png';
import { HomeIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onHome: () => void;
  showHomeButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHome, showHomeButton }) => {
  return (
    <header className="bg-white shadow-md w-full py-4 fixed top-0 left-0 z-20">
      <div className="container mx-auto flex justify-center items-center px-2 md:px-4">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="max-w-[200px] h-auto" />
        </div>
        {showHomeButton && (
          <>
            <button
              onClick={onHome}
              className="absolute left-1 md:left-1 top-2 bottom-2 flex items-center bg-transparent border-none outline-none hover:bg-transparent"
            >
              <HomeIcon className="h-6 w-6 text-custom-green hover:text-slate-600 transition-colors" />
            </button>
            <div className="absolute right-2 md:right-4 w-0" />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;