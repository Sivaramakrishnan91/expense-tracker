// LocalStorage management for Personal Finance Tracker

const STORAGE_KEY = 'expenseTrackerData';
const SETTINGS_KEY = 'expenseTrackerSettings';

// Initialize storage
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(SETTINGS_KEY)) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
            defaultCategory: 'Other',
            autoExport: false,
            lastExportDate: null
        }));
    }
}

// Get all transactions
function getAllTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading transactions:', error);
        return [];
    }
}

// Save all transactions
function saveAllTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transactions:', error);
        showNotification('Error saving data. Storage might be full.', 'error');
        return false;
    }
}

// Add a new transaction
function addTransaction(transaction) {
    const transactions = getAllTransactions();
    
    // Add ID and timestamp if not present
    if (!transaction.id) {
        transaction.id = generateId();
    }
    if (!transaction.createdAt) {
        transaction.createdAt = new Date().toISOString();
    }
    
    transactions.push(transaction);
    return saveAllTransactions(transactions);
}

// Update an existing transaction
function updateTransaction(id, updatedData) {
    const transactions = getAllTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
        console.error('Transaction not found:', id);
        return false;
    }
    
    // Preserve original creation date
    updatedData.id = id;
    updatedData.createdAt = transactions[index].createdAt;
    updatedData.updatedAt = new Date().toISOString();
    
    transactions[index] = updatedData;
    return saveAllTransactions(transactions);
}

// Delete a transaction
function deleteTransaction(id) {
    const transactions = getAllTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (filtered.length === transactions.length) {
        console.error('Transaction not found:', id);
        return false;
    }
    
    return saveAllTransactions(filtered);
}

// Get transaction by ID
function getTransactionById(id) {
    const transactions = getAllTransactions();
    return transactions.find(t => t.id === id);
}

// Clear all transactions
function clearAllTransactions() {
    return saveAllTransactions([]);
}

// Get settings
function getSettings() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : {
            defaultCategory: 'Other',
            autoExport: false,
            lastExportDate: null
        };
    } catch (error) {
        console.error('Error reading settings:', error);
        return {
            defaultCategory: 'Other',
            autoExport: false,
            lastExportDate: null
        };
    }
}

// Save settings
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Import transactions (merge with existing)
function importTransactions(newTransactions, replaceExisting = false) {
    try {
        let transactions = replaceExisting ? [] : getAllTransactions();
        
        // Process new transactions
        newTransactions.forEach(transaction => {
            // Ensure each transaction has an ID
            if (!transaction.id) {
                transaction.id = generateId();
            }
            
            // Check for duplicates (same date, name, and amount)
            const isDuplicate = transactions.some(t => 
                t.date === transaction.date &&
                t.name === transaction.name &&
                parseFloat(t.amount) === parseFloat(transaction.amount)
            );
            
            if (!isDuplicate) {
                transactions.push(transaction);
            }
        });
        
        return saveAllTransactions(transactions);
    } catch (error) {
        console.error('Error importing transactions:', error);
        return false;
    }
}

// Export transactions to array
function exportTransactions() {
    return getAllTransactions();
}

// Get storage statistics
function getStorageStats() {
    const transactions = getAllTransactions();
    const dataSize = new Blob([JSON.stringify(transactions)]).size;
    
    return {
        totalTransactions: transactions.length,
        dataSize: dataSize,
        dataSizeFormatted: formatBytes(dataSize),
        oldestTransaction: transactions.length > 0 ? 
            transactions.reduce((oldest, t) => 
                new Date(t.date) < new Date(oldest.date) ? t : oldest
            ).date : null,
        newestTransaction: transactions.length > 0 ? 
            transactions.reduce((newest, t) => 
                new Date(t.date) > new Date(newest.date) ? t : newest
            ).date : null
    };
}

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Backup data to JSON file
function backupToFile() {
    const data = {
        transactions: getAllTransactions(),
        settings: getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Restore from backup file
function restoreFromBackup(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.transactions && Array.isArray(data.transactions)) {
                    saveAllTransactions(data.transactions);
                }
                
                if (data.settings) {
                    saveSettings(data.settings);
                }
                
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// Initialize storage on load
initStorage();

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initStorage,
        getAllTransactions,
        saveAllTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        clearAllTransactions,
        getSettings,
        saveSettings,
        importTransactions,
        exportTransactions,
        getStorageStats,
        backupToFile,
        restoreFromBackup
    };
}

// Made with Bob
