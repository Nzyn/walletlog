import React, { useState } from 'react';
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
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AddCategoryPopup = ({ open, onClose, onSave }) => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    icon: '💰'
  });

  const [errors, setErrors] = useState({});

  // Predefined icons for categories
  const iconOptions = [
    '💰', '🛒', '🍽️', '🏠', '🚗', '🏥', '🎓', '🎮', '🎬', '🎵',
    '📚', '👗', '✈️', '🏋️', '🐶', '🌳', '🎨', '💼', '📱', '☕'
  ];

  const validate = () => {
    const newErrors = {};
    if (!categoryData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    if (categoryData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        name: categoryData.name.trim(),
        description: categoryData.description.trim(),
        icon: categoryData.icon
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCategoryData({
      name: '',
      description: '',
      icon: '💰'
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
        Add New Category
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
          {/* Category Name */}
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={categoryData.name}
            onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
            onKeyPress={handleKeyPress}
            error={!!errors.name}
            helperText={errors.name}
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

          {/* Description */}
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={categoryData.description}
            onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
            onKeyPress={handleKeyPress}
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

          {/* Icon Selection */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="icon-select-label" sx={{ backgroundColor: '#FFFFFF', px: 0.5 }}>Choose Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              value={categoryData.icon}
              onChange={(e) => setCategoryData(prev => ({ ...prev, icon: e.target.value }))}
              label="Choose Icon"
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
              {iconOptions.map((icon, index) => (
                <MenuItem key={index} value={icon}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                    <Typography variant="body2">{icon}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Preview */}
          <Box
            sx={{
              backgroundColor: '#F8FAFC',
              borderRadius: 2,
              padding: 2.5,
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, fontSize: '0.75rem' }}>
              Preview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 1.5 }}>
              <span style={{ fontSize: '2.5rem' }}>{categoryData.icon}</span>
              <div>
                <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 700 }}>
                  {categoryData.name || 'Category Name'}
                </Typography>
                {categoryData.description && (
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontStyle: 'italic' }}>
                    "{categoryData.description}"
                  </Typography>
                )}
              </div>
            </Box>
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
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryPopup;