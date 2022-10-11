import { useEffect, useState } from 'react';

function App() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/photo/all', {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
      }
    })
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  return <div>
    {photos.map((photo: any) =>
      // (<div key={photo.filename}>{photo.fullPath}</div>)
      (<img src={'http://localhost:4000/api/v1/photo/' + photo.filename + `?digest=${import.meta.env.VITE_DIGEST}`}
            key={photo.filename} alt={photo.filename} width={100}/>)
    )}
  </div>;
}

export default App;
