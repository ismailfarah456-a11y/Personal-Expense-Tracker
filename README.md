# Expense Tracker

A small browser-based expense tracker written in plain HTML, CSS and JavaScript. It records income and expenses, keeps a running balance, and saves everything in the browser's LocalStorage so the data is still there after a refresh. There are no frameworks, libraries or build tools involved.

I built this project to practise DOM manipulation, working with arrays of objects, and storing data on the client side without a back end.

## Features

- **Add transactions** with a description, amount, type (income or expense) and category. The date is recorded automatically when the transaction is added.
- **Form validation**: a transaction is rejected if the description is empty, the amount is not a number greater than zero, or no category has been selected. An error message is shown above the submit button.
- **Delete transactions** using the button next to each entry.
- **Summary totals** for balance, income and expenses, calculated with `map`, `filter` and `reduce`.
- **Category filter** for the history list. The summary totals follow the filter, so choosing "Food", for example, shows the total spent on food.
- **LocalStorage persistence**: transactions are saved on every change and loaded again when the page opens.
- **Newest first**: the most recent transaction appears at the top of the list.
- **Responsive layout**: the summary cards stack vertically on narrow screens.

The available categories are Salary, Food, Rent, Utilities, Transport, Entertainment and Other.

## Built With

- HTML5
- CSS3 (Flexbox and a media query for small screens)
- JavaScript (ES6)
- Web Storage API (LocalStorage)

## Project Structure

```
index.html   Page layout, form and category options
style.css    Styling for the cards, form and transaction list
app.js       Application logic: validation, calculations, rendering and storage
```

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

No installation or server is required.

## How It Works

All transactions are kept in a single array, which is saved to LocalStorage as JSON whenever a transaction is added or deleted. Each time the data changes, `updateUI()` applies the selected category filter, rebuilds the list and recalculates the totals.

To calculate the summary, expenses are converted to negative numbers with `map`, so the balance is simply the sum of all amounts. Income and expenses are then totalled separately by filtering for positive and negative values.

User input is added to the page with `textContent` rather than `innerHTML`, so text typed into the description field cannot be interpreted as HTML.

## Known Limitations and Future Improvements

- Amounts are stored as floating-point numbers, which can cause small rounding errors (for example, `0.1 + 0.2`). Totals are rounded to two decimal places for display, but storing amounts as whole pence would be more reliable.
- If the data in LocalStorage becomes corrupted, `JSON.parse` will throw an error and the app will not load. Wrapping this in a `try/catch` block would make it more robust.
- Transactions cannot be edited; they have to be deleted and added again.
- Dates are stored as display strings (DD/MM/YYYY) and cannot be chosen by the user, so transactions cannot be backdated or sorted by date.
- The category list is written out twice in the HTML (once for the form, once for the filter). Generating both from a single array in JavaScript would make it easier to maintain.
- Data is stored only in the current browser, so it does not sync between devices.