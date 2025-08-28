import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  QuerySnapshot,
  DocumentData,
  orderBy,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreOptions {
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  enablePagination?: boolean;
  cacheTime?: number; // em milissegundos
}

interface PaginationState {
  hasMore: boolean;
  lastDoc: any;
  isLoading: boolean;
}

export function useFirestoreOptimized<T = DocumentData>(
  collectionName: string,
  filters: Array<{ field: string; operator: string; value: any }> = [],
  options: UseFirestoreOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    hasMore: true,
    lastDoc: null,
    isLoading: false
  });

  const cacheRef = useRef<Map<string, { data: T[]; timestamp: number }>>(new Map());
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { limitCount = 20, orderByField, orderDirection = 'desc', enablePagination = false, cacheTime = 300000 } = options;

  // Gerar chave de cache baseada nos filtros
  const cacheKey = useMemo(() => {
    return `${collectionName}_${JSON.stringify(filters)}_${limitCount}`;
  }, [collectionName, filters, limitCount]);

  // Função para construir query
  const buildQuery = useCallback(() => {
    let q = collection(db, collectionName);
    
    // Aplicar filtros
    filters.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator as any, value));
    });

    // Aplicar ordenação
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    // Aplicar limite
    q = query(q, limit(limitCount));

    return q;
  }, [collectionName, filters, orderByField, orderDirection, limitCount]);

  // Função para carregar dados com cache
  const loadData = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar cache
      if (useCache) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      // Carregar dados do Firestore
      const q = buildQuery();
      const snapshot = await getDocs(q);
      
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      // Atualizar cache
      cacheRef.current.set(cacheKey, {
        data: newData,
        timestamp: Date.now()
      });

      setData(newData);
      setPagination(prev => ({
        ...prev,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount
      }));

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, buildQuery, cacheTime, limitCount]);

  // Função para carregar mais dados (pagination)
  const loadMore = useCallback(async () => {
    if (!enablePagination || !pagination.hasMore || pagination.isLoading) return;

    try {
      setPagination(prev => ({ ...prev, isLoading: true }));

      let q = buildQuery();
      if (pagination.lastDoc) {
        q = query(q, startAfter(pagination.lastDoc));
      }

      const snapshot = await getDocs(q);
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      setData(prev => [...prev, ...newData]);
      setPagination({
        hasMore: snapshot.docs.length === limitCount,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        isLoading: false
      });

    } catch (err) {
      console.error('Erro ao carregar mais dados:', err);
      setPagination(prev => ({ ...prev, isLoading: false }));
    }
  }, [enablePagination, pagination.hasMore, pagination.isLoading, pagination.lastDoc, buildQuery, limitCount]);

  // Função para limpar cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Função para invalidar cache específico
  const invalidateCache = useCallback((key?: string) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.delete(cacheKey);
    }
  }, [cacheKey]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    loadData,
    loadMore,
    clearCache,
    invalidateCache,
    refresh: () => loadData(false)
  };
}
