import React, { useEffect, useState } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import GuestLayout from '../layouts/GuestLayout';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';
import Loading from '../components/loading/Loading';

function Login() {
  const navigateTo = useNavigate();
  const isAuthed = useLoaderData();

  useEffect(() => {
    if ( isAuthed ) {
      navigateTo('/');
    }
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ( !username ) {
      setUsernameError(true);
    }
    if ( !password ) {
      setPasswordError(true);
    }
    if ( !username || !password ) return;

    try {
      await useAuth(username, password);
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
      <React.Suspense fallback={<Loading/>}>
        <Await resolve={isAuthed}>
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

              <Button value="Login" variant="primary" type="submit"/>
              <Button value="Request Access" variant="secondary" href="/request-access"/>
            </form>
          </div>
        </Await>
      </React.Suspense>
    </GuestLayout>
  );
}

export default Login;
