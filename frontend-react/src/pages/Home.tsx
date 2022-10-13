import React, { useContext, useEffect, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Loading from '../components/loading/Loading';
import UserLayout from '../layouts/UserLayout';

function Home() {
  const tokenAuthRes = useLoaderData() as { userData: any };

  const [user, setUser] = useState();

  return (
    <UserLayout userData={user}>
      <React.Suspense fallback={<Loading />}>
        <Await resolve={tokenAuthRes.userData}>
          {(userData) => (
            <UserContext.Provider value={userData}>
              <PageContent userSetter={setUser} />
            </UserContext.Provider>
          )}
        </Await>
      </React.Suspense>
    </UserLayout>
  );
}

function PageContent(props: any) {
  const userContext = useContext(UserContext);

  useEffect(() => {
    props.userSetter(userContext);
  }, []);

  return (
    <div>
      Current User:
      <div>email: {userContext.email}</div>
      <div>username: {userContext.username}</div>
    </div>
  );
}

export default Home;
