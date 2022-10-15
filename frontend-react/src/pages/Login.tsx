import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import GuestLayout from '../layouts/GuestLayout';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';

function Login() {
  const navigateTo = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ( !username ) {
      setUsernameError(true);
    }
    if ( !password ) {
      setPasswordError(true);
    }
    if ( !username || !password ) return;
    setIsSigningIn(true);

    try {
      await useAuth(username, password);
      setIsSigningIn(false);
      navigateTo('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (d: string, setter: string) => {
    if ( setter === 'username' ) {
      setUsername(d);
      setUsernameError(false);
    }
    if ( setter === 'password' ) {
      setPassword(d);
      setPasswordError(false);
    }
  };

  return (
    <GuestLayout>
      <div className="w-[90%] md:w-[400px] h-auto bg-white rounded p-10">
        <div className="flex justify-center mb-6">
          <Logo/>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Input id="username" label="Username" placeholder="Username"
                 handleChange={(d: string) => handleInputChange(d, 'username')}
                 type="text"
                 hasError={usernameError}/>
          <Input id="password" label="Password" placeholder="Password"
                 handleChange={(d: string) => handleInputChange(d, 'password')}
                 type="password"
                 hasError={passwordError}/>

          <Button value="Login" variant="primary" type="submit" isActioning={isSigningIn}/>
          <Button value="Request Access" variant="secondary" href="/request-access"/>
        </form>
      </div>
    </GuestLayout>
  );
}

export default Login;
