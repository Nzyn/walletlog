import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
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
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Home as HomeIcon, ArrowBack, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useBudget } from '../contexts/BudgetContext';
import { formatCurrency, filterTransactionsByPeriod } from '../utils/helpers';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TransactionHistoryPage = () => {
  const { transactions, categories, deleteTransaction, updateTransaction, calculateTotals } = useBudget();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get initial state from navigation
  const initialState = location.state || {};
  
  const [selectedPeriod, setSelectedPeriod] = useState(initialState.selectedPeriod || 'week');
  const [transactionType, setTransactionType] = useState(initialState.transactionType || 'all'); // 'all', 'income', 'expense'
  
  // Update state if location state changes
  useEffect(() => {
    if (initialState.selectedPeriod) {
      setSelectedPeriod(initialState.selectedPeriod);
    }
    if (initialState.transactionType) {
      setTransactionType(initialState.transactionType);
    }
  }, [initialState]);

  // Filter transactions based on type and period
  const filteredTransactions = filterTransactionsByPeriod(
    transactionType === 'all' 
      ? transactions 
      : transactions.filter(t => t.type === transactionType), 
    selectedPeriod
  );

  const totals = calculateTotals();
  
  // Calculate totals for the filtered transactions
  const filteredTotals = {
    totalIncome: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    remainingBalance: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) - 
      filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      paddingLeft: { xs: 0, sm: 2 }, 
      paddingRight: { xs: 0, sm: 2 },
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Box mb={4} sx={{ width: '100%' }}>
        {/* Breadcrumbs */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/home')}
              sx={{
                color: '#2563EB',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.08)' }
              }}
            >
              Back
            </Button>
            <Typography variant="h3" sx={{ color: '#1E293B', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Transaction History
            </Typography>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)',
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
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, pb: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                  Total Income
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
                  {formatCurrency(filteredTotals.totalIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)',
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
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, pb: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                  Total Expenses
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
                  {formatCurrency(filteredTotals.totalExpenses)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              background: filteredTotals.remainingBalance >= 0
                ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(${filteredTotals.remainingBalance >= 0 ? '37, 99, 235' : '245, 158, 11'}, 0.15)`,
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
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, pb: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                  Remaining Balance
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
                  {formatCurrency(filteredTotals.remainingBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 4, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Box sx={{ padding: '20px', display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={transactionType}
                label="Type"
                onChange={(e) => setTransactionType(e.target.value)}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: '#F8FAFC',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB'
                  }
                }}
              >
                <MenuItem value="all">All Transactions</MenuItem>
                <MenuItem value="income">Income Only</MenuItem>
                <MenuItem value="expense">Expenses Only</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: '#F8FAFC',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB'
                  }
                }}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Card>

        {/* Transactions Table */}
        <Paper elevation={2} sx={{ p: 1, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
          <TableContainer sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Table sx={{ minWidth: 280 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#EDE9FE' }}>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Name</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Date</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Category</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Amount</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Type</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>{transaction.name}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>{transaction.date}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>
                      <Chip 
                        label={transaction.category} 
                        sx={{ 
                          backgroundColor: '#EDE9FE', 
                          color: '#4B0082',
                          fontWeight: 'bold',
                          fontSize: '0.6rem',
                          height: '20px',
                          '& .MuiChip-label': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pl: 0.5,
                            pr: 0.5
                          }
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      color: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      px: { xs: 0.5, sm: 1 },
                      py: { xs: 0.5, sm: 1 }
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>
                      <Chip 
                        label={transaction.type} 
                        sx={{ 
                          backgroundColor: transaction.type === 'income' ? '#E8F5E9' : '#FFEBEE',
                          color: transaction.type === 'income' ? '#2E7D32' : '#C62828',
                          fontWeight: 'bold',
                          fontSize: '0.6rem',
                          height: '20px',
                          '& .MuiChip-label': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pl: 0.5,
                            pr: 0.5
                          }
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>
                      <Box display="flex" justifyContent="space-around">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#7E6BC7', padding: '4px', minWidth: '32px' }}
                          onClick={() => console.log('Edit transaction:', transaction)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#D32F2F', padding: '4px', minWidth: '32px' }}
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default TransactionHistoryPage;