import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Button, Box, IconButton, Typography, Divider, useMediaQuery, Chip } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Home as HomeIcon, Receipt as ReceiptIcon, AccountBalanceWallet as BudgetIcon } from '@mui/icons-material';
import { useBudget } from '../contexts/BudgetContext';
import AddCategoryPopup from './AddCategoryPopup';
import BudgetAllocationPopup from './BudgetAllocationPopup';

const drawerWidth = 280;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { categories, addCategory, setCategoryBudget, getCategoryBudgets } = useBudget();
  const [showAddCategoryPopup, setShowAddCategoryPopup] = React.useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAddCategory = (categoryData) => {
    addCategory(categoryData);
  };

  const handleSetBudget = (categoryId, budgets) => {
    setCategoryBudget(categoryId, budgets);
  };

  const openBudgetPopup = (category) => {
    setSelectedCategory(category);
    setShowBudgetPopup(true);
  };

  const closeBudgetPopup = () => {
    setSelectedCategory(null);
    setShowBudgetPopup(false);
  };

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isOpen : true}
        onClose={toggleSidebar}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '1px 0 3px rgba(0, 0, 0, 0.08)',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', padding: 2.5, width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Close button for mobile */}
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  color: '#2563EB',
                  '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          {/* Brand/Logo */}
          <Box
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 3,
              textAlign: 'center',
            }}
          >
            WalletLog
          </Box>

          {/* Navigation Links */}
          <List sx={{ mb: 2, flexShrink: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  marginBottom: 1,
                  backgroundColor: '#F8FAFC',
                  color: '#2563EB',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                  },
                  transition: 'all 0.2s'
                }}
                component="a"
                href="/home"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <HomeIcon sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{
                    sx: { fontWeight: 600, fontSize: '0.95rem' }
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  marginBottom: 1,
                  backgroundColor: '#F8FAFC',
                  color: '#2563EB',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                  },
                  transition: 'all 0.2s'
                }}
                component="a"
                href="/transactions"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <ReceiptIcon sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                <ListItemText
                  primary="Transactions"
                  primaryTypographyProps={{
                    sx: { fontWeight: 600, fontSize: '0.95rem' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ backgroundColor: '#E2E8F0', my: 2 }} />

          {/* Categories Section */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                display: 'block',
                mb: 1.5,
                px: 1
              }}
            >
              Categories
            </Typography>

            <List sx={{ p: 0 }}>
              {categories.map((category) => {
                const budgets = getCategoryBudgets(category.id);
                const hasBudgets = Object.keys(budgets).length > 0;

                return (
                  <ListItem key={category.id} disablePadding sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        width: '100%',
                        borderRadius: 2,
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#EFF6FF',
                          borderColor: '#BFDBFE'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: hasBudgets ? 1 : 0, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#1E293B'
                              }}
                            >
                              {category.name}
                            </Typography>
                            {category.description && (
                              <Typography
                                sx={{
                                  fontSize: '0.75rem',
                                  color: '#64748B',
                                  mt: 0.25
                                }}
                              >
                                {category.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBudgetPopup(category);
                          }}
                          sx={{
                            color: '#2563EB',
                            '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                          }}
                        >
                          <BudgetIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Budget Chips */}
                      {hasBudgets && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {budgets.week && (
                            <Chip
                              label={`W: $${budgets.week}`}
                              size="small"
                              sx={{
                                backgroundColor: '#D1FAE5',
                                color: '#059669',
                                fontSize: '0.7rem',
                                height: '20px',
                                fontWeight: 600
                              }}
                            />
                          )}
                          {budgets.halfMonth && (
                            <Chip
                              label={`½M: $${budgets.halfMonth}`}
                              size="small"
                              sx={{
                                backgroundColor: '#FED7AA',
                                color: '#B45309',
                                fontSize: '0.7rem',
                                height: '20px',
                                fontWeight: 600
                              }}
                            />
                          )}
                          {budgets.month && (
                            <Chip
                              label={`M: $${budgets.month}`}
                              size="small"
                              sx={{
                                backgroundColor: '#BFDBFE',
                                color: '#1E40AF',
                                fontSize: '0.7rem',
                                height: '20px',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Divider sx={{ backgroundColor: '#E2E8F0', my: 2 }} />

          {/* Add Category Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddCategoryPopup(true)}
            sx={{
              justifyContent: 'flex-start',
              color: '#FFFFFF',
              backgroundColor: '#2563EB',
              fontWeight: 600,
              width: '100%',
              borderRadius: 2,
              py: 1,
              '&:hover': {
                backgroundColor: '#1E40AF',
              },
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
          >
            Add Category
          </Button>
        </Box>
      </Drawer>

      {/* Add Category Popup */}
      <AddCategoryPopup
        open={showAddCategoryPopup}
        onClose={() => setShowAddCategoryPopup(false)}
        onSave={handleAddCategory}
      />

      {/* Budget Allocation Popup */}
      {selectedCategory && (
        <BudgetAllocationPopup
          open={showBudgetPopup}
          onClose={closeBudgetPopup}
          onSave={handleSetBudget}
          category={selectedCategory}
          existingBudgets={getCategoryBudgets(selectedCategory.id)}
        />
      )}
    </>
  );
};

export default Sidebar;