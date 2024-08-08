import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION, GET_DASHBOARD_DATA } from '../../graphql';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      {
        query: GET_DASHBOARD_DATA,
        variables: { userId }
      }
    ],
    onCompleted: () => {
      setMessage('Transaction added successfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    },
    onError: (error) => {
      console.error('Error saving transaction:', error);
      setMessage('Error saving transaction.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please provide valid transaction details.');
      return;
    }

    const userConfirmed = window.confirm('Are you sure you want to add this transaction?');

    if (userConfirmed) {
      const transactionData = {
        description,
        amount: parseFloat(amount),
        type,
        date: selectedDate,
        userId,
      };

      try {
        await addTransaction({ variables: transactionData });
      } catch (error) {
        console.error('Error saving transaction:', error);
        setMessage('Error saving transaction.');
      }
    } else {
      setMessage('Transaction canceled.');
    }
  };

  return (
    <div className="add-transaction">
      <form onSubmit={handleSubmit} className="add-transaction-form">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          step="any"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
        <button type="submit">Add Transaction</button>
      </form>
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddTransaction;
