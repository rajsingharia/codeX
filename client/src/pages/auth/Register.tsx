import { useState } from 'react'
import LoginRegisterButton from '../../components/LoginRegisterButton'
import axios from 'axios'
import { CustomTextField } from '../../components/CustomTextField'


interface registerUser {
  name: string,
  email: string,
  password: string
}

enum LoginOrRegister {
  login = 'login',
  register = 'register'
}

type RegisterProps = {
  setLoginOrRegister: React.Dispatch<React.SetStateAction<LoginOrRegister>>
}


export const Register: React.FC<RegisterProps> = ({ setLoginOrRegister }) => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerUser = () => {
    console.log(`Register user with name: ${name}, email: ${email} and password: ${password}`);

    const user: registerUser = {
      name: name,
      email: email,
      password: password
    }

    axios.post('http://localhost:5000/api/v1/auth/register', user)
    .then(()=> {
      alert('User registered successfully, please login');
      setLoginOrRegister(LoginOrRegister.login);
    })
    .catch((err) => {
      console.log(err.response.data);
    });

  }


  return (
    <div className='login-register-card-container'>
      <div className='login-register-card'>
        <div className='login-register-card-header'> Register </div>
        <div className='login-register-card-body'>
        <CustomTextField
            id="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            size='small'
            color='secondary'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomTextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            type='email'
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
            margin="normal"
            size='small'
            type='password'
            color='secondary'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginRegisterButton
            variant="contained"
            fullWidth
            onClick={registerUser}>
            Register
          </LoginRegisterButton>
        </div>
      </div>
      <div>
        <div className='login-half-circle' onClick={() => setLoginOrRegister(LoginOrRegister.login)}>
          <div className='login-half-circle-text'> Login </div>
        </div>
      </div>
    </div>
  )
}
