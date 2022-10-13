import { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useTokenAuth } from '../hooks/UseTokenAuth';
import { Navigate } from 'react-router-dom';

interface IProps {
  component: ReactElement;
  redirectTo: string;
}

function GuardedRoute(props: IProps) {
  const userContext = useContext(UserContext);

  const [isAuthed, setIsAuthed] = useState(false);

  const tokenAuth = useCallback(async () => {
    await useTokenAuth();
  }, []);

  useEffect(() => {
    tokenAuth()
      .then(() => setIsAuthed(true))
      .catch(() => (<Navigate to="/login" />));
  }, [tokenAuth]);

  const renderChildren = () => {
    return (
      <>
      {isAuthed ? (<div>{props.component}</div>) : (<div>Loading....</div>)}
      </>
    );
  };

  return (
    <UserContext.Provider value={userContext}>
      {renderChildren()}
    </UserContext.Provider>
  );
}

export default GuardedRoute;
