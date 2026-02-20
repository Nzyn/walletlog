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
  IconButton,
  Typography
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
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1E293B',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Welcome to WalletLog
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#64748B',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography sx={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Let's get started! Enter your income to set up your budget tracking.
          </Typography>

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

          <FormControl fullWidth variant="outlined">
            <InputLabel id="period-select-label" sx={{ backgroundColor: '#FFFFFF', px: 0.5 }}>Select Period</InputLabel>
            <Select
              labelId="period-select-label"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Select Period"
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
              <MenuItem value="half-month">This Half-Month</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              backgroundColor: '#EFF6FF',
              borderRadius: 2,
              border: '1px solid #BFDBFE',
              padding: 2,
              mt: 1
            }}
          >
            <Typography variant="body2" sx={{ color: '#1E40AF', fontSize: '0.9rem', lineHeight: 1.6 }}>
              💡 We'll use this information to calculate your budget limits for the selected period. You can always update this later!
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        padding: '16px 24px',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#64748B',
            '&:hover': {
              backgroundColor: '#E2E8F0'
            }
          }}
        >
          Skip for now
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#2563EB',
            '&:hover': {
              backgroundColor: '#1E40AF'
            }
          }}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomePopup;