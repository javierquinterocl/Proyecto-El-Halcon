import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardContent from "./pages/DashboardContent";
import Add from "./pages/Add";
import Product from "./pages/Products";
import EditProduct from "./pages/EditProduct";

import Providers from "./pages/Providers";
import AddProvider from "./pages/AddProvider";
import EditProvider from "./pages/EditProvider";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
       
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContent />} />
         
          
          
          <Route path="add" element={<Add />} />
          <Route path="products" element={<Product />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          
       
          <Route path="providers" element={<Providers />} />
          <Route path="providers/add" element={<AddProvider />} />
          <Route path="providers/edit/:id" element={<EditProvider />} />
          
          
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/edit/:id" element={<EditCustomer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

