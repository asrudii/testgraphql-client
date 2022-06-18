import { Link, useNavigate, useParams } from 'react-router-dom';

import { NEW_BOOK, GET_BOOK_DETAIL, UPDATE_BOOK } from 'gql/books';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

const Form = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [newBook, { loading: loadingNewBook, error: errorNewBook }] =
    useMutation(NEW_BOOK);

  const [updateBook, { loading: loadingUpdateBook, error: errorUpdateBook }] =
    useMutation(UPDATE_BOOK);

  const [
    getBookDetail,
    { loading: loadingBook, error: errorBook, data: dataBook },
  ] = useLazyQuery(GET_BOOK_DETAIL, {
    variables: { _id: params.id },
  });

  useEffect(() => {
    if (params.id) getBookDetail();
  }, [params.id, getBookDetail]);

  useEffect(() => {
    if (dataBook) {
      const form = document.getElementById('form-book');
      console.log(dataBook);
      for (let index = 0; index < form.length; index++) {
        const element = form[index];
        if (element.nodeName === 'INPUT')
          element.value = dataBook.getBook[element.name];
      }
    }
  }, [dataBook]);

  if (params.id && loadingBook) return 'Loading...';
  if (errorNewBook || errorBook) return 'Network Error';

  async function onSubmit(event) {
    event.preventDefault();

    const payload = {};

    for (let index = 0; index < event.target.length; index++) {
      const element = event.target[index];
      if (element.nodeName === 'INPUT') payload[element.name] = element.value;
    }

    if (params.id) {
      try {
        const response = await updateBook({
          variables: {
            ...payload,
            _id: params.id,
            release_year: parseInt(payload.release_year),
          },
        });

        if (response) navigate('/books');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await newBook({
          variables: {
            ...payload,
            release_year: parseInt(payload.release_year),
          },
        });

        if (response) navigate('/books');
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <h1>
        <Link to="/books">{'(< back)'}</Link> Formulir penambahan buku
      </h1>
      <form id="form-book" style={{ maxWidth: 500 }} onSubmit={onSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="title">Title :</label>
          <input type="text" id="title" name="title" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="author">Author :</label>
          <input type="text" id="author" name="author" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="description">Description :</label>
          <input type="text" id="description" name="description" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="release_year">Release Year</label>
          <input type="number" id="release_year" name="release_year" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="genre">Genre</label>
          <input type="text" id="genre" name="genre" />
        </div>

        <button type="button" onClick={() => navigate('/books')}>
          Back
        </button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Form;
