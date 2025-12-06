'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User type - can be authenticated via zkLogin (email) or wallet
interface User {
  id: string;
  email?: string;
  provider?: 'google' | 'facebook' | 'twitch' | 'apple';
  suiAddress?: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (provider: 'google' | 'facebook' | 'twitch' | 'apple') => Promise<void>;
  loginWithWallet: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sui zkLogin configuration
const SUI_NETWORK = 'testnet'; // or 'mainnet'
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('traject3_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('traject3_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('traject3_user');
    }
  }, [user]);

  const loginWithEmail = async (provider: 'google' | 'facebook' | 'twitch' | 'apple') => {
    setIsLoading(true);

    try {
      // For demo purposes, we'll simulate the zkLogin flow
      // In production, this would involve:
      // 1. Generate ephemeral keypair
      // 2. Get OAuth JWT from provider
      // 3. Send to salt service to get unique salt
      // 4. Generate ZK proof
      // 5. Derive Sui address

      // Simulated OAuth popup
      const mockEmail = `user_${Date.now()}@example.com`;
      const mockSuiAddress = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      // In production, use actual OAuth flow:
      // const nonce = generateNonce();
      // const authUrl = getGoogleAuthUrl(nonce);
      // window.location.href = authUrl;

      const newUser: User = {
        id: `zklogin_${Date.now()}`,
        email: mockEmail,
        provider,
        suiAddress: mockSuiAddress,
        displayName: mockEmail.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async () => {
    setIsLoading(true);

    try {
      // Check if Sui wallet is installed
      // @ts-ignore
      const wallet = window.suiWallet;

      if (!wallet) {
        throw new Error('Sui wallet not found. Please install Sui Wallet extension.');
      }

      // Request connection
      // const accounts = await wallet.requestPermissions();
      // const address = accounts[0];

      // For demo, simulate wallet connection
      const mockAddress = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newUser: User = {
        id: `wallet_${Date.now()}`,
        suiAddress: mockAddress,
        displayName: `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('traject3_user');
    localStorage.removeItem('traject3_journeys');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithEmail,
        loginWithWallet,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
