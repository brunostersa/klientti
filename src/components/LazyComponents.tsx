import dynamic from 'next/dynamic';

// Lazy loading para componentes pesados
export const LazyFeedbackChart = dynamic(
  () => import('./FeedbackChart'),
  { 
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyAIAgent = dynamic(
  () => import('./AIAgent'),
  { 
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ),
    ssr: false
  }
);

export const LazyKnowledgeBase = dynamic(
  () => import('./KnowledgeBase'),
  { 
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyQRCodeGenerator = dynamic(
  () => import('./QRCodeGenerator'),
  { 
    loading: () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ),
    ssr: false
  }
);
