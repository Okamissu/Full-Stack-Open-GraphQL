import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries.js';

const BirthYearForm = ({ authors, setNotification }) => {
  const [name, setName] = useState(authors[0].name ?? '');
  const [born, setBorn] = useState(authors[0].born ?? 2026);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setNotification(error.message);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName('');
    setBorn('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        alignItems: 'flex-start',
      }}
    >
      <label>
        name{' '}
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        born{' '}
        <input
          value={born}
          type="number"
          onChange={({ target }) => setBorn(target.value)}
        />
      </label>
      <button type="submit">update author</button>
    </form>
  );
};

const Authors = ({ setNotification, show }) => {
  const { loading, data, error } = useQuery(ALL_AUTHORS);

  useEffect(() => {
    if (error) setNotification(error.message);
  }, [error, setNotification]);

  if (!show) return null;
  if (loading) return <div>loading...</div>;
  if (error) return null;

  const authors = data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>set birthyear</h3>
      <BirthYearForm authors={authors} setNotification={setNotification} />
    </div>
  );
};

export default Authors;
