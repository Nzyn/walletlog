import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Button, Box, IconButton, Typography, Divider, useMediaQuery } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Menu as MenuIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Home as HomeIcon, Receipt as ReceiptIcon, Notes as NotesIcon } from '@mui/icons-material';
import { useBudget } from '../contexts/BudgetContext';
import AddCategoryPopup from './AddCategoryPopup';

const drawerWidth = 280;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { categories, addCategory } = useBudget();
  const [showAddCategoryPopup, setShowAddCategoryPopup] = React.useState(false);
  
  // Check if screen is small (mobile)
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAddCategory = (categoryData) => {
    addCategory(categoryData);
  };

  return (
    <>
      {/* For mobile, use temporary drawer that overlays content */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isOpen : true} // Always open on desktop, controlled by state on mobile
        onClose={toggleSidebar}
        sx={{
          width: isMobile ? (isOpen ? drawerWidth : 0) : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: isMobile ? drawerWidth : drawerWidth, 
            boxSizing: 'border-box', 
            backgroundColor: '#F5F3FF', 
            borderRight: '1px solid #B19CD9',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            ...(isMobile && {
              position: 'relative' // Make it overlay on mobile
            })
          },
          ...(isMobile && {
            '& .MuiModal-root': {
              zIndex: 1100 // Ensure it appears above other content on mobile
            }
          })
        }}
      >
        <Box sx={{ overflow: 'auto', padding: 2, width: drawerWidth }}>
          <Typography variant="h6" sx={{ color: '#4B0082', fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
            WalletLog
          </Typography>
          
          {/* Close button for mobile */}
          {isMobile && (
            <IconButton
              onClick={toggleSidebar}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1300,
                backgroundColor: '#B19CD9',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#9A7EB8' }
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ borderRadius: 2, marginY: 0.5, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#EDE9FE' } }}
                component="a"
                href="/home"
                onClick={isMobile ? toggleSidebar : undefined} // Close sidebar on mobile when navigating
              >
                <HomeIcon sx={{ color: '#4B0082', mr: 1 }} />
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ 
                    sx: { color: '#4B0082', fontWeight: 500 } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ borderRadius: 2, marginY: 0.5, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#EDE9FE' } }}
                component="a"
                href="/transactions"
                onClick={isMobile ? toggleSidebar : undefined} // Close sidebar on mobile when navigating
              >
                <ReceiptIcon sx={{ color: '#4B0082', mr: 1 }} />
                <ListItemText 
                  primary="Transactions" 
                  primaryTypographyProps={{ 
                    sx: { color: '#4B0082', fontWeight: 500 } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ borderRadius: 2, marginY: 0.5, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#EDE9FE' } }}
                component="a"
                href="#"
                onClick={isMobile ? toggleSidebar : undefined} // Close sidebar on mobile when navigating
              >
                <NotesIcon sx={{ color: '#4B0082', mr: 1 }} />
                <ListItemText 
                  primary="Notes" 
                  primaryTypographyProps={{ 
                    sx: { color: '#4B0082', fontWeight: 500 } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            <Divider sx={{ my: 2 }} />
            
            {categories.map((category) => (
              <ListItem key={category.id} disablePadding>
                <ListItemButton sx={{ borderRadius: 2, marginY: 0.5, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#EDE9FE' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{category.icon || '💰'}</span>
                    <ListItemText 
                      primary={category.name} 
                      secondary={category.description}
                      primaryTypographyProps={{ 
                        sx: { color: '#4B0082', fontWeight: 500 } 
                      }}
                      secondaryTypographyProps={{
                        sx: { color: '#7E6BC7', fontSize: '0.75rem' }
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
            
            <ListItem disablePadding>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowAddCategoryPopup(true)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#4B0082',
                  fontWeight: 500,
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#EDE9FE',
                  }
                }}
              >
                Add Category
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Add Category Popup */}
      <AddCategoryPopup 
        open={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        onSave={handleAddCategory}
      />
    </>
  );
};

export default Sidebar;