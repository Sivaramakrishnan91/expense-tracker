// Excel import/export functionality using SheetJS

// Export transactions to Excel
function exportToExcel() {
    try {
        const transactions = getAllTransactions();
        
        if (transactions.length === 0) {
            showNotification('No transactions to export', 'error');
            return;
        }

        // Prepare data for Excel
        const excelData = transactions.map(t => ({
            'Date': t.date,
            'Name': t.name,
            'Amount': parseFloat(t.amount),
            'Type': t.type,
            'Category': t.category,
            'Notes': t.notes || ''
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Create worksheet from data
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        ws['!cols'] = [
            { wch: 12 },  // Date
            { wch: 25 },  // Name
            { wch: 12 },  // Amount
            { wch: 12 },  // Type
            { wch: 20 },  // Category
            { wch: 30 }   // Notes
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        // Create summary sheet
        const summary = calculateSummary(transactions);
        const summaryData = [
            { 'Metric': 'Total Income', 'Amount': summary.totalIncome },
            { 'Metric': 'Total Expenses', 'Amount': summary.totalExpenses },
            { 'Metric': 'Net Balance', 'Amount': summary.netBalance },
            { 'Metric': '', 'Amount': '' },
            { 'Metric': 'Income by Category', 'Amount': '' }
        ];

        // Add income categories
        Object.entries(summary.incomeByCategory).forEach(([category, amount]) => {
            summaryData.push({ 'Metric': `  ${category}`, 'Amount': amount });
        });

        summaryData.push({ 'Metric': '', 'Amount': '' });
        summaryData.push({ 'Metric': 'Expenses by Category', 'Amount': '' });

        // Add expense categories
        Object.entries(summary.expensesByCategory).forEach(([category, amount]) => {
            summaryData.push({ 'Metric': `  ${category}`, 'Amount': amount });
        });

        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Generate filename with current date
        const filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.xlsx`;

        // Write file
        XLSX.writeFile(wb, filename);

        showNotification('Transactions exported successfully!', 'success');

        // Update last export date in settings
        const settings = getSettings();
        settings.lastExportDate = new Date().toISOString();
        saveSettings(settings);

    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error exporting to Excel', 'error');
    }
}

// Import transactions from Excel
function importFromExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    reject(new Error('No data found in Excel file'));
                    return;
                }

                // Map Excel data to transaction format
                const transactions = [];
                const errors = [];

                jsonData.forEach((row, index) => {
                    try {
                        // Handle different possible column names (case-insensitive)
                        const getColumnValue = (row, possibleNames) => {
                            for (const name of possibleNames) {
                                const key = Object.keys(row).find(k => 
                                    k.toLowerCase() === name.toLowerCase()
                                );
                                if (key && row[key] !== undefined && row[key] !== '') {
                                    return row[key];
                                }
                            }
                            return null;
                        };

                        const date = getColumnValue(row, ['Date', 'Transaction Date', 'date']);
                        const name = getColumnValue(row, ['Name', 'Description', 'Transaction Name', 'name']);
                        const amount = getColumnValue(row, ['Amount', 'Value', 'amount']);
                        const type = getColumnValue(row, ['Type', 'Transaction Type', 'type']);
                        const category = getColumnValue(row, ['Category', 'category']);
                        const notes = getColumnValue(row, ['Notes', 'Description', 'Remarks', 'notes']) || '';

                        // Validate required fields
                        if (!date || !name || !amount || !type || !category) {
                            errors.push(`Row ${index + 2}: Missing required fields`);
                            return;
                        }

                        // Parse and validate date
                        let parsedDate;
                        if (typeof date === 'number') {
                            // Excel date serial number
                            const d = XLSX.SSF.parse_date_code(date);
                            parsedDate = `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
                        } else {
                            // String date — normalise to YYYY-MM-DD without UTC conversion
                            const str = date.toString().trim();
                            // Already YYYY-MM-DD
                            if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
                                parsedDate = str;
                            } else {
                                // Try to parse via Date and extract local parts
                                const d = new Date(str);
                                if (isNaN(d.getTime())) {
                                    errors.push(`Row ${index + 2}: Invalid date "${date}"`);
                                    return;
                                }
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                parsedDate = `${y}-${m}-${day}`;
                            }
                        }

                        // Validate type
                        const normalizedType = type.toString().toLowerCase();
                        if (!['income', 'expenditure'].includes(normalizedType)) {
                            errors.push(`Row ${index + 2}: Invalid type "${type}". Must be "income" or "expenditure"`);
                            return;
                        }

                        // Create transaction object
                        const transaction = {
                            id: generateId(),
                            date: parsedDate,
                            name: name.toString().trim(),
                            amount: parseFloat(amount),
                            type: normalizedType,
                            category: category.toString().trim(),
                            notes: notes.toString().trim(),
                            createdAt: new Date().toISOString()
                        };

                        // Validate transaction
                        const validationErrors = validateTransaction(transaction);
                        if (validationErrors.length > 0) {
                            errors.push(`Row ${index + 2}: ${validationErrors.join(', ')}`);
                            return;
                        }

                        transactions.push(transaction);

                    } catch (error) {
                        errors.push(`Row ${index + 2}: ${error.message}`);
                    }
                });

                if (transactions.length === 0) {
                    reject(new Error('No valid transactions found in Excel file.\n' + errors.join('\n')));
                    return;
                }

                // Show summary of import
                const summary = {
                    total: jsonData.length,
                    imported: transactions.length,
                    errors: errors.length,
                    errorMessages: errors
                };

                resolve({ transactions, summary });

            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Handle import button click
function handleImportClick() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    // Check file type
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        showNotification('Please select a valid Excel file (.xlsx or .xls)', 'error');
        return;
    }

    // Show loading state
    const importBtn = document.getElementById('importBtn');
    const originalText = importBtn.textContent.trim();
    importBtn.textContent = '⏳ Importing...';
    importBtn.disabled = true;

    importFromExcel(file)
        .then(({ transactions, summary }) => {
            // Ask user if they want to replace or merge
            showImportConfirmation(transactions, summary);
        })
        .catch(error => {
            console.error('Import error:', error);
            showNotification(`Import failed: ${error.message}`, 'error');
        })
        .finally(() => {
            importBtn.textContent = originalText;
            importBtn.disabled = false;
            // Reset file input
            event.target.value = '';
        });
}

// Show import confirmation dialog
function showImportConfirmation(transactions, summary) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');

    modalTitle.textContent = 'Import Transactions';
    
    let message = `Found ${summary.imported} valid transaction(s) out of ${summary.total} row(s).`;
    if (summary.errors > 0) {
        message += `\n\n${summary.errors} row(s) had errors and will be skipped.`;
    }
    message += '\n\nDo you want to import these transactions?';
    message += '\n(Duplicates will be automatically skipped)';
    
    modalMessage.textContent = message;
    modalMessage.style.whiteSpace = 'pre-line';

    modal.classList.add('show');

    // Handle confirmation
    const handleConfirm = () => {
        const success = importTransactions(transactions, false);
        if (success) {
            showNotification(`Successfully imported ${transactions.length} transaction(s)!`, 'success');
            // Switch to "All Time" so imported transactions from any month are visible
            document.getElementById('dateRangeFilter').value = 'all';
            // Use applyFilters so currentFilters is fully refreshed before rendering
            applyFilters();
        } else {
            showNotification('Failed to import transactions', 'error');
        }
        cleanup();
    };

    const handleCancel = () => {
        showNotification('Import cancelled', 'info');
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

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportToExcel,
        importFromExcel,
        handleImportClick,
        handleFileSelect
    };
}

// Made with Bob
