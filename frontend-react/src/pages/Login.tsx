import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import GuestLayout from '../layouts/GuestLayout';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';

function Login() {
  const navigateTo = useNavigate();

  const usernameRef = useRef<any>();
  const passwordRef = useRef<any>();

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isSigningIn, setIsSigningIn] = useState(false);

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
      // handle the error
      setIsSigningIn(false);
    }
  };

  return (
    <GuestLayout>
      <div className="w-[90%] md:w-[400px] h-auto bg-white rounded p-10">
        <div className="flex justify-center mb-6">
          <Logo/>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
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
      </div>
    </GuestLayout>
  );
}

export default Login;
