import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import Sidebar from './components/Sidebar';
import { BudgetProvider } from './contexts/BudgetContext';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import React from 'react';

// Create a state context to share the sidebar collapse state
const SidebarContext = React.createContext();

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Changed to isSidebarOpen for mobile
  const location = useLocation(); // To detect route changes and close sidebar on mobile
  
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

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1200, 
          backgroundColor: '#B19CD9', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <button 
            onClick={toggleSidebar}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginRight: '15px'
            }}
          >
            ☰
          </button>
          
          <div style={{ 
            flexGrow: 1,
            textAlign: 'center'
          }}>
            <h1 style={{ 
              margin: 0, 
              color: '#FFFFFF', 
              fontWeight: 'bold',
              fontSize: '1.4rem' // Slightly larger than "Hello, User" but not too big
            }}>
              {getPageTitle()}
            </h1>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'white',
            fontSize: '1rem'
          }}>
            <span>User Profile</span>
            <div style={{
              marginLeft: '10px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#D8BFD8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              U
            </div>
          </div>
        </header>
        <div style={{ display: 'flex', marginTop: '64px', flexGrow: 1 }}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main style={{ 
            flexGrow: 1, 
            padding: '20px', 
            transition: 'margin-left 0.3s ease',
            marginLeft: 0 // No margin since sidebar is now a temporary overlay on mobile
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionHistoryPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#B19CD9', // Lavender/Soft Purple
    },
    secondary: {
      main: '#D8BFD8', // Thistle
    },
    background: {
      default: '#F5F3FF', // Very light lavender
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4B0082', // Indigo
      secondary: '#7E6BC7',
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