import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Fab,
  Link
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useBudget } from '../contexts/BudgetContext';
import TransactionForm from '../components/TransactionForm';
import AddCategoryPopup from '../components/AddCategoryPopup';
import { formatCurrency, filterTransactionsByPeriod } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { transactions, categories, addTransaction, deleteTransaction, updateTransaction, calculateTotals } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);

  const filteredTransactions = filterTransactionsByPeriod(transactions, selectedPeriod);
  const navigate = useNavigate();

  const handleAddCategory = (categoryData) => {
    addTransaction(categoryData);
  };
  
  const handleAddTransaction = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      addTransaction(data);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const totals = calculateTotals();

  // Function to handle click on income/expense cards to go to transaction history
  const goToTransactionHistory = (type) => {
    // Navigate to the transaction history page with the selected type
    navigate('/transactions', { state: { transactionType: type, selectedPeriod } });
  };

  // Function to get current date in readable format
  const getCurrentDateFormatted = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{
      paddingX: { xs: 0, sm: 0 },
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          color: '#1E293B',
          fontWeight: 700,
          fontSize: { xs: '1.75rem', sm: '2.5rem' }
        }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{
          color: '#64748B',
          fontSize: { xs: '0.95rem', sm: '1.05rem' }
        }}>
          {getCurrentDateFormatted()}
        </Typography>
      </Box>

      {/* Period and Financial Summary Container */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} width={{ xs: '100%', sm: 'auto' }}>
          <Typography variant="h6" sx={{
            color: '#1E293B',
            fontWeight: 600,
            whiteSpace: { xs: 'normal', sm: 'nowrap' }
          }}>
            {selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Half-Month'}
          </Typography>
          <FormControl size="small" sx={{
            minWidth: { xs: '100%', sm: 160 },
            backgroundColor: '#FFFFFF',
            borderRadius: 1,
          }}>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ fontWeight: 600, fontSize: '0.9rem' }}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="half-month">This Half-Month</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Income Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 40px rgba(16, 185, 129, 0.25)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                right: -2,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
            onClick={() => goToTransactionHistory('income')}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1, pb: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                Total Income
              </Typography>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, fontSize: '2rem' }}>
                {formatCurrency(totals.totalIncome)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUpward sx={{ fontSize: '1.2rem' }} />
                Click to view details
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 40px rgba(239, 68, 68, 0.25)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                right: -2,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
            onClick={() => goToTransactionHistory('expense')}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1, pb: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                Total Expenses
              </Typography>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, fontSize: '2rem' }}>
                {formatCurrency(totals.totalExpenses)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDownward sx={{ fontSize: '1.2rem' }} />
                Click to view details
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining Balance Card */}
        <Grid item xs={12} sm={12} md={4}>
          <Card
            sx={{
              background: totals.remainingBalance >= 0
                ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(${totals.remainingBalance >= 0 ? '37, 99, 235' : '245, 158, 11'}, 0.15)`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 15px 40px rgba(${totals.remainingBalance >= 0 ? '37, 99, 235' : '245, 158, 11'}, 0.25)`,
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                right: -2,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1, pb: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontWeight: 500 }}>
                Remaining Balance
              </Typography>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, fontSize: '2rem' }}>
                {formatCurrency(totals.remainingBalance)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {totals.remainingBalance >= 0 ? '✓ Good balance' : '⚠ Low balance'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Section */}
      <Card sx={{ mb: 4, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Typography variant="h5" sx={{ color: '#1E293B', fontWeight: 700 }}>
            My Categories
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setShowAddCategoryPopup(true)}
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': { backgroundColor: '#1E40AF' }
            }}
          >
            Add Category
          </Button>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <Grid item xs={6} sm={4} md={3} key={category.id}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: '#EFF6FF',
                        borderColor: '#2563EB',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                      },
                      minHeight: 90,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    <Typography sx={{ fontSize: '2rem' }}>💰</Typography>
                    <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 600, fontSize: '0.95rem' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      ${category.expenseTotal ? category.expenseTotal.toFixed(2) : '0.00'}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
                  No categories yet. Create one to get started!
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mb: 4 }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Typography variant="h5" sx={{ color: '#1E293B', fontWeight: 700 }}>
            Recent Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': { backgroundColor: '#1E40AF' }
            }}
          >
            Add Transaction
          </Button>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ width: '100%' }}>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Date</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Category</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Type</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.slice(0, 8).map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        borderBottom: '1px solid #E2E8F0',
                        '&:hover': {
                          backgroundColor: '#F8FAFC'
                        },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>{transaction.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', color: '#64748B' }}>{transaction.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category}
                          sx={{
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            border: '1px solid #BFDBFE'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{
                        color: transaction.type === 'income' ? '#10B981' : '#EF4444',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          sx={{
                            backgroundColor: transaction.type === 'income' ? '#D1FAE5' : '#FEE2E2',
                            color: transaction.type === 'income' ? '#059669' : '#DC2626',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            border: `1px solid ${transaction.type === 'income' ? '#A7F3D0' : '#FECACA'}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(transaction)}
                            sx={{
                              color: '#2563EB',
                              padding: '4px',
                              '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteTransaction(transaction.id)}
                            sx={{
                              color: '#EF4444',
                              padding: '4px',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748B' }}>
                      No transactions yet. Add your first transaction to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button for mobile devices */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setIsFormOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#2563EB',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            backgroundColor: '#1E40AF',
            boxShadow: '0 15px 40px rgba(37, 99, 235, 0.4)',
          },
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleAddTransaction}
        transaction={editingTransaction}
        categories={categories}
      />

      {/* Add Category Popup */}
      <AddCategoryPopup
        open={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        onAdd={handleAddCategory}
      />
    </Container>
  );
};

export default HomePage;