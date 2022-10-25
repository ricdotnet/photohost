export const usePhoto = async (name: string) => {

  const getPhotoMeta = async () => {
    const url = new URL(`${import.meta.env.VITE_API}/photo/meta/${name}`);

    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      },
    });
    const data = await response.json();

    if ( !response.ok ) {
      return Promise.reject(data);
    }

    if ( response.ok && data.photo ) {
      return Promise.resolve(data.photo);
    }
  };
};
