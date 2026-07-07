// Main application logic for Personal Finance Tracker

// Global state
let currentEditId = null;
let currentFilters = {
    dateRange: null,
    type: 'all',
    category: 'all',
    search: ''
};
let currentSort = 'date-desc';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set today's date as default
    document.getElementById('transactionDate').value = getTodayDate();

    // Show backup reminder banner unless previously dismissed
    initBackupBanner();

    // Populate category dropdowns
    populateCategoryDropdowns();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load and display data
    loadInitialData();
    
    console.log('Personal Finance Tracker initialized successfully!');
}

function initBackupBanner() {
    const banner = document.getElementById('backupBanner');
    if (localStorage.getItem('backupBannerDismissed') === 'true') {
        banner.classList.add('hidden');
        return;
    }
    document.getElementById('dismissBanner').addEventListener('click', function () {
        banner.classList.add('hidden');
        localStorage.setItem('backupBannerDismissed', 'true');
    });
}

// Populate category dropdowns based on transaction type
function populateCategoryDropdowns() {
    const categorySelect = document.getElementById('transactionCategory');
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Initial population with all categories
    updateCategoryOptions();
    
    // Populate filter dropdown with all categories
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expenditure].sort();
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Update category options based on selected type
function updateCategoryOptions() {
    const typeSelect = document.getElementById('transactionType');
    const categorySelect = document.getElementById('transactionCategory');
    const selectedType = typeSelect.value;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (selectedType === 'income') {
        CATEGORIES.income.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } else if (selectedType === 'expenditure') {
        CATEGORIES.expenditure.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('transactionForm').addEventListener('submit', handleFormSubmit);
    
    // Transaction type change
    document.getElementById('transactionType').addEventListener('change', updateCategoryOptions);
    
    // Cancel edit button
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
    
    // Filter controls
    document.getElementById('dateRangeFilter').addEventListener('change', handleDateRangeChange);
    document.getElementById('startDate').addEventListener('change', handleFilterChange);
    document.getElementById('endDate').addEventListener('change', handleFilterChange);
    document.getElementById('typeFilter').addEventListener('change', handleFilterChange);
    document.getElementById('categoryFilter').addEventListener('change', handleFilterChange);
    document.getElementById('searchFilter').addEventListener('input', debounce(handleFilterChange, 300));
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    
    // Sort control
    document.getElementById('sortBy').addEventListener('change', handleSortChange);
    
    // Import/Export buttons
    document.getElementById('importBtn').addEventListener('click', handleImportClick);
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

// Load initial data
function loadInitialData() {
    // Set default date range to "This Month"
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    dateRangeFilter.value = 'thisMonth';
    handleDateRangeChange();
    
    // Render everything
    renderTransactions();
    updateDashboard();
    updateCategoryBreakdown();
}

// Handle form submission (add or edit)
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        date: document.getElementById('transactionDate').value,
        name: document.getElementById('transactionName').value.trim(),
        amount: parseFloat(document.getElementById('transactionAmount').value),
        type: document.getElementById('transactionType').value,
        category: document.getElementById('transactionCategory').value,
        notes: document.getElementById('transactionNotes').value.trim()
    };
    
    // Validate
    const errors = validateTransaction(formData);
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
    
    // Add or update
    let success;
    if (currentEditId) {
        success = updateTransaction(currentEditId, formData);
        if (success) {
            showNotification('Transaction updated successfully!', 'success');
            cancelEdit();
        }
    } else {
        success = addTransaction(formData);
        if (success) {
            showNotification('Transaction added successfully!', 'success');
            document.getElementById('transactionForm').reset();
            document.getElementById('transactionDate').value = getTodayDate();
        }
    }
    
    if (success) {
        renderTransactions();
        updateDashboard();
        updateCategoryBreakdown();
    }
}

// Edit transaction
function editTransaction(id) {
    const transaction = getTransactionById(id);
    if (!transaction) {
        showNotification('Transaction not found', 'error');
        return;
    }
    
    currentEditId = id;
    
    // Populate form
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionType').value = transaction.type;
    updateCategoryOptions();
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionName').value = transaction.name;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionNotes').value = transaction.notes || '';
    
    // Update UI
    document.getElementById('formTitle').textContent = 'Edit Transaction';
    document.getElementById('submitBtn').textContent = 'Update Transaction';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.transaction-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit mode
function cancelEdit() {
    currentEditId = null;
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').value = getTodayDate();
    document.getElementById('formTitle').textContent = 'Add Transaction';
    document.getElementById('submitBtn').textContent = 'Add Transaction';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// Delete transaction
function deleteTransactionWithConfirm(id) {
    const transaction = getTransactionById(id);
    if (!transaction) {
        showNotification('Transaction not found', 'error');
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    
    modalTitle.textContent = 'Delete Transaction';
    modalMessage.textContent = `Are you sure you want to delete "${transaction.name}" (${formatCurrency(transaction.amount)})?`;
    modal.classList.add('show');
    
    const handleConfirm = () => {
        const success = deleteTransaction(id);
        if (success) {
            showNotification('Transaction deleted successfully!', 'success');
            renderTransactions();
            updateDashboard();
            updateCategoryBreakdown();
            
            // Cancel edit if deleting the transaction being edited
            if (currentEditId === id) {
                cancelEdit();
            }
        }
        cleanup();
    };
    
    const handleCancel = () => {
        cleanup();
    };
    
    const cleanup = () => {
        modal.classList.remove('show');
        modalConfirm.removeEventListener('click', handleConfirm);
        modalCancel.removeEventListener('click', handleCancel);
    };
    
    modalConfirm.addEventListener('click', handleConfirm);
    modalCancel.addEventListener('click', handleCancel);
}

// Handle date range filter change
function handleDateRangeChange() {
    const filterType = document.getElementById('dateRangeFilter').value;
    const customDateRange = document.getElementById('customDateRange');
    
    if (filterType === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
        const dateRange = getDateRange(filterType);
        currentFilters.dateRange = dateRange;
        applyFilters();
    }
}

// Handle filter change
function handleFilterChange() {
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchFilter = document.getElementById('searchFilter').value;
    const dateRangeFilter = document.getElementById('dateRangeFilter').value;
    
    currentFilters.type = typeFilter;
    currentFilters.category = categoryFilter;
    currentFilters.search = searchFilter;
    
    if (dateRangeFilter === 'custom') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (startDate && endDate) {
            currentFilters.dateRange = { start: startDate, end: endDate };
        }
    }
    
    applyFilters();
}

// Apply all filters
function applyFilters() {
    // Refresh non-custom date range in case the day/month has rolled over since page load
    const dateRangeFilter = document.getElementById('dateRangeFilter').value;
    if (dateRangeFilter !== 'custom') {
        currentFilters.dateRange = getDateRange(dateRangeFilter);
    }
    renderTransactions();
    updateDashboard();
    updateCategoryBreakdown();
}

// Clear all filters
function clearFilters() {
    document.getElementById('dateRangeFilter').value = 'thisMonth';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('searchFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('customDateRange').style.display = 'none';
    
    currentFilters = {
        dateRange: getDateRange('thisMonth'),
        type: 'all',
        category: 'all',
        search: ''
    };
    
    applyFilters();
    showNotification('Filters cleared', 'info');
}

// Handle sort change
function handleSortChange() {
    currentSort = document.getElementById('sortBy').value;
    renderTransactions();
}

// Render transactions table
function renderTransactions() {
    const tbody = document.getElementById('transactionsBody');
    let transactions = getAllTransactions();
    
    // Apply filters
    transactions = filterTransactions(transactions, currentFilters);
    
    // Apply sorting
    transactions = sortTransactions(transactions, currentSort);
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="7">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactions.map(transaction => {
        // Whitelist type to prevent CSS class injection
        const safeType = ['income', 'expenditure'].includes(transaction.type) ? transaction.type : 'expenditure';
        return `
        <tr>
            <td>${escapeHtml(formatDate(transaction.date))}</td>
            <td>${escapeHtml(transaction.name)}</td>
            <td>${escapeHtml(transaction.category)}</td>
            <td><span class="type-badge type-${safeType}">${escapeHtml(transaction.type)}</span></td>
            <td class="amount-${safeType}">${escapeHtml(formatCurrency(transaction.amount))}</td>
            <td>${escapeHtml(transaction.notes || '-')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-success" onclick="editTransaction('${escapeHtml(transaction.id)}')">✏️ Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteTransactionWithConfirm('${escapeHtml(transaction.id)}')">🗑️ Delete</button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

// Update dashboard summary
function updateDashboard() {
    let transactions = getAllTransactions();
    transactions = filterTransactions(transactions, currentFilters);
    
    const summary = calculateSummary(transactions);
    
    document.getElementById('totalIncome').textContent = formatCurrency(summary.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(summary.totalExpenses);
    
    const balanceElement = document.getElementById('netBalance');
    balanceElement.textContent = formatCurrency(summary.netBalance);
    
    // Update balance color
    if (summary.netBalance < 0) {
        balanceElement.classList.add('negative');
    } else {
        balanceElement.classList.remove('negative');
    }
}

// Update category breakdown
function updateCategoryBreakdown() {
    let transactions = getAllTransactions();
    transactions = filterTransactions(transactions, currentFilters);
    
    const summary = calculateSummary(transactions);
    
    // Income breakdown
    const incomeBreakdown = document.getElementById('incomeBreakdown');
    if (Object.keys(summary.incomeByCategory).length === 0) {
        incomeBreakdown.innerHTML = '<p class="no-data">No income transactions</p>';
    } else {
        incomeBreakdown.innerHTML = Object.entries(summary.incomeByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
                const percentage = (amount / summary.totalIncome * 100).toFixed(1);
                return `
                    <div class="breakdown-item">
                        <div class="breakdown-info">
                            <div class="breakdown-category">${escapeHtml(category)}</div>
                            <div class="breakdown-percentage">${escapeHtml(percentage)}%</div>
                            <div class="breakdown-bar">
                                <div class="breakdown-bar-fill breakdown-bar-income" style="width: ${escapeHtml(percentage)}%"></div>
                            </div>
                        </div>
                        <div class="breakdown-amount amount-income">${escapeHtml(formatCurrency(amount))}</div>
                    </div>
                `;
            }).join('');
    }
    
    // Expense breakdown
    const expenseBreakdown = document.getElementById('expenseBreakdown');
    if (Object.keys(summary.expensesByCategory).length === 0) {
        expenseBreakdown.innerHTML = '<p class="no-data">No expense transactions</p>';
    } else {
        expenseBreakdown.innerHTML = Object.entries(summary.expensesByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
                const percentage = (amount / summary.totalExpenses * 100).toFixed(1);
                return `
                    <div class="breakdown-item">
                        <div class="breakdown-info">
                            <div class="breakdown-category">${escapeHtml(category)}</div>
                            <div class="breakdown-percentage">${escapeHtml(percentage)}%</div>
                            <div class="breakdown-bar">
                                <div class="breakdown-bar-fill breakdown-bar-expense" style="width: ${escapeHtml(percentage)}%"></div>
                            </div>
                        </div>
                        <div class="breakdown-amount amount-expenditure">${escapeHtml(formatCurrency(amount))}</div>
                    </div>
                `;
            }).join('');
    }
}

// Make functions globally accessible for inline event handlers
window.editTransaction = editTransaction;
window.deleteTransactionWithConfirm = deleteTransactionWithConfirm;
window.renderTransactions = renderTransactions;
window.updateDashboard = updateDashboard;
window.updateCategoryBreakdown = updateCategoryBreakdown;

// Made with Bob
