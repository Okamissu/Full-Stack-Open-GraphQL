import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ALL_GENRES } from '../queries';

const Books = ({ setNotification, show }) => {
  const [genre, setGenre] = useState('');

  const {
    loading: booksLoading,
    data: booksData,
    error: booksError,
  } = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre,
    },
  });

  const {
    loading: genresLoading,
    data: genresData,
    error: genresError,
  } = useQuery(ALL_GENRES);

  useEffect(() => {
    if (booksError || genresError) {
      setNotification(booksError.message + ' ' + genresError.message);
    }
  }, [booksError, genresError, setNotification]);

  if (!show) {
    return null;
  }

  if (booksLoading || genresLoading) return <div>loading...</div>;

  if (booksError || genresError) return null;

  const books = booksData.allBooks;
  const genres = genresData.allGenres;

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
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
