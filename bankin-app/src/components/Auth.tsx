import React, { useState } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authenticate } from '../services/authService';

interface AuthParams {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

const Auth: React.FC = () => {
  const [username, setUsername] = useState('user1@mail.com');
  const [password, setPassword] = useState('a!Strongp#assword1');

  const mutation: UseMutationResult<AuthResponse, Error, AuthParams> = useMutation({
    mutationFn: authenticate,
    onSuccess: (data: AuthResponse) => {
      console.log('Access Token:', data.access_token);
      // Enregistre le token ou gère l'état d'authentification ici
    },
    onError: (error: Error) => {
      console.error('Erreur d\'authentification:', error);
    }
  });

  const handleAuth = () => {
    mutation.mutate({
      username,
      password
    });
  };

  return (
    <div>
      <h1>Authentification</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button onClick={handleAuth}>S'authentifier</button>
      {mutation.status === 'pending' && <p>Chargement...</p>}
      {mutation.status === 'error' && <p>Erreur d'authentification.</p>}
      {mutation.status === 'success' && <p>Authentification réussie !</p>}
    </div>
  );
};

export default Auth;
