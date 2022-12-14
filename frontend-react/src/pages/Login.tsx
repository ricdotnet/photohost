import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { InputRefInterface } from '../interfaces/InputRefInterface';
import GuestLayout from '../layouts/GuestLayout';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';

import './Login.scss';

function Login() {
  const navigateTo = useNavigate();

  const usernameRef = useRef<InputRefInterface>(null);
  const passwordRef = useRef<InputRefInterface>(null);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ( !usernameRef.current!.value() ) {
      setUsernameError(true);
    }
    if ( !passwordRef.current!.value() ) {
      setPasswordError(true);
    }
    if ( !usernameRef.current!.value() || !passwordRef.current!.value() ) return;
    setIsSigningIn(true);

    try {
      await useAuth(usernameRef.current!.value(), passwordRef.current!.value());
      setIsSigningIn(false);
      navigateTo('/');
    } catch (err) {
      setLoginFailed(true);
      setIsSigningIn(false);

      if ( errorTimer !== null ) {
        clearTimeout(errorTimer);
      }
      setErrorTimer((timer: NodeJS.Timeout | null) => {
        return setTimeout(() => setLoginFailed(false), 5000);
      });
    }
  };

  const handleErrorMessageClick = () => {
    clearTimeout(errorTimer!);
    setLoginFailed(false);
  };

  return (
    <GuestLayout>
      <div className="login-container">
        <div className="login-container__logo">
          <Logo/>
        </div>
        <form onSubmit={handleSubmit} className="login-container__form">
          <Input
            ref={usernameRef}
            id="username" label="Username" placeholder="Username"
            type="text"
            hasError={usernameError}
            handleOnFocus={() => setUsernameError(false)}
          />
          <Input
            ref={passwordRef}
            id="password" label="Password" placeholder="Password"
            type="password"
            hasError={passwordError}
            handleOnFocus={() => setPasswordError(false)}
          />

          <Button value="Login" variant="primary" type="submit" isActioning={isSigningIn}/>
          <Button value="Request Access" variant="secondary" href="/request-access"/>
        </form>

        {loginFailed &&
          <div
            className={'login-container__error-box'}
            onClick={handleErrorMessageClick}
          >
            Please verify your credentials and try again.
          </div>
        }

      </div>
    </GuestLayout>
  );
}

export default Login;
