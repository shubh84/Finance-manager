// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardPage from './pages/DashboardPage';
import TransactionForm from './components/Dashboard/AddTransaction'; 
import EditTransactionPage from './components/Dashboard/EditTransaction'; 

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transaction" element={<TransactionForm />} /> 
      <Route path="/edit-transaction/:id" element={<EditTransactionPage />} /> 
    </Routes>
  </Router>
);

export default App;
