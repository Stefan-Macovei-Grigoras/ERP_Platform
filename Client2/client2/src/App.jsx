import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';  
//import ProtectedRoute from './components/ProtectedRoute';
import FactoryDashboard from './pages/FactoryDashboard';
import PackagingDashboard from './pages/PackagingDashboard'; // Import the PackagingDashboard component

export default function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Login />} />
         <Route
          path="/factory"
          element={
            // <ProtectedRoute>
            //   <FactoryDashboard/>
            // </ProtectedRoute>
            <FactoryDashboard/>
          }
        />
        <Route
          path="/packaging"
          element={
            // <ProtectedRoute>
            //   <PackagingDashboard/>
            // </ProtectedRoute>
            <PackagingDashboard/>
          }
        /> 
        <Route
          path="/admin"
          element={
            //<ProtectedRoute>
              <AdminDashboard />
            //</ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
