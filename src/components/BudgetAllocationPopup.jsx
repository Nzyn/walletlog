import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const BudgetAllocationPopup = ({ open, onClose, onSave, category, existingBudgets = {} }) => {
  const [budgetData, setBudgetData] = useState({
    week: existingBudgets.week || '',
    halfMonth: existingBudgets.halfMonth || '',
    month: existingBudgets.month || ''
  });

  const [errors, setErrors] = useState({});

  // Set existing budgets when popup opens
  useEffect(() => {
    if (open && category) {
      setBudgetData({
        week: existingBudgets.week || '',
        halfMonth: existingBudgets.halfMonth || '',
        month: existingBudgets.month || ''
      });
      setErrors({});
    }
  }, [open, category, existingBudgets]);

  const validate = () => {
    const newErrors = {};
    
    // Validate that at least one budget is entered
    if (!budgetData.week && !budgetData.halfMonth && !budgetData.month) {
      newErrors.general = 'Please set at least one budget amount';
      return false;
    }

    // Validate numeric values
    Object.keys(budgetData).forEach(period => {
      const value = budgetData[period];
      if (value && (isNaN(value) || parseFloat(value) <= 0)) {
        newErrors[period] = 'Please enter a valid positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const budgets = {};
      if (budgetData.week) budgets.week = parseFloat(budgetData.week);
      if (budgetData.halfMonth) budgets.halfMonth = parseFloat(budgetData.halfMonth);
      if (budgetData.month) budgets.month = parseFloat(budgetData.month);
      
      onSave(category.id, budgets);
      handleClose();
    }
  };

  const handleClose = () => {
    setBudgetData({
      week: '',
      halfMonth: '',
      month: ''
    });
    setErrors({});
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!category) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <span style={{ fontSize: '1.75rem' }}>{category.icon}</span>
          <span>Set Budget</span>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          {errors.general && (
            <Typography color="error" variant="body2" sx={{ backgroundColor: '#FEE2E2', padding: 1.5, borderRadius: 1.5, color: '#DC2626' }}>
              ⚠ {errors.general}
            </Typography>
          )}

          {/* Weekly Budget */}
          <TextField
            autoFocus
            margin="dense"
            label="Weekly Budget"
            fullWidth
            variant="outlined"
            type="number"
            value={budgetData.week}
            onChange={(e) => setBudgetData(prev => ({ ...prev, week: e.target.value }))}
            onKeyPress={handleKeyPress}
            error={!!errors.week}
            helperText={errors.week || 'Amount allocated per week'}
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

          {/* Half-Monthly Budget */}
          <TextField
            margin="dense"
            label="Half-Monthly Budget"
            fullWidth
            variant="outlined"
            type="number"
            value={budgetData.halfMonth}
            onChange={(e) => setBudgetData(prev => ({ ...prev, halfMonth: e.target.value }))}
            onKeyPress={handleKeyPress}
            error={!!errors.halfMonth}
            helperText={errors.halfMonth || 'Amount allocated per half-month'}
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

          {/* Monthly Budget */}
          <TextField
            margin="dense"
            label="Monthly Budget"
            fullWidth
            variant="outlined"
            type="number"
            value={budgetData.month}
            onChange={(e) => setBudgetData(prev => ({ ...prev, month: e.target.value }))}
            onKeyPress={handleKeyPress}
            error={!!errors.month}
            helperText={errors.month || 'Amount allocated per month'}
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

          {/* Current Allocations Display */}
          {(existingBudgets.week || existingBudgets.halfMonth || existingBudgets.month) && (
            <Box
              sx={{
                backgroundColor: '#F8FAFC',
                borderRadius: 2,
                padding: 2.5,
                border: '1px solid #E2E8F0',
                mt: 1
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 1.5 }}>
                Current Allocations
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {existingBudgets.week && (
                  <Chip
                    label={`Weekly: $${existingBudgets.week}`}
                    sx={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 600 }}
                  />
                )}
                {existingBudgets.halfMonth && (
                  <Chip
                    label={`Half-Month: $${existingBudgets.halfMonth}`}
                    sx={{ backgroundColor: '#FED7AA', color: '#B45309', fontWeight: 600 }}
                  />
                )}
                {existingBudgets.month && (
                  <Chip
                    label={`Monthly: $${existingBudgets.month}`}
                    sx={{ backgroundColor: '#D1FAE5', color: '#059669', fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
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
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#2563EB',
            '&:hover': {
              backgroundColor: '#1E40AF'
            }
          }}
        >
          Save Budgets
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetAllocationPopup;