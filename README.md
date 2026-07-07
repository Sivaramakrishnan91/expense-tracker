# 💰 Monthly Expense Tracker

A simple, user-friendly web application for tracking monthly income and expenses with Excel integration. No installation required - just open and start tracking!

## ✨ Features

- **📊 Dashboard Summary**: View total income, expenses, and net balance at a glance
- **➕ Add/Edit/Delete Transactions**: Easy transaction management with form validation
- **📅 Date Range Filters**: Filter by This Month, Last Month, Last 3 Months, or Custom Range
- **🏷️ Category Breakdown**: Visual breakdown of income and expenses by category
- **📥 Import from Excel**: Load existing transaction data from Excel files
- **📤 Export to Excel**: Download your data as Excel spreadsheet with summary
- **💾 Auto-Save**: All data automatically saved to browser's local storage
- **🔍 Search & Sort**: Find transactions quickly with search and multiple sort options
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation or server required!

### How to Use

1. **Open the Application**
   - Double-click `index.html` to open in your default browser
   - Or right-click and select "Open with" your preferred browser

2. **Add Your First Transaction**
   - Fill in the transaction form:
     - **Date**: Select the transaction date
     - **Type**: Choose Income or Expenditure
     - **Name**: Enter a description (e.g., "Salary", "Groceries")
     - **Amount**: Enter the amount in ₹
     - **Category**: Select from predefined categories
     - **Notes**: Add optional notes
   - Click "Add Transaction"

3. **View Your Transactions**
   - All transactions appear in the table below
   - Use filters to narrow down your view
   - Sort by date, amount, or name

4. **Edit or Delete**
   - Click "Edit" to modify a transaction
   - Click "Delete" to remove (with confirmation)

5. **Export to Excel**
   - Click "📤 Export" to download your data
   - File includes transactions and summary sheets

6. **Import from Excel**
   - Click "📥 Import" to load existing data
   - Excel file should have columns: Date, Name, Amount, Type, Category, Notes

## 📋 Transaction Categories

### Income Categories
- Salary
- Freelance
- Investment Returns
- Business Income
- Rental Income
- Other Income

### Expenditure Categories
- Food & Dining
- Transportation
- Utilities
- Entertainment
- Healthcare
- Shopping
- Rent/Mortgage
- Education
- Insurance
- Groceries
- Personal Care
- Travel
- Other Expenses

## 📊 Excel File Format

When importing, your Excel file should have these columns:

| Date       | Name           | Amount  | Type        | Category      | Notes        |
|------------|----------------|---------|-------------|---------------|--------------|
| 2026-07-01 | Salary         | 5000.00 | income      | Salary        | Monthly pay  |
| 2026-07-02 | Groceries      | 150.00  | expenditure | Food & Dining | Weekly shop  |

**Important Notes:**
- Date format: YYYY-MM-DD (e.g., 2026-07-01)
- Type must be either "income" or "expenditure"
- Amount should be a positive number
- Category must match one of the predefined categories

## 🎯 Tips & Best Practices

1. **Regular Updates**: Add transactions daily for accurate tracking
2. **Use Categories**: Proper categorization helps with analysis
3. **Add Notes**: Include details for future reference
4. **Regular Exports**: Export monthly for backup and records
5. **Filter by Month**: Use "This Month" filter for current month overview
6. **Check Balance**: Monitor net balance to stay within budget

## 🔧 Features in Detail

### Dashboard
- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expenditure transactions
- **Net Balance**: Income minus Expenses (color-coded)

### Filters
- **Date Range**: Quick filters or custom date range
- **Type**: Filter by income or expenditure
- **Category**: Filter by specific category
- **Search**: Search by transaction name or notes

### Category Breakdown
- Visual representation with percentage bars
- Separate views for income and expenses
- Sorted by amount (highest first)

### Data Management
- **LocalStorage**: Data saved automatically in browser
- **Import**: Merge or replace existing data
- **Export**: Download as Excel with summary
- **Validation**: Automatic data validation on entry

## 🛡️ Data Privacy

- All data stored locally in your browser
- No data sent to any server
- No internet connection required after initial load
- Clear browser data to remove all transactions

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Troubleshooting

### Data Not Saving
- Check if browser allows local storage
- Ensure you're not in private/incognito mode
- Clear browser cache and reload

### Import Not Working
- Verify Excel file format matches template
- Check that all required columns are present
- Ensure date format is YYYY-MM-DD

### Export Not Working
- Check browser's download settings
- Ensure pop-ups are not blocked
- Try a different browser

## 📝 Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit form (when focused on form)
- **Escape**: Close modal dialogs

## 🔄 Backup & Restore

### Manual Backup
1. Click "📤 Export" to download Excel file
2. Save file to a safe location
3. Keep multiple backups for different periods

### Restore from Backup
1. Click "📥 Import"
2. Select your backup Excel file
3. Choose to merge or replace existing data

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review the Excel file format requirements
- Ensure you're using a supported browser

## 📄 License

This project is free to use for personal and commercial purposes.

## 🎉 Version History

### Version 1.0 (Current)
- Initial release
- Core transaction management
- Excel import/export
- Category breakdown
- Responsive design
- LocalStorage integration

---

**Happy Tracking! 💰📊**

Remember: Good financial tracking leads to better financial decisions!