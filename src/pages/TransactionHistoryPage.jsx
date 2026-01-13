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
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <MuiLink component={Link} underline="hover" color="inherit" to="/home">
            <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            Home
          </MuiLink>
          <Typography color="text.primary" fontSize="0.875rem">Transaction History</Typography>
        </Breadcrumbs>
        
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
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
              },
              width: { xs: '100%', sm: 'auto' },
              py: 1
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
              boxShadow: 3, 
              borderRadius: 3,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Total Income
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(filteredTotals.totalIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
              boxShadow: 3, 
              borderRadius: 3,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Total Expenses
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
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
              borderRadius: 3,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Remaining Balance
                </Typography>
                <Typography variant="h5" component="h2" sx={{ 
                  color: filteredTotals.remainingBalance >= 0 ? '#4B0082' : '#D32F2F',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  {formatCurrency(filteredTotals.remainingBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 1, mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
          <Grid container spacing={1} alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" sx={{ backgroundColor: 'white', borderRadius: 1, mb: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Type"
                  onChange={(e) => setTransactionType(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="income">Income Only</MenuItem>
                  <MenuItem value="expense">Expenses Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" sx={{ backgroundColor: 'white', borderRadius: 1, mb: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="Period"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ color: '#4B0082', fontWeight: 'bold', textAlign: { xs: 'center', sm: 'left' }, fontSize: '0.875rem' }}>
                Showing {filteredTransactions.length} transactions
              </Typography>
            </Grid>
          </Grid>
        </Paper>

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