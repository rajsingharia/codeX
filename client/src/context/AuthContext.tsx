import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';
import { AuthAxios } from '../utils/AxiosConfig';
import Cookies from 'universal-cookie';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  loading: boolean;
  user: IUser;
}

const AuthContext = createContext({} as AuthContextProps);

const AuthProvider = ({ children }: React.PropsWithChildren<{ children: React.ReactNode }>) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const authAxios = AuthAxios();
  const cookies = new Cookies();
  const [user, setUser] = useState<IUser>({} as IUser);

  const verifyToken = (): boolean => {
    const authToken = getAuthTokenFromCookies(cookies);
    const hasToken = authToken ? true : false;
    // TODO: verify token with server
    return hasToken;
  };


  useEffect(() => {
    const isTokenValid = verifyToken();
    if (isTokenValid) {
      authAxios.get("http://localhost:5000/api/v1/user/get-user")
        .then((res) => {
          console.log(res.data);
          const user = res.data;
          setUser(user);
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch((err) => {
          const errorMessage = (err && err.response) ? err.response.data : "Something went wrong";
          console.log(errorMessage);
          setIsLoggedIn(false);
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const login = (accessToken: string) => {
    setAuthTokenToCookies(cookies, accessToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearCookies(cookies);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

function setAuthTokenToCookies(cookies: Cookies, accessToken: string) {
  // httpOnly: true, secure: true, sameSite: 'strict'
  cookies.set('accessToken', accessToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
}

function getAuthTokenFromCookies(cookies: Cookies) {
  const authToken = cookies.get('accessToken', { doNotParse: true });
  return authToken;
}

function clearCookies(cookies: Cookies) {
  cookies.remove('accessToken');
}

export { AuthContext, AuthProvider };