import { ReactElement, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext, UserStore } from '../contexts/UserContext';
import { useTokenAuth } from '../hooks/UseTokenAuth';

interface GuardRoutePropsInterface {
  component: ReactElement;
  redirectTo: string;
}

function GuardedRoute(props: GuardRoutePropsInterface) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<typeof UserStore | null>(null);

  useEffect(() => {
    useTokenAuth()
      .then((data) => {
        setUser((user: typeof UserStore | null) => {
          return user = data;
        });
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
    <UserContext.Provider value={[user!, setUser]}>
      {renderChildren()}
    </UserContext.Provider>
  );
}

export default GuardedRoute;
