import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { EDIT_NUMBER } from '../queries';

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [changeNumber] = useMutation(EDIT_NUMBER, {
    onCompleted: (data) => {
      if (!data.editNumber) {
        setError('Person not found');
      }
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    changeNumber({ variables: { name, phone } });

    setName('');
    setPhone('');
  };

  return (
    <div>
      <h2>Change Number</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <label>
          Name <input value={name} onChange={({ target }) => setName(target.value)} />
        </label>
        <label>
          Phone <input value={phone} onChange={({ target }) => setPhone(target.value)} />
        </label>
        <button type="submit">Change number</button>
      </form>
    </div>
  );
};

export default PhoneForm;
