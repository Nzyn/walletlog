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
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, transRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/transactions`)
        ]);
        const cats = await catRes.json();
        const trans = (await transRes.json()).map(t => ({
          ...t,
          amount: parseFloat(t.amount)
        }));
        setCategories(cats);
        setTransactions(trans);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(loading => false);
      }
    };
    fetchData();
  }, []);

  const addCategory = async (categoryData) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryData.name })
      });
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const deleteCategory = (id) => {
    // Note: Backend delete not yet implemented, but updating local state for now
    setCategories(categories.filter(category => category.id !== id));
    setTransactions(transactions.filter(transaction => transaction.category_id !== id));
  };

  const addTransaction = async (transaction) => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: transaction.name,
          amount: parseFloat(transaction.amount),
          category_id: transaction.category_id,
          type: transaction.type,
          date: transaction.date || getCurrentDate(),
          recipient: transaction.recipient
        })
      });
      const newTransaction = await res.json();
      setTransactions([newTransaction, ...transactions]);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const deleteTransaction = (id) => {
    // Note: Backend delete not yet implemented
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (id, updatedTransaction) => {
    // Note: Backend update not yet implemented
    setTransactions(transactions.map(transaction =>
      transaction.id === id ? {
        ...transaction,
        ...updatedTransaction,
        amount: parseFloat(updatedTransaction.amount),
        date: updatedTransaction.date || transaction.date
      } : transaction
    ));
  };

  // Set budgets for a category
  const setCategoryBudget = (categoryId, budgets) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: budgets
    }));
  };

  // Get budgets for a category
  const getCategoryBudgets = (categoryId) => {
    return categoryBudgets[categoryId] || {};
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
      const categoryTransactions = transactions.filter(t => t.category_id === category.id);
      const expenseTotal = categoryTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const incomeTotal = categoryTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const budgets = getCategoryBudgets(category.id);

      return {
        ...category,
        expenseTotal,
        incomeTotal,
        netTotal: incomeTotal - expenseTotal,
        budgets
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
    categoryBudgets,
    loading,
    addCategory,
    deleteCategory,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setCategoryBudget,
    getCategoryBudgets,
    calculateTotals
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
