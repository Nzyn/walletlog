# WalletLog

WalletLog is a personal finance management application built with React and Material UI. The application allows users to track their income and expenses across different budget categories.

## Features

- **Budget Categories**: Create custom categories like Savings, School, Food, etc.
- **Transaction Tracking**: Add income and expense transactions with amounts and categories
- **Visual Dashboard**: View total income, expenses, and remaining balance
- **Responsive Design**: Works on both desktop and mobile devices
- **Purple/Lavender Theme**: Soft purple color scheme as requested

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Usage

1. Add budget categories using the sidebar
2. Add transactions (income/expense) from the homepage
3. View your financial summary in the dashboard
4. Edit or delete existing transactions as needed

## Tech Stack

- React 19.2.0
- Material UI (MUI)
- React Router DOM
- Vite

## Database

The application uses PostgreSQL for data storage. The database integration will be implemented in future updates.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── TransactionForm.jsx # Form for adding/editing transactions
├── contexts/           # React Context providers
│   └── BudgetContext.jsx # Global state management
├── pages/              # Page components
│   └── HomePage.jsx    # Main dashboard page
└── App.jsx             # Main application component
```