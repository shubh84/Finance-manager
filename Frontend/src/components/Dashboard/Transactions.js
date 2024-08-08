import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import {  DELETE_TRANSACTION,GET_TRANSACTIONS} from '../../graphql';


const Transactions = ({ transactions }) => {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    update(cache, { data: { deleteTransaction } }) {
      const { getAllTransactions } = cache.readQuery({ query:GET_TRANSACTIONS});
      cache.writeQuery({
        query: GET_TRANSACTIONS,
        data: {
          getAllTransactions: getAllTransactions.filter(
            transaction => transaction.id !== deleteTransaction.id
          ),
        },
      });
    },
  });
  


  const onDeleteTransaction = async (id) => {
    const confirmed = window.confirm("Do you want to delete this transaction?");
    const userId = localStorage.getItem('userId');
    if (confirmed) {
      try {
        await deleteTransaction({ variables: { userId, id } });
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };
  

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  return (
    <div className="transactions-list">
      <h3>Transaction List</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.date}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(transaction.id)}
                  >
                    Edit
                  </button>
                  <button className = "delete-button" onClick={() => onDeleteTransaction(transaction.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
