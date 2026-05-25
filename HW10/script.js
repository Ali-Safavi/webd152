let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let budget = localStorage.getItem("budget");
budget = budget ? Number(budget) : null;


function cleanNumber(value) {
  return parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));

  if (budget !== null) {
    localStorage.setItem("budget", budget);
  } else {
    localStorage.removeItem("budget");
  }
}

function addTransaction() {
  let desc = document.getElementById("desc").value.trim();
  let amountRaw = document.getElementById("amount").value;
  let type = document.getElementById("type").value;
  let category = document.getElementById("category").value;
  let newBudget = document.getElementById("budget").value;

  let amount = cleanNumber(amountRaw);

  if (!desc || amount <= 0) return;

  if (newBudget !== "" && budget === null) {
  budget = cleanNumber(newBudget);
}

  transactions.push({
    id: Date.now(),
    desc,
    amount,
    type,
    category
  });

  save();
  updateUI();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  updateUI();
}

function clearAll() {
  transactions = [];
  budget = null;

  localStorage.removeItem("transactions");
  localStorage.removeItem("budget");

  updateUI();
}

function updateUI() {
  const list = document.getElementById("list");
  const summary = document.getElementById("summary");

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} ($${t.amount.toFixed(2)}) - ${t.category} (${t.type})
      <button onclick="deleteTransaction(${t.id})">X</button>
    `;

    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  let balance = income - expense;

  let msg = "";
  summary.style.color = "black";

  if (budget !== null) {
    let remaining = budget - expense;

    if (expense > budget) {
      msg = ` ⚠ Over by $${(expense - budget).toFixed(2)}`;
      summary.style.color = "red";
    } 
    else if (expense > budget * 0.8) {
      msg = ` ⚠ $${remaining.toFixed(2)} left`;
      summary.style.color = "orange";
    } 
    else {
      msg = ` ✔ $${remaining.toFixed(2)} left`;
      summary.style.color = "green";
    }
  }

  if (expense > income) {
    msg += " | ⚠ Spending more than income";
    summary.style.color = "red";
  }

  summary.textContent =
    `Income: $${income.toFixed(2)} | Expenses: $${expense.toFixed(2)} | Balance: $${balance.toFixed(2)}${msg}`;
}

updateUI();