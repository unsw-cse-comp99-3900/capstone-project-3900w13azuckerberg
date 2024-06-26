import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomeMessage: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
      });
  }, []);

  return (
    <div>
      {message ? <p>{message}</p> : <p>Loading...</p>}
    </div>
  );
};

export default HomeMessage;
