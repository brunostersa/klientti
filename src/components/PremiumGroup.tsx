'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Card, { CardHeader, CardContent } from './Card';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: any;
  likes: number;
  comments: number;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
}

interface PremiumGroupProps {
  user: any;
  userProfile: any;
}

export default function PremiumGroup({ user, userProfile }: PremiumGroupProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'premium-group', 'main', 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await addDoc(collection(db, 'premium-group', 'main', 'posts'), {
        authorId: user.uid,
        authorName: userProfile?.name || user.displayName || 'Usuário',
        title: newPostTitle,
        content: newPostContent,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
      });

      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-border-primary mx-auto mb-4"></div>
          <p className="text-theme-primary">Carregando grupo premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-theme-primary mb-4">
            👥 Grupo de Evolução Premium
          </h1>
          <p className="text-xl text-theme-secondary mb-6">
            Conecte-se com outros empreendedores e acelere o crescimento do seu negócio
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-primary-light to-brand-secondary-light text-brand-primary text-sm font-medium">
            <span className="mr-2">💎</span>
            Acesso Exclusivo para Clientes Premium e Pro
          </div>
        </div>

        {/* New Post Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="w-full py-3 px-6 rounded-lg font-medium bg-brand-primary hover:bg-brand-primary-hover text-theme-inverse transition-colors"
          >
            {showNewPost ? 'Cancelar' : '+ Criar Nova Postagem'}
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-theme-primary">Criar Nova Postagem</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-theme-border-primary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Digite o título da sua postagem..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    Conteúdo
                  </label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-theme-border-primary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Compartilhe suas experiências, dicas ou faça perguntas..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-theme-inverse rounded-lg transition-colors"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-theme-primary mb-2">
                    Nenhuma postagem ainda
                  </h3>
                  <p className="text-theme-secondary">
                    Seja o primeiro a compartilhar algo no grupo!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-theme-primary">{post.authorName}</h3>
                        <p className="text-sm text-theme-secondary">
                          {post.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-theme-secondary">
                      <span>👍 {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-lg font-semibold text-theme-primary mb-3">
                    {post.title}
                  </h4>
                  <p className="text-theme-secondary whitespace-pre-wrap">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
