import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import Inventory from './pages/Inventory';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Main App Layout */}
      <Route element={<Layout />}>
        {/* Publically Accessible Pages */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        
        {/* Protected Pages inside Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/orders" element={<OrderList />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetail />} />
          <Route path="/dashboard/inventory" element={<Inventory />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<AddProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Route>

      {/* Redirect root to products */}
      <Route path="/" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;
