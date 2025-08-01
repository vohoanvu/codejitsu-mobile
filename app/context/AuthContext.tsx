import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../constants/api';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const discovery = AuthSession.useAutoDiscovery(`${API_URL}/.well-known/openid-configuration`);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '417261355315-dufr7bit592b6rdovj8cg1dhm5mvc5f6.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'codejitsu',
        path: 'redirect',
      }),
    },
    discovery
  );

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      setAccessToken(token);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        const { code } = response.params;
        const exchangeCodeForToken = async (code: string) => {
          try {
            const tokenResponse = await fetch(`${API_URL}/api/externalauth/signin-google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            });
            if (tokenResponse.ok) {
              const { accessToken } = await tokenResponse.json();
              await SecureStore.setItemAsync('accessToken', accessToken);
              setAccessToken(accessToken);
            } else {
              console.error('Failed to exchange code for token:', await tokenResponse.text());
            }
          } catch (error) {
            console.error('Failed to exchange code for token', error);
          }
        };
        exchangeCodeForToken(code);
      } else if (response.type === 'error') {
        console.error('Authentication error:', response.error);
      }
    }
  }, [response]);

  const signIn = async () => {
    if (request) {
      await promptAsync();
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
