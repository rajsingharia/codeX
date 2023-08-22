import { useState } from 'react'
import { Login } from './Login';
import { Register } from './Register';
import './LoginRegister.css'

enum LoginOrRegister {
    login = 'login',
    register = 'register'
}

export default function LoginRegister() {

    const [loginOrRegister, setLoginOrRegister] = useState(LoginOrRegister.login);

    return (
        <div className="login-register">
            <div>
                {
                    loginOrRegister === LoginOrRegister.login ?
                        <Login
                            setLoginOrRegister={setLoginOrRegister}
                        /> :
                        <Register
                            setLoginOrRegister={setLoginOrRegister}
                        />
                }
            </div>
        </div>
    )
}
