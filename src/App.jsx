import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, IconButton } from '@mui/material';
import HomePage from './pages/HomePage';
import Sidebar from './components/Sidebar';
import { BudgetProvider } from './contexts/BudgetContext';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import WelcomePopup from './components/WelcomePopup';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

// Create a state context to share the sidebar collapse state
const SidebarContext = React.createContext();

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Changed to isSidebarOpen for mobile
  const [showWelcomePopup, setShowWelcomePopup] = React.useState(false);
  const location = useLocation(); // To detect route changes and close sidebar on mobile
  
  // Check if it's the first time visiting the app or if user hasn't entered income yet
  React.useEffect(() => {
    try {
      // Check if user has already entered their income before
      const userIncome = localStorage.getItem('userIncome');
      const hasVisited = localStorage.getItem('hasVisited');
      
      // Show popup if user hasn't entered income and hasn't visited before
      if (!userIncome && !hasVisited) {
        // Small delay to ensure UI is rendered first
        setTimeout(() => {
          setShowWelcomePopup(true);
        }, 500);
      }
      
      // Mark as visited (but not necessarily as having entered income)
      if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true');
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      // Fallback: try to show popup if there are no storage issues
      try {
        const userIncome = localStorage.getItem('userIncome');
        if (!userIncome) {
          setTimeout(() => {
            setShowWelcomePopup(true);
          }, 500);
        }
      } catch (err) {
        console.error('Severe localStorage error:', err);
      }
    }
  }, []);

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to get page title based on current route
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
      case '/home':
        return 'Dashboard';
      case '/transactions':
        return 'Transaction History';
      default:
        return 'WalletLog';
    }
  };

  const handleSaveIncome = (data) => {
    try {
      // Store the income in localStorage or context for later use
      localStorage.setItem('userIncome', JSON.stringify(data));
      // Optionally, dispatch to context to update global state
      console.log('Income saved:', data);
    } catch (e) {
      console.error('Error saving income to localStorage:', e);
    }
  };

  const handleClosePopup = () => {
    setShowWelcomePopup(false);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            height: 64,
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: '#2563EB',
              marginRight: '16px',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              WalletLog
            </Box>
            <Box
              sx={{
                height: 24,
                width: 1,
                backgroundColor: '#E2E8F0',
              }}
            />
            <Box
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#1E293B',
              }}
            >
              {getPageTitle()}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '8px 16px',
              backgroundColor: '#F1F5F9',
              borderRadius: 8,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              U
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', marginTop: 8, flexGrow: 1 }}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              padding: { xs: '16px', sm: '24px', md: '32px' },
              backgroundColor: '#F8FAFC',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginLeft: 0,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionHistoryPage />} />
            </Routes>
          </Box>
        </Box>

        <WelcomePopup
          open={showWelcomePopup}
          onClose={handleClosePopup}
          onSave={handleSaveIncome}
        />
      </Box>
    </SidebarContext.Provider>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Modern Blue
      light: '#DBEAFE',
      dark: '#1E40AF',
    },
    secondary: {
      main: '#7C3AED', // Purple Accent
      light: '#F3E8FF',
    },
    success: {
      main: '#10B981', // Green for income
    },
    error: {
      main: '#EF4444', // Red for expenses
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark slate
      secondary: '#64748B', // Slate
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          },
        },
        contained: {
          backgroundColor: '#2563EB',
          '&:hover': {
            backgroundColor: '#1E40AF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

function App() {
  return (
    <BudgetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </BudgetProvider>
  );
}

export default App;