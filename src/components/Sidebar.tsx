'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAdminMode } from '@/contexts/AdminModeContext';
import Link from 'next/link';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  userProfile: any;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

// Componente para ícones SVG profissionais
const SidebarIcon = ({ icon, isActive }: { icon: string; isActive: boolean }) => {
  const iconClass = `w-5 h-5 ${isActive ? 'text-theme-inverse' : 'text-theme-secondary'}`;
  
  const icons = {
    home: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    projects: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    tasks: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    insights: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    ai: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    billing: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    office: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    users: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  };

  return icons[icon as keyof typeof icons] || null;
};

export default function Sidebar({ activeTab, onTabChange, user, userProfile, onLogout, isMobileMenuOpen, onMobileMenuToggle }: SidebarProps) {
  const router = useRouter();
  const { isAdminMode } = useAdminMode();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    // Menus básicos (modo usuário)
    { id: 'overview', label: 'Dashboard', icon: 'home', path: '/dashboard' },
    { id: 'areas', label: 'Áreas de Pesquisa', icon: 'projects', path: '/areas' },
    { id: 'feedbacks', label: 'Feedbacks', icon: 'tasks', path: '/feedbacks' },
    { id: 'base-conhecimento', label: 'Base de Conhecimento', icon: 'insights', path: '/base-conhecimento' },
    { id: 'agente-ia', label: 'Agente IA (BETA)', icon: 'ai', path: '/agente-ia' },
    
    // Menus administrativos
    { id: 'escritorio', label: 'Escritório', icon: 'office', path: '/escritorio' },
    { id: 'usuarios-admin', label: 'Usuários Admin', icon: 'users', path: '/usuarios-admin' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    const isAdminItem = ['escritorio', 'usuarios-admin'].includes(item.id);
    const isBasicItem = !isAdminItem;
    
    if (isAdminMode) {
      // Modo admin: mostrar APENAS menus administrativos
      return isAdminItem;
    } else {
      // Modo usuário: mostrar menus básicos (excluir administrativos)
      return isBasicItem;
    }
  });

  // Debug: log do estado do modo admin
  console.log('Sidebar Debug:', { 
    isAdminMode, 
    totalMenuItems: menuItems.length, 
    filteredMenuItems: filteredMenuItems.length,
    filteredItems: filteredMenuItems.map(item => item.id)
  });

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 overlay-theme z-40"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 sidebar-theme border-r border-theme-secondary shadow-theme-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo - sempre visível */}
        <div className="flex items-center space-x-3 px-6 pt-4 pb-4 border-b border-theme-secondary">
          <img 
            src="/logo-klientti.svg" 
            alt="Klientti" 
            className="h-8 w-auto"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 lg:py-6 overflow-y-auto overflow-x-hidden scrollbar-theme">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onMobileMenuToggle(); // Fechar menu mobile
                
                // Navegar para a página correspondente
                if (item.path) {
                  router.push(item.path);
                }
              }}
              className={`
                w-full flex items-center space-x-3 text-left transition-all duration-200
                ${activeTab === item.id
                  ? 'sidebar-item active'
                  : 'sidebar-item'
                }
              `}
            >
              <SidebarIcon icon={item.icon} isActive={activeTab === item.id} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Seção de Perfil - mobile e desktop */}
        <div className="p-4 border-t border-theme-secondary">
          {/* User Profile Card */}
          {user && (
            <div 
              className="mb-4 p-3 bg-theme-secondary rounded-lg cursor-pointer hover:bg-theme-tertiary transition-colors"
              onClick={() => window.location.href = '/profile'}
              title="Clique para gerenciar perfil"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                  <span className="text-theme-inverse font-medium">
                    {userProfile?.name?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-primary truncate">
                    {userProfile?.name || user?.displayName || 'Usuário'}
                  </p>
                  <p className="text-xs text-theme-secondary truncate">
                    {userProfile?.company || 'Empresa'}
                  </p>
                </div>
                <div className="p-1 text-theme-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {/* Links do usuário - apenas em desktop */}
          <div className="hidden lg:block space-y-2 mb-4">
            <Link
              href="/profile"
              className="w-full flex items-center space-x-3 text-left sidebar-item transition-all duration-200"
            >
              <svg className="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-sm text-theme-secondary">Meu Perfil</span>
            </Link>
            
            <Link
              href="/assinatura"
              className="w-full flex items-center space-x-3 text-left sidebar-item transition-all duration-200"
            >
              <svg className="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-medium text-sm text-theme-secondary">Assinatura</span>
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-left sidebar-item transition-all duration-200"
          >
            <svg className="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm text-theme-secondary">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
} 