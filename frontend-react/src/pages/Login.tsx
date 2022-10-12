import GuestLayout from "../layouts/GuestLayout";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import Logo from "../components/logo/Logo";
import { useState } from "react";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(username, password);
  }

  return (
    <GuestLayout>
      <div className="w-[90%] md:w-[400px] h-auto bg-white rounded p-10">
        <Logo />
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Input handleChange={(d: string) => setUsername(d)} />
          <Input handleChange={(d: string) => setPassword(d)} type="password" />

          <Button value="Login" variant="secondary" />
        </form>
      </div>
    </GuestLayout>
  )
}

export default Login;
