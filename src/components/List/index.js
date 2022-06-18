import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, DELETE_BOOK } from 'gql/books';
import { useState } from 'react';

const List = () => {
  const [idDelete, setIdDelete] = useState(null);

  const { loading, error, data } = useQuery(GET_BOOKS, {
    fetchPolicy: 'no-cache',
  });

  const [deleteBook, { loading: loadingDeleteBook, error: errorDeleteBook }] =
    useMutation(DELETE_BOOK, {
      refetchQueries: [GET_BOOKS],
      onError: (res) => {
        console.log(res.networkError);
      },
    });

  if (loading) return 'Loading ...';

  if (error)
    return error?.graphQLErrors.map((error) => error) ?? error.networkError;

  if (data.getAllBooks.length === 0)
    return (
      <h1>
        Tidak ada buku, <Link to="/books/new">tambah buku</Link>
      </h1>
    );

  function fnDelete(_id) {
    setIdDelete(_id)
    deleteBook({
      variables: {
        _id,
      },
    });
  }

  return (
    <div>
      <h1>
        List buku
        <Link to="/books/new" style={{ fontSize: 12 }}>
          (+ Buat Baru)
        </Link>
      </h1>
      <ul>
        {data.getAllBooks.map((item) => {
          return (
            <li>
              <div>{item.title}</div>
              <Link to={`/books/${item._id}/edit`}>Edit</Link>
              <button onClick={() => fnDelete(item._id)}>
                {item._id === idDelete && loadingDeleteBook ? 'Loading...' : 'Delete'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default List;
