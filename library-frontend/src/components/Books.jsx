import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';

const Books = ({ setNotification, show }) => {
  const { loading, data, error } = useQuery(ALL_BOOKS);

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

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
