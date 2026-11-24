import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PERSON } from '../queries';
import { addPersonToCache } from '../utils/apolloCache';

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.message);
    },
    update: (cache, response) => {
      const addedPerson = response.data.addPerson;
      addPersonToCache(cache, addedPerson);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length > 0 ? phone : undefined,
      },
    });

    setName('');
    setPhone('');
    setStreet('');
    setCity('');
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={submit}>
        <div>
          Name <input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          Phone <input value={phone} onChange={({ target }) => setPhone(target.value)} />
        </div>
        <div>
          Street{' '}
          <input value={street} onChange={({ target }) => setStreet(target.value)} />
        </div>
        <div>
          City <input value={city} onChange={({ target }) => setCity(target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default PersonForm;
