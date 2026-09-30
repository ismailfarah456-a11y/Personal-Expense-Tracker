// Get elements from the page
const form = document.getElementById('form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const errorMessage = document.getElementById('error');
const filterSelect = document.getElementById('filter');
const list = document.getElementById('list');
const emptyMessage = document.getElementById('empty-message');
const balanceText = document.getElementById('balance');
const incomeText = document.getElementById('income');
const expenseText = document.getElementById('expense');

// Load saved transactions from LocalStorage, or start with an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Turns a number like -12.5 into "-£12.50"
function formatMoney(amount) {
  const sign = amount < 0 ? '-' : '';
  return sign + '£' + Math.abs(amount).toFixed(2);
}

// Returns only the transactions that match the selected category
function getFilteredTransactions() {
  const selectedCategory = filterSelect.value;

  if (selectedCategory === 'All') {
    return transactions;
  }

  return transactions.filter(transaction => transaction.category === selectedCategory);
}

function updateSummary(items) {
  // Income becomes a positive number, expenses become negative
  const amounts = items.map(transaction => {
    return transaction.type === 'income' ? transaction.amount : -transaction.amount;
  });

  const balance = amounts.reduce((total, amount) => total + amount, 0);

  const income = amounts
    .filter(amount => amount > 0)
    .reduce((total, amount) => total + amount, 0);

  const expense = amounts
    .filter(amount => amount < 0)
    .reduce((total, amount) => total + amount, 0);

  balanceText.textContent = formatMoney(balance);
  incomeText.textContent = formatMoney(income);
  expenseText.textContent = formatMoney(Math.abs(expense));
}

function createListItem(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.type);

  // textContent is used instead of innerHTML so user input can't be run as HTML
  const info = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = transaction.description;
  const details = document.createElement('small');
  details.textContent = transaction.category + ' | ' + transaction.date;
  info.appendChild(title);
  info.appendChild(details);

  const amount = document.createElement('span');
  amount.classList.add('amount', transaction.type);
  const sign = transaction.type === 'income' ? '+' : '-';
  amount.textContent = sign + formatMoney(transaction.amount);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));

  li.appendChild(info);
  li.appendChild(amount);
  li.appendChild(deleteButton);
  return li;
}

function renderList(items) {
  list.innerHTML = '';

  items.forEach(transaction => {
    list.appendChild(createListItem(transaction));
  });

  emptyMessage.style.display = items.length === 0 ? 'block' : 'none';
}

// Redraws the list and the summary using the current filter
function updateUI() {
  const items = getFilteredTransactions();
  renderList(items);
  updateSummary(items);
}

function showError(message) {
  errorMessage.textContent = message;
}

function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  // Basic form validation
  if (description === '') {
    showError('Please enter a description.');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    showError('Please enter an amount greater than 0.');
    return;
  }
  if (category === '') {
    showError('Please choose a category.');
    return;
  }

  showError('');

  const transaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: typeInput.value,
    category: category,
    date: new Date().toLocaleDateString('en-GB')
  };

  // Add to the start of the array so the newest transaction shows first
  transactions.unshift(transaction);
  saveTransactions();
  updateUI();
  form.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  updateUI();
}

form.addEventListener('submit', addTransaction);
filterSelect.addEventListener('change', updateUI);

updateUI();