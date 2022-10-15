import { ReactElement, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useTokenAuth } from '../hooks/UseTokenAuth';
import { Navigate } from 'react-router-dom';

interface IProps {
  component: ReactElement;
  redirectTo: string;
}

function GuardedRoute(props: IProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    useTokenAuth()
      .then((data) => {
        setUser(data);
        setIsAuthed(true);
      })
      .catch(() => <Navigate to="/login"/>);
  }, []);

  const renderChildren = () => {
    return (
      <>
        {isAuthed ? (<div>{props.component}</div>) : (<div>Loading....</div>)}
      </>
    );
  };

  return (
    <UserContext.Provider value={user!}>
      {renderChildren()}
    </UserContext.Provider>
  );
}

export default GuardedRoute;
