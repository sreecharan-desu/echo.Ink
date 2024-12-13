import { useRecoilState } from 'recoil';
import { userState, tokenState } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate();

  const signin = async (username: string, password: string) => {
    try {
      const response = await api.signin(username, password);
      if (response.success && response.token) {
        const tokenWithBearer = `Bearer ${response.token}`;
        localStorage.setItem('token', tokenWithBearer);
        setToken(tokenWithBearer);

        // Set user data
        const userData = { username, id: response.id };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error(response.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/', { replace: true });
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    signin,
    signout,
  };
}