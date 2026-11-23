import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = ({ setNotification, show, genre }) => {
  const {
    loading: booksLoading,
    data: booksData,
    error: booksError,
  } = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre,
    },
  });

  useEffect(() => {
    if (booksError) {
      setNotification(booksError.message);
    }
  }, [booksError, setNotification]);

  if (!show) {
    return null;
  }

  if (booksLoading) return <div>loading...</div>;

  if (booksError) return null;

  const books = booksData.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre: <b>{genre}</b>
      </p>
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
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
