'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Notification from '@/components/Notification';
import { applyPhoneMask, removePhoneMask } from '@/lib/masks';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useTheme } from '@/components/ThemeProvider';

interface UserProfile {
  uid?: string;
  name?: string;
  email?: string;
  company?: string;
  segment?: string;
  phone?: string;
  logoUrl?: string;
  googleMapsUrl?: string;
  role?: 'user' | 'admin' | 'super_admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    segment: '',
    phone: '',
    logoUrl: '',
    googleMapsUrl: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdminMode, toggleAdminMode } = useAdminMode();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || user?.email || '',
          company: data.company || '',
          segment: data.segment || '',
          phone: data.phone ? applyPhoneMask(data.phone) : '',
          logoUrl: data.logoUrl || '',
          googleMapsUrl: data.googleMapsUrl || ''
        });
        setLogoPreview(data.logoUrl || '');
      } else {
        // Criar documento se não existir
        await setDoc(doc(db, 'users', userId), {
          uid: userId,
          email: user?.email || '',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setUserProfile({ uid: userId, email: user?.email || '', createdAt: new Date(), updatedAt: new Date() });
        setFormData({
          name: '',
          email: user?.email || '',
          company: '',
          segment: '',
          phone: '',
          logoUrl: '',
          googleMapsUrl: ''
        });
        setLogoPreview('');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      showNotification('Erro ao carregar perfil', 'error');
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Nome é obrigatório
    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }
    
    // Empresa é obrigatória
    if (!formData.company.trim()) {
      newErrors.company = 'Nome da empresa é obrigatório';
    }
    
    // Segmento é obrigatório
    if (!formData.segment) {
      newErrors.segment = 'Segmento de atuação é obrigatório';
    }
    
    // Telefone é obrigatório
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (removePhoneMask(formData.phone).length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }
    
    setSaving(true);

    try {
      if (!user) return;

      const updateData = {
        name: formData.name,
        company: formData.company,
        segment: formData.segment,
        phone: removePhoneMask(formData.phone),
        logoUrl: formData.logoUrl,
        googleMapsUrl: formData.googleMapsUrl,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      // Atualizar estado local
      setUserProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      // Limpar erros após sucesso
      setErrors({});
      
      showNotification('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showNotification('Erro ao atualizar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        showNotification('Arquivo muito grande. Máximo 5MB.', 'error');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData(prev => ({
      ...prev,
      logoUrl: ''
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    
    // Salvar no Firestore
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          theme: newTheme,
          updatedAt: new Date()
        });
        
        showNotification(`Tema ${newTheme === 'light' ? 'claro' : 'escuro'} salvo com sucesso!`, 'success');
      } catch (error) {
        console.error('Erro ao salvar tema:', error);
        showNotification('Erro ao salvar preferência de tema', 'error');
      }
    }
  };

  const handleToggleAdminMode = () => {
    console.log('Profile Debug - Antes do toggle:', { isAdminMode });
    
    toggleAdminMode();
    
    // Feedback visual
    const newMode = !isAdminMode;
    showNotification(
      newMode 
        ? 'Modo Admin ativado - Apenas menus administrativos' 
        : 'Modo usuário ativado - Menus básicos', 
      'success'
    );
    
    console.log('Profile Debug - Após toggle:', { newMode });
    
    // Forçar re-render do Sidebar
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Header */}
      <Header 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        showMenuButton={true}
      />
      
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab !== 'profile') {
            router.push('/dashboard');
          }
        }}
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Content */}
      <div className="lg:ml-80 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">Meu Perfil</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-theme-primary">Meu Perfil</h1>
            <p className="text-theme-secondary">Gerencie suas informações pessoais e preferências</p>
          </div>

          {/* Layout de 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal - Informações do Perfil */}
            <div className="lg:col-span-2">
              <div className="bg-theme-card rounded-lg shadow-theme-sm border border-theme-primary">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-theme-primary">Informações do Perfil</h2>
                  <p className="text-theme-secondary mb-6">Atualize suas informações pessoais e da empresa</p>

              <form onSubmit={handleSubmit} className="space-y-0">
                {/* Informações Pessoais */}
                <div className="border-b border-gray-200/30 dark:border-gray-600/30 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações Pessoais</h3>
                  
                  {/* Nota sobre campos obrigatórios */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="text-red-500 font-semibold">*</span> Campos obrigatórios para completar seu perfil
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-theme ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                        placeholder="Seu nome completo"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        placeholder="Seu e-mail"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        O e-mail não pode ser alterado por questões de segurança
                      </p>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome da Empresa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-theme ${
                          errors.company ? 'border-red-500' : ''
                        }`}
                        placeholder="Nome da sua empresa"
                      />
                      {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                    </div>

                    <div>
                      <label htmlFor="segment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Segmento de Atuação <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="segment"
                        name="segment"
                        value={formData.segment}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-theme ${
                          errors.segment ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Selecione um segmento</option>
                        <option value="Varejo">Varejo</option>
                        <option value="Restaurante">Restaurante</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                        <option value="Serviços">Serviços</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Outro">Outro</option>
                      </select>
                      {errors.segment && <p className="text-red-500 text-xs mt-1">{errors.segment}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const maskedValue = applyPhoneMask(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            phone: maskedValue
                          }));
                          // Limpar erro quando usuário começar a digitar
                          if (errors.phone) {
                            setErrors(prev => ({ ...prev, phone: '' }));
                          }
                        }}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-theme ${
                          errors.phone ? 'border-red-500' : ''
                        }`}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Link do Google Maps
                      </label>
                      <input
                        type="url"
                        id="googleMapsUrl"
                        name="googleMapsUrl"
                        value={formData.googleMapsUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-theme"
                        placeholder="https://g.page/r/CTVidR-uGTADEBI/review"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Link para avaliação no Google Maps (opcional)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seção do Logo da Empresa */}
                <div className="border-t border-gray-200/30 dark:border-gray-600/30 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logo da Empresa</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 dark:file:bg-gray-800 dark:file:text-gray-200 dark:file:border-gray-600"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG até 5MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="border-t border-gray-200/30 dark:border-gray-600/30 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações</h3>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </form>
                </div>
              </div>
            </div>

            {/* Coluna direita - Preferências */}
            <div className="lg:col-span-1">
              <div className="bg-theme-card rounded-lg shadow-theme-sm border border-theme-primary">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-theme-primary mb-2">Preferências</h2>
                  <p className="text-theme-secondary mb-6">Configure suas preferências de interface</p>

              <div className="space-y-6">
                {/* Tema da Interface */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tema da Interface
                  </label>
                  <div className="flex items-center space-x-4">
                    {/* Toggle de Tema Estilo Google */}
                    <div className="flex items-center space-x-3">
                      {/* Ícone Sol */}
                      <div className={`flex items-center space-x-2 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-400'}`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Claro</span>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const newTheme = theme === 'light' ? 'dark' : 'light';
                          handleThemeChange(newTheme);
                        }}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md
                            ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>

                      {/* Ícone Lua */}
                      <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        <span className="text-sm font-medium">Escuro</span>
                      </div>
                    </div>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Clique no toggle para alternar entre modo claro e escuro
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Sua preferência será salva automaticamente no seu perfil
                  </p>
                </div>

                {/* Toggle de Modo Admin */}
                {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Modo de Visualização
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={handleToggleAdminMode}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${isAdminMode 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300'
                          }
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${isAdminMode ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {isAdminMode ? 'Modo Admin' : 'Modo Usuário'}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {isAdminMode 
                            ? (userProfile?.role === 'super_admin' 
                                ? 'Apenas funcionalidades administrativas (Escritório + Usuários Admin)' 
                                : 'Menus completos com funcionalidades administrativas'
                              )
                            : 'Menus simplificados para usuários comuns'
                          }
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Alterna entre visualização de admin e usuário normal no sistema
                    </p>
                  </div>
                )}
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
} 