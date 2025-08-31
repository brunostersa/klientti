import dynamic from 'next/dynamic';
import React from 'react';

// ===== COMPONENTES LAZY LOADING =====

// Lazy loading para componentes pesados
export const LazyFeedbackChart = dynamic(
  () => import('./FeedbackChart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

export const LazyAIAgent = dynamic(
  () => import('./AIAgent'),
  { 
    loading: () => <CardSkeleton />,
    ssr: false
  }
);

export const LazyKnowledgeBase = dynamic(
  () => import('./KnowledgeBase'),
  { 
    loading: () => <CardSkeleton />,
    ssr: false
  }
);

export const LazyQRCodeGenerator = dynamic(
  () => import('./QRCodeGenerator'),
  { 
    loading: () => <CardSkeleton />,
    ssr: false
  }
);

// ===== COMPONENTES SKELETON =====

// Componente de loading para cards
export const CardSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse">
    <div className="h-6 bg-theme-button rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-theme-button rounded"></div>
      <div className="h-4 bg-theme-button rounded w-3/4"></div>
      <div className="h-4 bg-theme-button rounded w-1/2"></div>
    </div>
  </div>
);

// Componente de loading para gráficos
export const ChartSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse">
    <div className="h-6 bg-theme-button rounded mb-4"></div>
    <div className="h-32 bg-theme-button rounded"></div>
    <div className="space-y-2 mt-4">
      <div className="h-4 bg-theme-button rounded"></div>
      <div className="h-4 bg-theme-button rounded w-5/6"></div>
      <div className="h-4 bg-theme-button rounded w-4/6"></div>
    </div>
  </div>
);

// Componente de loading para tabelas
export const TableSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse">
    <div className="h-6 bg-theme-button rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-theme-button rounded"></div>
      <div className="h-4 bg-theme-button rounded w-5/6"></div>
      <div className="h-4 bg-theme-button rounded w-4/6"></div>
    </div>
  </div>
);

// Componente de loading para listas
export const ListSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse">
    <div className="h-6 bg-theme-button rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-theme-button rounded"></div>
      <div className="h-4 bg-theme-button rounded w-5/6"></div>
      <div className="h-4 bg-theme-button rounded w-4/6"></div>
    </div>
  </div>
);

// Componente de loading para formulários
export const FormSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse">
    <div className="h-6 bg-theme-button rounded mb-4"></div>
    <div className="space-y-4">
      <div className="h-10 bg-theme-button rounded"></div>
      <div className="h-10 bg-theme-button rounded"></div>
      <div className="h-10 bg-theme-button rounded"></div>
      <div className="h-10 bg-theme-button rounded w-1/3"></div>
    </div>
  </div>
);

// Componente de loading para métricas
export const MetricSkeleton = () => (
  <div className="card-theme p-6 shadow-theme-md animate-pulse text-center">
    <div className="h-8 bg-theme-button rounded mb-2"></div>
    <div className="h-4 bg-theme-button rounded w-2/3 mx-auto"></div>
  </div>
);

// Componente de loading para avatares
export const AvatarSkeleton = () => (
  <div className="flex items-center space-x-3 animate-pulse">
    <div className="w-10 h-10 bg-theme-button rounded-full"></div>
    <div className="space-y-2">
      <div className="h-4 bg-theme-button rounded w-24"></div>
      <div className="h-3 bg-theme-button rounded w-16"></div>
    </div>
  </div>
);

// Componente de loading para botões
export const ButtonSkeleton = () => (
  <div className="h-10 bg-theme-button rounded w-24 animate-pulse"></div>
);

// Componente de loading para badges
export const BadgeSkeleton = () => (
  <div className="h-6 bg-theme-button rounded-full w-16 animate-pulse"></div>
);

// Componente de loading para progress bars
export const ProgressSkeleton = () => (
  <div className="space-y-2">
    <div className="h-2 bg-theme-button rounded-full"></div>
    <div className="h-2 bg-theme-button rounded-full w-3/4"></div>
    <div className="h-2 bg-theme-button rounded-full w-1/2"></div>
  </div>
);

// Componente de loading para modais
export const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-theme-overlay flex items-center justify-center z-50">
    <div className="modal-theme p-6 rounded-lg w-96 animate-pulse">
      <div className="h-6 bg-theme-button rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-theme-button rounded"></div>
        <div className="h-4 bg-theme-button rounded w-5/6"></div>
        <div className="h-4 bg-theme-button rounded w-4/6"></div>
      </div>
      <div className="flex space-x-3 mt-6">
        <div className="h-10 bg-theme-button rounded flex-1"></div>
        <div className="h-10 bg-theme-button rounded flex-1"></div>
      </div>
    </div>
  </div>
);

// Componente de loading para dropdowns
export const DropdownSkeleton = () => (
  <div className="dropdown-theme p-2 rounded-lg animate-pulse">
    <div className="space-y-2">
      <div className="h-4 bg-theme-button rounded"></div>
      <div className="h-4 bg-theme-button rounded w-5/6"></div>
      <div className="h-4 bg-theme-button rounded w-4/6"></div>
    </div>
  </div>
);

// Componente de loading para tooltips
export const TooltipSkeleton = () => (
  <div className="tooltip-theme p-3 rounded-lg animate-pulse">
    <div className="h-4 bg-theme-button rounded w-32"></div>
  </div>
);

// Componente de loading para navegação
export const NavigationSkeleton = () => (
  <div className="flex space-x-4 animate-pulse">
    <div className="h-6 bg-theme-button rounded w-16"></div>
    <div className="h-6 bg-theme-button rounded w-20"></div>
    <div className="h-6 bg-theme-button rounded w-14"></div>
    <div className="h-6 bg-theme-button rounded w-18"></div>
  </div>
);

// Componente de loading para breadcrumbs
export const BreadcrumbSkeleton = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <div className="h-4 bg-theme-button rounded w-16"></div>
    <div className="h-4 bg-theme-button rounded w-4"></div>
    <div className="h-4 bg-theme-button rounded w-20"></div>
    <div className="h-4 bg-theme-button rounded w-4"></div>
    <div className="h-4 bg-theme-button rounded w-24"></div>
  </div>
);

// Componente de loading para paginação
export const PaginationSkeleton = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <div className="h-8 bg-theme-button rounded w-8"></div>
    <div className="h-8 bg-theme-button rounded w-8"></div>
    <div className="h-8 bg-theme-button rounded w-8"></div>
    <div className="h-8 bg-theme-button rounded w-8"></div>
    <div className="h-8 bg-theme-button rounded w-8"></div>
  </div>
);

// Componente de loading para filtros
export const FilterSkeleton = () => (
  <div className="flex space-x-3 animate-pulse">
    <div className="h-10 bg-theme-button rounded w-32"></div>
    <div className="h-10 bg-theme-button rounded w-24"></div>
    <div className="h-10 bg-theme-button rounded w-28"></div>
  </div>
);

// Componente de loading para search
export const SearchSkeleton = () => (
  <div className="flex space-x-2 animate-pulse">
    <div className="h-10 bg-theme-button rounded flex-1"></div>
    <div className="h-10 bg-theme-button rounded w-20"></div>
  </div>
);

// Componente de loading para sidebar
export const SidebarSkeleton = () => (
  <div className="sidebar-theme p-4 space-y-3 animate-pulse">
    <div className="h-8 bg-theme-button rounded w-32"></div>
    <div className="space-y-2">
      <div className="h-6 bg-theme-button rounded"></div>
      <div className="h-6 bg-theme-button rounded"></div>
      <div className="h-6 bg-theme-button rounded"></div>
      <div className="h-6 bg-theme-button rounded"></div>
    </div>
  </div>
);

// Componente de loading para header
export const HeaderSkeleton = () => (
  <div className="header-theme p-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-8 bg-theme-button rounded w-32"></div>
      <div className="flex space-x-3">
        <div className="h-8 bg-theme-button rounded w-20"></div>
        <div className="h-8 bg-theme-button rounded w-8"></div>
      </div>
    </div>
  </div>
);

// Componente de loading para footer
export const FooterSkeleton = () => (
  <div className="bg-theme-secondary p-8 animate-pulse">
    <div className="grid grid-cols-4 gap-8">
      <div className="space-y-3">
        <div className="h-6 bg-theme-button rounded w-24"></div>
        <div className="space-y-2">
          <div className="h-4 bg-theme-button rounded"></div>
          <div className="h-4 bg-theme-button rounded w-5/6"></div>
          <div className="h-4 bg-theme-button rounded w-4/6"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-theme-button rounded w-20"></div>
        <div className="space-y-2">
          <div className="h-4 bg-theme-button rounded"></div>
          <div className="h-4 bg-theme-button rounded w-5/6"></div>
          <div className="h-4 bg-theme-button rounded w-4/6"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-theme-button rounded w-28"></div>
        <div className="space-y-2">
          <div className="h-4 bg-theme-button rounded"></div>
          <div className="h-4 bg-theme-button rounded w-5/6"></div>
          <div className="h-4 bg-theme-button rounded w-4/6"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-theme-button rounded w-16"></div>
        <div className="space-y-2">
          <div className="h-4 bg-theme-button rounded"></div>
          <div className="h-4 bg-theme-button rounded w-5/6"></div>
          <div className="h-4 bg-theme-button rounded w-4/6"></div>
        </div>
      </div>
    </div>
  </div>
);
