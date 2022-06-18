import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/Form';
import List from './components/List';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/books/:id/edit" element={<Form />} />
          <Route path="/books/new" element={<Form />} />
          <Route path="/books" element={<List />} />  
        </Routes>
      </Router>
    </div>
  );
}

export default App;
