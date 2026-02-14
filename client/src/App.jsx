import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/auth';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateFood from './pages/Admin/CreateFood';
import Products from './pages/Admin/Products';
import UpdateProduct from './pages/Admin/UpdateFood';
import AdminOrders from './pages/Admin/AdminOrders';
import Users from './pages/Admin/Users';
import AdminRoute from './components/Routes/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import PrivateRoute from './components/Routes/PrivateRoute';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';
import Wishlist from './pages/user/Wishlist';
import { SocketProvider } from './context/SocketProvider';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
              <Navbar />
              <Cart />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />

                  {/* User Private Routes */}
                  <Route path="/dashboard" element={<PrivateRoute />}>
                    <Route path="user" element={<Dashboard />} />
                    <Route path="user/profile" element={<Profile />} />
                    <Route path="user/orders" element={<Orders />} />
                    <Route path="user/wishlist" element={<Wishlist />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="create-food" element={<CreateFood />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:slug" element={<UpdateProduct />} />
                    <Route path="food-list" element={<Products />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<Users />} />
                  </Route>
                </Routes>
              </main>
              <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm mt-auto shadow-inner">
                <div className="max-w-7xl mx-auto px-4">
                  <p>&copy; {new Date().getFullYear()} EasyOrder. Crafted with 🧡 for foodies.</p>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
