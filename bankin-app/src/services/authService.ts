import axios from 'axios';

const API_URL = 'https://petstore3.swagger.io/api/v3';

interface AuthResponse {
  access_token: string;
}

interface AuthParams {
  username: string;
  password: string;
}

interface Account {
  id: string;
  balance: number;
}

interface AccountsResponse {
  accounts: Account[];
}

export const authenticate = async ({ username, password }: AuthParams): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`${API_URL}/user/login`, {
    params: {
      username,
      password
    }
  });

  console.log('Response from authenticate:', response.data); // Ajout de journalisation pour le débogage

  return response.data;
};

export const fetchAccounts = async (token: string): Promise<AccountsResponse> => {
  const response = await axios.get<AccountsResponse>(`${API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('fetchAccounts response:', response.data); // Ajout de journalisation pour le débogage

  return response.data;
};

export const calculateTotalBalance = (accounts: Account[]): number => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  return Math.ceil(totalBalance / 100) * 100;
};