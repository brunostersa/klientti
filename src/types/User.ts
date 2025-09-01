export interface User {
  uid: string;
  email: string;
  displayName?: string;
  theme?: 'light' | 'dark'; // Preferência de tema do usuário
  logoUrl?: string; // URL do logo da empresa
  googleMapsUrl?: string; // Link de avaliação do Google Maps
  role?: 'user' | 'admin' | 'super_admin'; // Role do usuário
  plan?: 'free' | 'starter' | 'professional'; // Plano do usuário
  createdAt: Date;
}
