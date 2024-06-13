import axios from 'axios';

const API_URL = 'https://petstore3.swagger.io/api/v3'; // URL de l'API

interface AuthResponse {
  access_token: string;
}

interface AuthParams {
  username: string;
  password: string;
}

export const authenticate = async ({ username, password }: AuthParams): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`${API_URL}/user/login`, {
    params: {
      username,
      password
    }
  });

  return response.data;
};