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
    <Container maxWidth={false} disableGutters sx={{ paddingLeft: { xs: 1, sm: 2 }, paddingRight: { xs: 1, sm: 2 } }}>
      {/* User greeting section */}
      <Box mb={3} pt={2}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold' }}>
          Hello, User
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#7E6BC7', fontWeight: 'normal' }}>
          Good Day!
        </Typography>
      </Box>

      {/* Period and Financial Summary Container */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          backgroundColor: '#F5F3FF', 
          borderRadius: 2,
          mb: 3,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
            {selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#7E6BC7', mt: { xs: 1, sm: 0 } }}>
            {getCurrentDateFormatted()}
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
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
                height: '100%'
              }}
              onClick={() => goToTransactionHistory('income')}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Income
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    goToTransactionHistory('income');
                  }}>
                    <ArrowUpward sx={{ color: '#4CAF50', fontSize: 30 }} />
                  </Link>
                </Box>
                <Typography variant="h4" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
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
                height: '100%'
              }}
              onClick={() => goToTransactionHistory('expense')}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Expenses
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    goToTransactionHistory('expense');
                  }}>
                    <ArrowDownward sx={{ color: '#F44336', fontSize: 30 }} />
                  </Link>
                </Box>
                <Typography variant="h4" component="h2" sx={{ color: '#4B0082', fontWeight: 'bold' }}>
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
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Remaining
                  </Typography>
                  <Link href="#" underline="none" onClick={(e) => {
                    e.preventDefault();
                    // Show all transactions when clicking on remaining balance
                    goToTransactionHistory('all');
                  }}>
                    {totals.remainingBalance >= 0 ? 
                      <ArrowUpward sx={{ color: '#4B0082', fontSize: 30 }} /> : 
                      <ArrowDownward sx={{ color: '#D32F2F', fontSize: 30 }} />
                    }
                  </Link>
                </Box>
                <Typography variant="h4" component="h2" sx={{ 
                  color: '#4B0082', 
                  fontWeight: 'bold',
                  color: totals.remainingBalance >= 0 ? '#4B0082' : '#D32F2F'
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
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2 }}
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
          <Grid container spacing={1} sx={{ py: 1 }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card sx={{ 
                  backgroundColor: '#FFFFFF', 
                  textAlign: 'center', 
                  padding: 1.5,
                  borderRadius: 2,
                  border: '1px solid #B19CD9',
                  '&:hover': { backgroundColor: '#F8F5FF' }
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>💰</div>
                  <Typography variant="body2" sx={{ color: '#4B0082', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7E6BC7' }}>
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
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2 }}
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
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#F5F3FF', borderRadius: 2, width: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4B0082', fontWeight: 'bold' }}>
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
                  alignSelf: 'flex-start',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Add Transaction
              </Button>
            </Box>
            
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
                  {filteredTransactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.category} 
                          sx={{ 
                            backgroundColor: '#EDE9FE', 
                            color: '#4B0082',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
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
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#7E6BC7' }}
                          onClick={() => handleEditClick(transaction)}
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
        </AccordionDetails>
      </Accordion>

      {/* Notes Section */}
      <Accordion 
        sx={{ mb: 3, backgroundColor: '#F5F3FF', borderRadius: 2 }}
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
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 2, width: '100%' }}>
            <TextField
              multiline
              rows={4}
              placeholder="Write your notes here..."
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F8F5FF',
                }
              }}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#B19CD9', 
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#9A7EB8' },
                  fontWeight: 'bold'
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