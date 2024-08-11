import './App.css';
import {
  // BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Home from './pages/Home';
import { Toaster } from "react-hot-toast"
import ChatPage from './pages/ChatPage';

function App() {
  return (
    // <Router>
    <>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/chats' element={<ChatPage />}></Route>
        </Routes>
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </>
    // </Router>
  );
}

export default App;
