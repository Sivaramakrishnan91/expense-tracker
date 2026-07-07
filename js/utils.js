// Utility functions for Personal Finance Tracker

// Escape HTML special characters to prevent XSS when interpolating into innerHTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Categories for income and expenditure
const CATEGORIES = {
    income: [
        'Salary',
        'Freelance',
        'Investment Returns',
        'Business Income',
        'Rental Income',
        'Other Income'
    ],
    expenditure: [
        'Food & Dining',
        'Transportation',
        'Utilities',
        'Entertainment',
        'Healthcare',
        'Shopping',
        'Rent/Mortgage',
        'Education',
        'Insurance',
        'Groceries',
        'Personal Care',
        'Travel',
        'Other Expenses'
    ]
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date for display
function formatDate(dateString) {
    // Parse YYYY-MM-DD as local date (not UTC) to avoid off-by-one-day in UTC+ timezones
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validate transaction data
function validateTransaction(transaction) {
    const errors = [];

    if (!transaction.date) {
        errors.push('Date is required');
    }

    if (!transaction.name || transaction.name.trim().length === 0) {
        errors.push('Transaction name is required');
    } else if (transaction.name.length > 100) {
        errors.push('Transaction name must be less than 100 characters');
    }

    if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
        errors.push('Amount must be a positive number');
    }

    if (!transaction.type || !['income', 'expenditure'].includes(transaction.type)) {
        errors.push('Type must be either income or expenditure');
    }

    if (!transaction.category || transaction.category.trim().length === 0) {
        errors.push('Category is required');
    }

    if (transaction.notes && transaction.notes.length > 500) {
        errors.push('Notes must be less than 500 characters');
    }

    return errors;
}

// Get date range based on filter
function getDateRange(filterType, customStart = null, customEnd = null) {
    const today = new Date();
    let startDate, endDate;

    switch (filterType) {
        case 'thisMonth':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;

        case 'lastMonth':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;

        case 'last3Months':
            startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            endDate = today;
            break;

        case 'custom':
            if (customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
            } else {
                return null;
            }
            break;

        case 'all':
        default:
            return null;
    }

    // Use local date parts to avoid UTC off-by-one in UTC+ timezones
    const toLocalDateString = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    return {
        start: toLocalDateString(startDate),
        end: toLocalDateString(endDate)
    };
}

// Filter transactions based on criteria
function filterTransactions(transactions, filters) {
    return transactions.filter(transaction => {
        // Date range filter
        if (filters.dateRange) {
            const transactionDate = transaction.date;
            if (transactionDate < filters.dateRange.start || transactionDate > filters.dateRange.end) {
                return false;
            }
        }

        // Type filter
        if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
            return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
            return false;
        }

        // Search filter
        if (filters.search && filters.search.trim().length > 0) {
            const searchTerm = filters.search.toLowerCase();
            const nameMatch = transaction.name.toLowerCase().includes(searchTerm);
            const notesMatch = transaction.notes && transaction.notes.toLowerCase().includes(searchTerm);
            if (!nameMatch && !notesMatch) {
                return false;
            }
        }

        return true;
    });
}

// Sort transactions
function sortTransactions(transactions, sortBy) {
    const sorted = [...transactions];

    switch (sortBy) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;

        case 'date-asc':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;

        case 'amount-desc':
            sorted.sort((a, b) => b.amount - a.amount);
            break;

        case 'amount-asc':
            sorted.sort((a, b) => a.amount - b.amount);
            break;

        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;

        default:
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return sorted;
}

// Calculate summary statistics
function calculateSummary(transactions) {
    const summary = {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        incomeByCategory: {},
        expensesByCategory: {}
    };

    transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount);

        if (transaction.type === 'income') {
            summary.totalIncome += amount;
            summary.incomeByCategory[transaction.category] = 
                (summary.incomeByCategory[transaction.category] || 0) + amount;
        } else if (transaction.type === 'expenditure') {
            summary.totalExpenses += amount;
            summary.expensesByCategory[transaction.category] = 
                (summary.expensesByCategory[transaction.category] || 0) + amount;
        }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    return summary;
}

// Show notification/toast message
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CATEGORIES,
        formatCurrency,
        formatDate,
        getTodayDate,
        generateId,
        validateTransaction,
        getDateRange,
        filterTransactions,
        sortTransactions,
        calculateSummary,
        showNotification,
        debounce
    };
}

// Made with Bob
