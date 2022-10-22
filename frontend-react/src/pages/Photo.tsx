import UserLayout from '../layouts/UserLayout';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function Photo() {
  const userContext = useContext(UserContext);
  const { photoId } = useParams();

  return (
    <UserLayout>
      <img
        src={import.meta.env.VITE_API + 'photo/single?photoId=' + photoId + '&digest=' + userContext.digest}
        alt={photoId}/>
    </UserLayout>
  );
}

export default Photo;
