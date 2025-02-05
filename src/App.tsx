import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { MedicalHistory } from './pages/MedicalHistory';
import { Cart } from './pages/Cart';
import { Chat } from './pages/Chat';
import { Doctors } from './pages/Doctors';
import { UploadReport } from "./pages/UploadReports";
import { Scan } from './pages/Scan';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/uploadReport" element={<UploadReport />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="cart" element={<Cart />} />
          <Route path="chat" element={<Chat />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="scan" element={<Scan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
