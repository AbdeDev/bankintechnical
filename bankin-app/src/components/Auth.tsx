import React, { useState } from 'react';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import { authenticate, fetchAccounts, calculateTotalBalance } from '../services/authService';
import '../app.css';

interface AuthParams {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

interface Account {
  id: string;
  balance: number;
}

interface AccountsResponse {
  accounts: Account[];
}

const Auth: React.FC = () => {
  const [username, setUsername] = useState('user1@mail.com');
  const [password, setPassword] = useState('a!Strongp#assword1');
  const [token, setToken] = useState<string | null>(null);

  const mutation: UseMutationResult<AuthResponse, Error, AuthParams> = useMutation({
    mutationFn: authenticate,
    onSuccess: (data: AuthResponse) => {
      console.log('Access Token:', data.access_token);
      setToken(data.access_token);
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

  console.log('Token in Auth Component:', token);

  return (
    <div className="container">
      <div className="top-bar">Bankin</div>
      <div className="main-content">
        {!token ? (
          <div className="auth-section">
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
        ) : (
          <Accounts token={token} username={username} />
        )}
      </div>
    </div>
  );
};

interface AccountsProps {
  token: string;
  username: string;
}

const Accounts: React.FC<AccountsProps> = ({ token, username }) => {
  console.log('Accounts Component Token:', token);

  const { data, error, isLoading }: UseQueryResult<AccountsResponse, Error> = useQuery({
    queryKey: ['accounts', token],
    queryFn: () => fetchAccounts(token, username),
    enabled: !!token,
  });

  console.log('Data:', data);
  console.log('Error:', error);

  if (isLoading) {
    return <p>Chargement des comptes...</p>;
  }

  if (error) {
    return <p>Erreur lors du chargement des comptes: {error?.message}</p>;
  }

  if (!data) {
    return <p>Aucune donnée trouvée</p>;
  }

  const totalBalance = data ? calculateTotalBalance(data.accounts) : 0;

  return (
    <div className="accounts-section">
      <h1>Liste des comptes</h1>
      <ul>
        {data?.accounts.map(account => (
          <li key={account.id}>
            Compte {account.id}: {account.balance} €
          </li>
        ))}
      </ul>
      <h2>Solde total arrondi: {totalBalance} €</h2>
    </div>
  );
};

export default Auth;