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
  const response = await axios.get(`${API_URL}/user/login`, {
    params: {
      username,
      password
    }
  });

  console.log('Response from authenticate:', response.data);

  const access_token = response.data.token || response.data; 
  return { access_token };
};

export const fetchAccounts = async (token: string, username: string): Promise<AccountsResponse> => {
  const response = await axios.get<AccountsResponse>(`${API_URL}/user/${username}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('fetchAccounts response:', response.data);

  return response.data;
};

export const calculateTotalBalance = (accounts: Account[]): number => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  return Math.ceil(totalBalance / 100) * 100;
};