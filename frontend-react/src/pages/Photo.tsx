import UserLayout from '../layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function Photo() {
  const userContext = useContext(UserContext);
  const { name } = useParams();

  return (
    <UserLayout>
      <img
        src={import.meta.env.VITE_API + 'photo/private/' + name + '?digest=' + userContext.digest}
        alt={name}/>
    </UserLayout>
  );
}

export default Photo;
