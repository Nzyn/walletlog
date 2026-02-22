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
    category_id: transaction?.category_id || categories[0]?.id || null,
    type: transaction?.type || 'expense',
    recipient: transaction?.recipient || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If category name changes, find and set the category_id as well
    if (name === 'category') {
      const selectedCat = categories.find(cat => cat.name === value);
      setFormData(prev => ({
        ...prev,
        category: value,
        category_id: selectedCat ? selectedCat.id : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      category_id: categories[0]?.id || null,
      type: 'expense',
      recipient: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {isEditing ? <EditIcon sx={{ color: '#2563EB' }} /> : <AddIcon sx={{ color: '#2563EB' }} />}
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
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
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: '#F8FAFC',
                    '&:hover fieldset': {
                      borderColor: '#2563EB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB'
                    }
                  }
                }}
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
                size="medium"
                inputProps={{ step: '0.01', min: '0' }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: '#F8FAFC',
                    '&:hover fieldset': {
                      borderColor: '#2563EB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ backgroundColor: '#FFFFFF', px: 0.5 }}>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
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
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ backgroundColor: '#FFFFFF', px: 0.5 }}>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
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
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient (For Whom)"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="e.g. dan"
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: '#F8FAFC',
                    '&:hover fieldset': {
                      borderColor: '#2563EB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          padding: '16px 24px',
          gap: 2
        }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#64748B',
              '&:hover': {
                backgroundColor: '#E2E8F0'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': {
                backgroundColor: '#1E40AF'
              }
            }}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm;