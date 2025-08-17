// import { Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



// import Login from './pages/Login';
// import NotFound from './pages/NotFound';
// import AdminDashboard from './pages/AdminDashboard';  
// import ProtectedRoute from './components/shared/ProtectedRoutes';
// import FactoryDashboard from './pages/FactoryDashboard';
// import PackagingDashboard from './pages/PackagingDashboard'; 
// //import { AuthProvider } from './context/authContext';
// import { AuthProvider } from './context/authContext'; // Ensure this path is correct

// export default function App() {
//   return (
//     <>
//       <ToastContainer />
//       <Routes>
//         <AuthProvider>
//         <Route path="/" element={<Login />} />
//          <Route
//           path="/factory"
//           element={
//             <ProtectedRoute>
//                <FactoryDashboard/>
//              </ProtectedRoute>

//           }
//         />
//         <Route
//           path="/packaging"
//           element={
//              <ProtectedRoute>
//                <PackagingDashboard/>
//              </ProtectedRoute>
//           }
//         /> 
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<NotFound />} />
//        </AuthProvider>
//       </Routes>
//     </>
//   );
// }
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';  
import ProtectedRoute from './components/shared/ProtectedRoutes';
import FactoryDashboard from './pages/FactoryDashboard';
import PackagingDashboard from './pages/PackagingDashboard'; 
import { AuthProvider } from './context/authContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/factory"
          element={
            <ProtectedRoute requiredRole="factory">
               <FactoryDashboard/>
             </ProtectedRoute>
          }
        />
        <Route
          path="/packaging"
          element={
             <ProtectedRoute requiredRole="packaging">
               <PackagingDashboard/>
             </ProtectedRoute>
          }
        /> 
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}