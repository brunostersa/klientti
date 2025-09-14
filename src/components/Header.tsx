'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const [user] = useAuthState(auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 header-theme border-b shadow-theme-sm z-40 ${!isMobile ? 'hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu Button + Logo Mobile */}
          <div className="flex items-center space-x-4">
            {/* Menu Button - só aparece em mobile quando showMenuButton é true */}
            {isMobile && showMenuButton && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Abrir menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            {/* Ícone Mobile - só aparece em mobile */}
            {isMobile && (
              <div className="flex items-center">
                <img 
                  src="/icone.svg" 
                  alt="Klientti" 
                  className="h-8 w-8"
                />
              </div>
            )}
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-theme-secondary transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                    <span className="text-theme-inverse font-medium text-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="text-theme-primary font-medium hidden sm:block">
                    {user.displayName || 'Usuário'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-theme-secondary transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 dropdown-theme rounded-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-theme-primary">
                        <p className="text-sm font-medium text-theme-primary">
                          {user.displayName || 'Usuário'}
                        </p>
                        <p className="text-xs text-theme-secondary">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="block w-full text-left px-4 py-2 text-sm dropdown-item-theme hover:bg-theme-secondary transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                      
                      <Link
                        href="/assinatura"
                        className="block w-full text-left px-4 py-2 text-sm dropdown-item-theme hover:bg-theme-secondary transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Assinatura
                      </Link>
                      
                      <button
                        onClick={() => auth.signOut()}
                        className="w-full text-left px-4 py-2 text-sm dropdown-item-theme hover:bg-theme-secondary transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 