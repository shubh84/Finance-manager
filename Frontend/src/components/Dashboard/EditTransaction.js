import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EDIT_TRANSACTION, GET_TRANSACTION_BY_ID, GET_TRANSACTIONS_BY_DATE } from '../../graphql';
import '../../styles/global.css';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');

  const { loading, error, data } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  const [editTransaction] = useMutation(EDIT_TRANSACTION, {
    refetchQueries: [
      {
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: new Date(0).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      }
    ],
  });

  useEffect(() => {
    if (data && data.transaction) {
      setFormData({
        description: data.transaction.description,
        amount: data.transaction.amount.toString(),
        type: data.transaction.type,
      });
      setSelectedDate(new Date(data.transaction.date));
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Are you sure you want to update this transaction?');

    if (userConfirmed) {
      try {
        await editTransaction({
          variables: {
            userId,
            id,
            description: formData.description,
            amount: parseFloat(formData.amount),
            type: formData.type,
            date: selectedDate.toISOString().split('T')[0]
          }
        });
        setMessage('Transaction updated successfully.');
        setTimeout(() => navigate('/dashboard'), 1000); // Redirect to the dashboard page
      } catch (error) {
        console.error('Error updating transaction:', error);
        setMessage('Error updating transaction.');
      }
    } else {
      setMessage('Transaction update canceled.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="edit-transaction">
      <div className="edit-transaction-content">
        <form onSubmit={handleSubmit} className="edit-transaction-form">
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            required
          />
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Amount"
            required
            step="any"
          />
          <select 
            value={formData.type} 
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button type="submit">Update Transaction</button>
        </form>
        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <Link to="/dashboard" className="back-link">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default EditTransaction;
