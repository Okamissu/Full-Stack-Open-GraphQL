import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_AUTHORS } from '../queries.js';

const Authors = ({ setNotification, show }) => {
  const { loading, data, error } = useQuery(ALL_AUTHORS);

  useEffect(() => {
    if (error) {
      setNotification(error.message);
    }
  }, [error, setNotification]);

  if (!show) {
    return null;
  }

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
    </div>
  );
};

export default Authors;
