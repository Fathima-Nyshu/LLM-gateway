import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/keys"
          element={
            <Layout>
              <h2 className="text-2xl font-bold">API Keys</h2>
            </Layout>
          }
        />
        <Route
          path="/logs"
          element={
            <Layout>
              <h2 className="text-2xl font-bold">Usage Logs</h2>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;