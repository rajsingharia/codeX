import { useState, useContext } from 'react'
import LoginRegisterButton from '../../components/LoginRegisterButton'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { CustomTextField } from '../../components/CustomTextField'


interface loginUser {
  email: string,
  password: string
}

enum LoginOrRegister {
  login = 'login',
  register = 'register'
}

type LoginProps = {
  setLoginOrRegister: React.Dispatch<React.SetStateAction<LoginOrRegister>>
}

export const Login: React.FC<LoginProps> = ({ setLoginOrRegister }) => {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const loginUser = async() => {
    const user: loginUser = {
      email: email,
      password: password
    }

    const response = await axios.post('http://localhost:5000/api/v1/auth/login', user);
    console.log('Login Response ', response?.data)
    const accessToken = response.data.accessToken;
    login(accessToken);
    navigate('/');

    // try {
    //   await axios.post(
    //     'http://localhost:5000/api/v1/auth/storeAccessToken',
    //     { accessToken },
    //     { withCredentials: true }
    //   );
    //   navigate('/');
    // } catch (error) {
    //   console.error('Error storing accessToken in cookie:', error);
    // }
  }


  return (
    <div className='login-register-card-container'>
      <div className='login-register-card'>
        <div className='login-register-card-header'> Login </div>
        <div className='login-register-card-body'>
          <CustomTextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            size='small'
            color='secondary'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomTextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            type='password'
            margin="normal"
            size='small'
            color='secondary'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginRegisterButton
            variant="contained"
            fullWidth
            onClick={loginUser}>
            Login
          </LoginRegisterButton>
        </div>
      </div>
      <div>
        <div className='register-half-circle' onClick={() => setLoginOrRegister(LoginOrRegister.register)}>
          <div className='register-half-circle-text'> Register </div>
        </div>
      </div>
    </div>
  )
}
