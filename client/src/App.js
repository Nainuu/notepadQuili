import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import { 
  BrowserRouter as Router, 
  Route , 
  Routes, 
  Navigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';

function App() {
  return (
    <>
    <Routes>
        {/* Route 1: Redirect to a new document with a unique ID */}
        <Route
          path="/" exact
          element={<Navigate to={`/document/${uuidV4()}`} replace />}
        />

        {/* Route 2: Render App for a specific document */}
        {/* <Route path="/document/:id" element={<App />}>
        </Route> */}
      </Routes>

      <Header/>
      <Body/>
      <Footer/>
    </>
  );
}

export default App;
