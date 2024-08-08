import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Transactions from './Transactions';
import '../../styles/global.css';
import {
  GET_DASHBOARD_DATA,
  DELETE_TRANSACTION
} from '../../graphql';

const Dashboard = () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userId }
  });

  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all'); // Default to 'all' to show all transactions
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      refetch();
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { totalIncome = 0, totalExpenses = 0, incomes = [], expenses = [] } = data || {};

  const transactions = selectedType === 'all' ? [...incomes, ...expenses] : (selectedType === 'INCOME' ? incomes : expenses);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleAddTransaction = () => {
    navigate('/transaction');
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDeleteTransaction = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmed) {
      try {
        await deleteTransaction({ variables: { userId, id } });
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearchTerm = Object.values(transaction)
        .map(value => value.toString().toLowerCase())
        .some(value => value.includes(searchTerm));
      return matchesSearchTerm;
    });

  return (
    <div className="container">
      <header className="header">
        <h1>Welcome to Personal Finance Manager</h1>
        <div className="controls">
          <button className="button" onClick={handleAddTransaction}>Add Transaction</button>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h2>Finance Dashboard</h2>
          <div className="stats">
            <p>Total Balance: ${(totalIncome - totalExpenses).toFixed(2)}</p>
            <div className="summary">
              <p>Income: ${totalIncome.toFixed(2)}</p>
            </div>
            <div className="summary">
              <p>Expenses: ${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input"
            />
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="input"
            >
              <option value="all">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="transaction-list">
            <Transactions transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
