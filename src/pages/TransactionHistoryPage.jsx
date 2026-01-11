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
    <Container maxWidth="lg">
      <Box mb={4}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={Link} underline="hover" color="inherit" to="/home">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </MuiLink>
          <Typography color="text.primary">Transaction History</Typography>
        </Breadcrumbs>
        
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold' }}>
            Transaction History
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={Link}
            to="/home"
            sx={{ 
              borderColor: '#B19CD9', 
              color: '#4B0082',
              '&:hover': { 
                backgroundColor: '#F3E8FF',
                borderColor: '#9A7EB8'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
              boxShadow: 3, 
              borderRadius: 3 
            }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h4" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
                  {formatCurrency(filteredTotals.totalIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
              boxShadow: 3, 
              borderRadius: 3 
            }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
                  {formatCurrency(filteredTotals.totalExpenses)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: filteredTotals.remainingBalance >= 0 
                ? 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)' 
                : 'linear-gradient(135deg, #FFFFFF 0%, #FFE4E6 100%)', 
              boxShadow: 3, 
              borderRadius: 3 
            }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Remaining Balance
                </Typography>
                <Typography variant="h4" component="h2" sx={{ 
                  color: filteredTotals.remainingBalance >= 0 ? '#4B0082' : '#D32F2F',
                  fontWeight: 'bold'
                }}>
                  {formatCurrency(filteredTotals.remainingBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Type"
                  onChange={(e) => setTransactionType(e.target.value)}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="income">Income Only</MenuItem>
                  <MenuItem value="expense">Expenses Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="Period"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
                Showing {filteredTransactions.length} transactions
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Transactions Table */}
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#F5F3FF', borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#EDE9FE' }}>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: '#4B0082', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.category} 
                        sx={{ 
                          backgroundColor: '#EDE9FE', 
                          color: '#4B0082',
                          fontWeight: 'bold'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      color: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold'
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type} 
                        sx={{ 
                          backgroundColor: transaction.type === 'income' ? '#E8F5E9' : '#FFEBEE',
                          color: transaction.type === 'income' ? '#2E7D32' : '#C62828',
                          fontWeight: 'bold'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#7E6BC7' }}
                        onClick={() => console.log('Edit transaction:', transaction)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#D32F2F' }}
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
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