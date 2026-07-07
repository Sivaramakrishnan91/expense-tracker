# 💰 Personal Finance Tracker

A simple, user-friendly web application for tracking your income and expenses with Excel integration. Works in any browser and can be installed as a native-feeling app on Android and iOS — no app store required.

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
- **📲 PWA — Installable**: Add to Home Screen on Android and iOS for a full-screen app experience
- **✈️ Offline Support**: Works without an internet connection after the first load

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- For PWA install prompts: serve the app over HTTP (see below) — opening `index.html` directly as a `file://` URL will not trigger install prompts, though the app still works

### Running via a Local HTTP Server (for PWA features)

**Python (pre-installed on most systems):**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```
Then open `http://localhost:8080` in your browser.

### How to Use

1. **Open the Application**
   - Double-click `index.html` to open in your default browser (basic use), **or**
   - Serve over HTTP (see above) to get full PWA install support

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
4. **Regular Exports**: Export to Excel regularly and save files in a safe place — this is your only backup
5. **Avoid Incognito Mode**: Data is wiped when an incognito/private window closes
6. **Don't Move the Folder**: Opening `index.html` from a different path makes existing data appear missing
7. **Filter by Month**: Use "This Month" filter for current month overview
8. **Check Balance**: Monitor net balance to stay within budget

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
- **Import**: Merge existing data on import
- **Export**: Download as Excel with summary
- **Validation**: Automatic data validation on entry

## 🛡️ Data Privacy

- All data stored locally in your browser
- No data sent to any server
- No internet connection required after initial load
- Clear browser data to remove all transactions

## 📲 Installing as a Mobile App (PWA)

### Android (Chrome)
1. Open the app in **Chrome** on your Android device (must be served over HTTP/HTTPS — not `file://`)
2. Tap the **⋮ menu** (top right) → **"Add to Home Screen"** or look for the install banner at the bottom
3. Confirm — the app appears on your home screen and opens full-screen without the browser address bar
4. Works fully **offline** after the first load

### iOS (Safari)
1. Open the app in **Safari** on your iPhone or iPad
2. Tap the **Share button** (box with arrow at the bottom of Safari)
3. Scroll down and tap **"Add to Home Screen"**
4. Confirm the name and tap **"Add"**
5. The app appears on your home screen and opens full-screen

> **Note:** On iOS, PWAs must be added via Safari specifically. Chrome and other browsers on iOS do not support "Add to Home Screen" for PWAs.

### Desktop (Chrome / Edge)
1. Open the app in Chrome or Edge served over HTTP
2. Look for the **install icon** (⊕) in the address bar
3. Click it to install as a standalone desktop app

---

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
3. Confirm — existing transactions are kept and only new ones are added (duplicates are skipped automatically)

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
- Core transaction management (income & expenditure)
- Excel import/export
- Category breakdown
- Flexible date range filters
- Responsive design
- LocalStorage integration

---

**Happy Tracking! 💰📊**

Remember: Good financial tracking leads to better financial decisions!