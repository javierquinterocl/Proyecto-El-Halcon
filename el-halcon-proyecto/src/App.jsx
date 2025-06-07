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
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee' 
import EditEmployee from "./pages/EditEmployee";
import Sales from './pages/Sales';
import AddSale from './pages/AddSale' 
import Purchases from './pages/Purchases';
import AddPurchase from './pages/AddPurchase' 
import Saleinvoices from './pages/Saleinvoices';
import Purchaseinvoices from './pages/PurchaseInvoices';
import Pawns from './pages/Pawns';
import AddPawn from './pages/AddPawn' 
import AddSaleInvoice from './pages/AddSaleInvoice';
import AddPurchaseinvoice from './pages/AddPurchaseinvoice';

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

          <Route path="employees" element={<Employees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />

          <Route path="saleinvoices" element={<Saleinvoices />} />
          <Route path="saleinvoices/add" element={<AddSaleInvoice />} />
          <Route path="purchaseinvoices" element={<Purchaseinvoices />} />
          <Route path="purchaseinvoices/add" element={<AddPurchaseinvoice />} />
          <Route path="Purchases" element={<Purchases />} />
          <Route path="Purchases/add" element={<AddPurchase />} />
          <Route path="pawns" element={<Pawns />} />
          <Route path="pawns/add" element={<AddPawn />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales/add" element={<AddSale />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

