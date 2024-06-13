import React from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchAccounts, calculateTotalBalance } from '../services/authService';

interface Account {
  id: string;
  balance: number;
}

interface AccountsResponse {
  accounts: Account[];
}

interface AccountsProps {
  token: string;
}

const Accounts: React.FC<AccountsProps> = ({ token }) => {
  console.log('Accounts Component Token:', token); // Ajout de journalisation pour le débogage

  const { data, error, isLoading }: UseQueryResult<AccountsResponse, Error> = useQuery({
    queryKey: ['accounts', token],
    queryFn: () => fetchAccounts(token),
    enabled: !!token, // Assurez-vous que la requête n'est exécutée que si le token est disponible
  });

  console.log('Data:', data); // Ajout de journalisation pour le débogage
  console.log('Error:', error); // Ajout de journalisation pour le débogage

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
    <div>
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

export default Accounts;