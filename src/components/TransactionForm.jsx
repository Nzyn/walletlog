import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

const TransactionForm = ({ open, onClose, onSubmit, transaction = null, categories }) => {
  const isEditing = !!transaction;
  
  const [formData, setFormData] = useState({
    name: transaction?.name || '',
    amount: transaction?.amount || '',
    category: transaction?.category || categories[0]?.name || 'Food',
    type: transaction?.type || 'expense'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      amount: '',
      category: categories[0]?.name || 'Food',
      type: 'expense'
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#4B0082', fontWeight: 'bold' }}>
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#4B0082' }}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
            sx={{ 
              backgroundColor: '#B19CD9', 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#9A7EB8' },
              fontWeight: 'bold'
            }}
          >
            {isEditing ? 'Update' : 'Add'} Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm;