import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentDate } from '../utils/helpers';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Savings', amount: 0, expenseTotal: 0, incomeTotal: 0 },
    { id: 2, name: 'School', amount: 0, expenseTotal: 0, incomeTotal: 0 },
    { id: 3, name: 'Food', amount: 0, expenseTotal: 0, incomeTotal: 0 },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Salary', amount: 3000, date: '2024-01-01', category: 'Income', type: 'income' },
    { id: 2, name: 'Groceries', amount: 150, date: '2024-01-02', category: 'Food', type: 'expense' },
    { id: 3, name: 'Tuition', amount: 500, date: '2024-01-03', category: 'School', type: 'expense' },
    { id: 4, name: 'Investment Return', amount: 200, date: '2024-01-04', category: 'Savings', type: 'income' },
  ]);

  const addCategory = (name) => {
    const newCategory = {
      id: Date.now(),
      name: name,
      amount: 0,
      expenseTotal: 0,
      incomeTotal: 0
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
    // Also remove transactions associated with this category
    setTransactions(transactions.filter(transaction => transaction.category !== categories.find(c => c.id === id)?.name));
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      amount: parseFloat(transaction.amount),
      date: transaction.date || getCurrentDate()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? { 
        ...transaction, 
        ...updatedTransaction,
        amount: parseFloat(updatedTransaction.amount),
        date: updatedTransaction.date || transaction.date
      } : transaction
    ));
  };

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const remainingBalance = totalIncome - totalExpenses;
    
    // Calculate amounts per category
    const categoryTotals = categories.map(category => {
      const categoryTransactions = transactions.filter(t => t.category === category.name);
      const expenseTotal = categoryTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const incomeTotal = categoryTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...category,
        expenseTotal,
        incomeTotal,
        netTotal: incomeTotal - expenseTotal
      };
    });
    
    return { 
      totalIncome, 
      totalExpenses, 
      remainingBalance,
      categoryTotals
    };
  };

  const value = {
    categories,
    transactions,
    addCategory,
    deleteCategory,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    calculateTotals
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};