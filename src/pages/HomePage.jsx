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
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowUpward, ArrowDownward, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useBudget } from '../contexts/BudgetContext';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency, filterTransactionsByPeriod } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { transactions, categories, addTransaction, deleteTransaction, updateTransaction, calculateTotals } = useBudget();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week or month
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);
  
  const filteredTransactions = filterTransactionsByPeriod(transactions, selectedPeriod);
  const navigate = useNavigate();
  
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
    <Container maxWidth={false} disableGutters sx={{ 
      paddingLeft: { xs: 0, sm: 2 }, 
      paddingRight: { xs: 0, sm: 2 },
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* User greeting section */}
      <Box mb={3} pt={2} sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Hello, User
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#7E6BC7', fontWeight: 'normal', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Good Day!
        </Typography>
      </Box>

      {/* Period and Financial Summary Container */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 1, sm: 2 }, 
          backgroundColor: '#F5F3FF', 
          borderRadius: 2,
          mb: 3,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 0 }}>
          <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} width="100%">
            <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold', textAlign: { xs: 'center', sm: 'left' } }}>
              {selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}
            </Typography>
            <FormControl size="small" sx={{ 
              minWidth: { xs: '100%', sm: 150 }, 
              backgroundColor: 'white', 
              borderRadius: 1, 
              mt: { xs: 1, sm: 0 },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                sx={{ fontWeight: 'bold' }}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="half-month">This Half-Month</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Typography variant="body1" sx={{ color: '#7E6BC7', textAlign: { xs: 'center', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
            {getCurrentDateFormatted()}
          </Typography>
        </Box>
        
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={4}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
                boxShadow: 3, 
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                minHeight: { xs: 100, sm: 120 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1
              }}
              onClick={() => goToTransactionHistory('income')}
            >
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <Typography variant="h6" color="textSecondary" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Income
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    goToTransactionHistory('income');
                  }} sx={{ ml: 0.5 }}>
                    <ArrowUpward sx={{ color: '#4CAF50', fontSize: 18 }} />
                  </Link>
                </Box>
                <Typography variant="h5" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(totals.totalIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)', 
                boxShadow: 3, 
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                minHeight: { xs: 100, sm: 120 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1
              }}
              onClick={() => goToTransactionHistory('expense')}
            >
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <Typography variant="h6" color="textSecondary" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Expenses
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    goToTransactionHistory('expense');
                  }} sx={{ ml: 0.5 }}>
                    <ArrowDownward sx={{ color: '#F44336', fontSize: 18 }} />
                  </Link>
                </Box>
                <Typography variant="h5" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(totals.totalExpenses)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card 
              sx={{ 
                background: totals.remainingBalance >= 0 
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)' 
                  : 'linear-gradient(135deg, #FFFFFF 0%, #FFE4E6 100%)', 
                boxShadow: 3, 
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                minHeight: { xs: 100, sm: 120 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1
              }}
            >
              <CardContent sx={{ textAlign: 'center', width: '100%', py: 1, px: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <Typography variant="h6" color="textSecondary" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Remaining
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    // Show all transactions when clicking on remaining balance
                    goToTransactionHistory('all');
                  }} sx={{ ml: 0.5 }}>
                    {totals.remainingBalance >= 0 ? 
                      <ArrowUpward sx={{ color: '#4B0082', fontSize: 18 }} /> : 
                      <ArrowDownward sx={{ color: '#D32F2F', fontSize: 18 }} />
                    }
                  </Link>
                </Box>
                <Typography variant="h5" component="h2" sx={{ 
                  color: '#4B0082', 
                  fontWeight: 'bold',
                  color: totals.remainingBalance >= 0 ? '#4B0082' : '#D32F2F',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  {formatCurrency(totals.remainingBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Section */}
      <Accordion 
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}
        expanded={categoriesExpanded}
        onChange={() => setCategoriesExpanded(!categoriesExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: '#EDE9FE',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#D8CCE8' }
          }}
        >
          <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
            My Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} sx={{ py: 1, width: '100%', boxSizing: 'border-box' }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card sx={{ 
                  backgroundColor: '#FFFFFF', 
                  textAlign: 'center', 
                  padding: 1,
                  borderRadius: 2,
                  border: '1px solid #B19CD9',
                  '&:hover': { backgroundColor: '#F8F5FF' },
                  minHeight: 70,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>💰</div>
                  <Typography variant="body2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7E6BC7', fontSize: '0.6rem' }}>
                    ${category.expenseTotal ? category.expenseTotal.toFixed(2) : '0.00'}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Transactions Section */}
      <Accordion 
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}
        expanded={transactionsExpanded}
        onChange={() => setTransactionsExpanded(!transactionsExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: '#EDE9FE',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#D8CCE8' }
          }}
        >
          <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
            My Transactions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={2} sx={{ p: 1, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Recent Transactions
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsFormOpen(true)}
                sx={{ 
                  backgroundColor: '#B19CD9', 
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#9A7EB8' },
                  fontWeight: 'bold',
                  alignSelf: { xs: 'stretch', sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  py: 1
                }}
              >
                Add Transaction
              </Button>
            </Box>
            
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
                  {filteredTransactions.slice(0, 5).map((transaction) => (
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
                            onClick={() => handleEditClick(transaction)}
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
        </AccordionDetails>
      </Accordion>

      {/* Notes Section */}
      <Accordion 
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}
        expanded={notesExpanded}
        onChange={() => setNotesExpanded(!notesExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: '#EDE9FE',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#D8CCE8' }
          }}
        >
          <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
            Notes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={2} sx={{ p: 1, backgroundColor: '#FFFFFF', borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
            <TextField
              multiline
              rows={4}
              placeholder="Write your notes here..."
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F8F5FF',
                  py: 0.5,
                  px: 0.5
                }
              }}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#B19CD9', 
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#9A7EB8' },
                  fontWeight: 'bold',
                  py: 0.5
                }}
              >
                Save Note
              </Button>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      {/* Floating Action Button for mobile devices */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => setIsFormOpen(true)}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          backgroundColor: '#B19CD9',
          '&:hover': { backgroundColor: '#9A7EB8' }
        }}
        style={{ display: { xs: 'block', sm: 'none' } }}
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
    </Container>
  );
};

export default HomePage;