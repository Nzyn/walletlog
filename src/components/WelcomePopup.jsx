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
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const WelcomePopup = ({ open, onClose, onSave }) => {
  const [income, setIncome] = useState('');
  const [period, setPeriod] = useState('week');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!income || isNaN(income) || parseFloat(income) <= 0) {
      newErrors.income = 'Please enter a valid income amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ income: parseFloat(income), period });
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE9FE 100%)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          color: '#4B0082', 
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Welcome to WalletLog
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#4B0082' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Your Income Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyPress={handleKeyPress}
            error={!!errors.income}
            helperText={errors.income}
            InputProps={{
              sx: { 
                backgroundColor: '#FFFFFF',
                borderRadius: 1
              }
            }}
            InputLabelProps={{
              sx: { color: '#7E6BC7' }
            }}
          />
          
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="period-select-label" sx={{ color: '#7E6BC7' }}>Select Period</InputLabel>
            <Select
              labelId="period-select-label"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Select Period"
              sx={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: 1
              }}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="half-month">This Half-Month</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 1 }}>
            <p style={{ color: '#4B0082', fontSize: '0.9rem' }}>
              Enter your income to get started with tracking your finances. 
              We'll use this to calculate your weekly, half-monthly, or monthly budget.
            </p>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#4B0082',
            fontWeight: 'bold'
          }}
        >
          Skip for now
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#B19CD9', 
            color: '#FFFFFF',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#9A7EB8' }
          }}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomePopup;