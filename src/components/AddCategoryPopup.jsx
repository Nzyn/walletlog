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
        Add New Category
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: '#4B0082' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
          
          {/* Icon Selection */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="icon-select-label" sx={{ color: '#7E6BC7' }}>Choose Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              value={categoryData.icon}
              onChange={(e) => setCategoryData(prev => ({ ...prev, icon: e.target.value }))}
              label="Choose Icon"
              sx={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: 1
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
          <Box sx={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 2, 
            padding: 2, 
            border: '1px solid #B19CD9',
            textAlign: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ color: '#4B0082', fontWeight: 'bold', mb: 1 }}>
              Preview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <span style={{ fontSize: '2rem' }}>{categoryData.icon}</span>
              <Typography variant="h6" sx={{ color: '#4B0082' }}>
                {categoryData.name || 'Category Name'}
              </Typography>
            </Box>
            {categoryData.description && (
              <Typography variant="body2" sx={{ color: '#7E6BC7', mt: 1, fontStyle: 'italic' }}>
                "{categoryData.description}"
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: '#4B0082',
            fontWeight: 'bold'
          }}
        >
          Cancel
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
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryPopup;