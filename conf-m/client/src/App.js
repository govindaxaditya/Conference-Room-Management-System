import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Adminlogin from './screens/Adminlogin';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Homescreen />} />
          <Route path="/book/:roomid/:date/:starttime/:endtime" element={<Bookingscreen />} />
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/profile" element={<Profilescreen />} />
          <Route path="/admin" element={<Adminscreen />} />
          <Route path="/" element={<Loginscreen />} />
          <Route path="/adminlogin" element={<Adminlogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
