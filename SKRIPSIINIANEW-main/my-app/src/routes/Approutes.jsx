import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfilePage from "../pages/Customer/ProfilePage";
import ResultPage from "../pages/Customer/ResultPage";
import CariParfumPage from "../pages/Customer/CariParfumPage";
import ProductDetail from "../pages/Customer/ProductDetail";
import Home from "../pages/Customer/Home";
import Layout from "../pages/Admin/AdminLayout";
import UserLayout from "../pages/Customer/UserLayout";
import AdminLayout from "../pages/Admin/AdminLayout";
import ProductManagement from "../pages/Admin/Product";
import UserManagement from "../pages/Admin/UserManagement";
import AdminEvaluation from "../pages/Admin/Evaluation";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Custome */}
      <Route 
        path="/"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <UserLayout/>
          </ProtectedRoute>
        }
        >
      {/* Home Route (Menggabungkan Side 1, 2, 3) */}

        <Route path="result" element={<ResultPage />} />
        <Route path="parfum" element={<CariParfumPage/>}/>
        <Route path="parfum/:id" element={<ProductDetail/>}/>
        <Route index element={<Home/>}/>
        {/* Profile Route (Berdiri Sendiri) */}
        <Route
          path="profile"
          element={
              <ProfilePage />
          }
        />
      </Route>



      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout/>
          </ProtectedRoute>
        }
      >
        <Route index path="perfumes" element={<ProductManagement/>}/>
        <Route path="evaluation" element={<AdminEvaluation/>}/>
        <Route path="user" element={<UserManagement/>}/>
      </Route>
    </Routes>
    
  );
};

export default AppRoutes;
