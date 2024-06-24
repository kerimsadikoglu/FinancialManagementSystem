document.addEventListener("DOMContentLoaded", function () {
    function checkAuth() {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        console.log("Checking auth:", { userId, username });

        if (!userId) {
            window.location.href = "login.html";
        }
    }

    checkAuth();

    const logoutButton = document.getElementById("logoutButton");
    const manageAccountsButton = document.getElementById("manageAccountsButton");
    const userForm = document.getElementById("userForm");
    const transactionForm = document.getElementById("transactionForm");
    const transferForm = document.getElementById("transferForm");
    const accountForm = document.getElementById("accountForm");
    const userList = document.getElementById("userList");
    const transactionList = document.getElementById("transactionList");
    const transferList = document.getElementById("transferList");
    const accountList = document.getElementById("accountList");
    const tlBalanceElement = document.getElementById("tlBalance");
    const toUserSelect = document.getElementById("toUser");
    const accountCurrencySelect = document.getElementById("accountCurrency");
    const initialBalanceInput = document.getElementById("initialBalance");
    const backButton = document.getElementById("backButton");

    // Add null checks
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            window.location.href = "login.html";
        });
    }

    if (manageAccountsButton) {
        manageAccountsButton.addEventListener("click", function () {
            window.location.href = "accounts.html";
        });
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    const apiUrl = "http://localhost:5238/api";

    async function fetchUsers() {
        try {
            const response = await fetch(`${apiUrl}/users`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const users = await response.json();
            populateUserDropdown(toUserSelect, users);
            displayUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    async function fetchUserTLBalance() {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/users/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const user = await response.json();
            if (tlBalanceElement) {
                tlBalanceElement.textContent = user.tlBalance.toFixed(2) + " TL";
            }
        } catch (error) {
            console.error("Error fetching TL balance:", error);
            if (tlBalanceElement) {
                tlBalanceElement.textContent = "Yüklenemedi";
            }
        }
    }

    function populateUserDropdown(dropdown, users) {
        if (dropdown) {
            dropdown.innerHTML = "";
            users.forEach(user => {
                if (user.userId !== parseInt(localStorage.getItem("userId"))) {
                    const option = document.createElement("option");
                    option.value = user.userId;
                    option.textContent = user.username;
                    dropdown.appendChild(option);
                }
            });
        }
    }

    function displayUsers(users) {
        if (userList) {
            userList.innerHTML = "";
            users.forEach(user => {
                const li = document.createElement("li");
                li.textContent = `${user.username} - ${user.email}`;
                userList.appendChild(li);
            });
        }
    }

    async function fetchTransactions() {
        try {
            const response = await fetch(`${apiUrl}/transactions`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const transactions = await response.json();
            displayTransactions(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    function displayTransactions(transactions) {
        if (transactionList) {
            transactionList.innerHTML = "";
            transactions.forEach(transaction => {
                const li = document.createElement("li");
                li.textContent = `${transaction.amount} - ${transaction.category} - ${transaction.date}`;
                transactionList.appendChild(li);
            });
        }
    }

    async function fetchTransfers() {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/transfers/user/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const transfers = await response.json();
            displayTransfers(transfers);
        } catch (error) {
            console.error("Error fetching transfers:", error);
        }
    }

    function displayTransfers(transfers) {
        if (transferList) {
            transferList.innerHTML = "";
            transfers.forEach(transfer => {
                const li = document.createElement("li");
                const transferType = transfer.fromUserId === parseInt(localStorage.getItem("userId")) ? "Gönderilen" : "Alınan";
                const otherUser = transferType === "Gönderilen" ? transfer.toUser.username : transfer.fromUser.username;
                li.textContent = `${transferType} - ${otherUser} - ${transfer.amount} TL - ${transfer.date}`;
                transferList.appendChild(li);
            });
        }
    }

    async function fetchAccounts() {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/accounts/user/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const accounts = await response.json();
            displayAccounts(accounts);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    }

    function displayAccounts(accounts) {
        if (accountList) {
            accountList.innerHTML = "";
            accounts.forEach(account => {
                const li = document.createElement("li");
                li.textContent = `${account.currency} - ${account.balance}`;
                accountList.appendChild(li);
            });
        }
    }

    async function fetchExchangeRates() {
        try {
            const response = await fetch('http://demo6772440.mockable.io/rates');
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            populateCurrencyDropdown(data.rates);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    }

    function populateCurrencyDropdown(rates) {
        if (accountCurrencySelect) {
            accountCurrencySelect.innerHTML = "";
            for (const currency in rates) {
                const option = document.createElement("option");
                option.value = currency;
                option.textContent = currency;
                accountCurrencySelect.appendChild(option);
            }
        }
    }

    if (userForm) {
        userForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${apiUrl}/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, email, password })
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                fetchUsers();
                userForm.reset();
            } catch (error) {
                console.error("Error adding user:", error);
            }
        });
    }

    if (transactionForm) {
        transactionForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const amount = parseFloat(document.getElementById("amount").value);
            const category = document.getElementById("category").value;
            const date = document.getElementById("date").value;
            const description = document.getElementById("description").value;

            const transactionData = JSON.stringify({ amount, category, date, description, userId: localStorage.getItem("userId") });
            console.log("Submitting transaction:", transactionData);

            try {
                const response = await fetch(`${apiUrl}/transactions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: transactionData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error adding transaction:", errorData);
                    throw new Error("Network response was not ok");
                }

                fetchTransactions();
                transactionForm.reset();
            } catch (error) {
                console.error("Error adding transaction:", error);
            }
        });
    }

    if (transferForm) {
        transferForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const fromUserId = parseInt(localStorage.getItem("userId"));
            const toUserId = parseInt(document.getElementById("toUser").value);
            const amount = parseFloat(document.getElementById("transferAmount").value);
            const date = new Date().toISOString();
            const description = "TL Transfer";

            const transferData = JSON.stringify({ fromUserId, toUserId, amount, date, description });
            console.log("Transfer Data:", transferData);

            try {
                const response = await fetch(`${apiUrl}/transfers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: transferData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error adding transfer:", errorData);
                    throw new Error("Network response was not ok");
                }

                fetchTransfers();
                transferForm.reset();
            } catch (error) {
                console.error("Error adding transfer:", error);
            }
        });
    }

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const currency = accountCurrencySelect.value;
            const balance = parseFloat(initialBalanceInput.value);
            const userId = parseInt(localStorage.getItem("userId"));

            const accountData = JSON.stringify({ currency, balance, userId });
            console.log("Submitting account:", accountData);

            try {
                const response = await fetch(`${apiUrl}/accounts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: accountData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error adding account:", errorData);
                    throw new Error("Network response was not ok");
                }

                fetchAccounts();
                accountForm.reset();
            } catch (error) {
                console.error("Error adding account:", error);
            }
        });
    }

    fetchUsers();
    fetchTransactions();
    fetchTransfers();
    //fetchAccounts();
    fetchExchangeRates();
    fetchUserTLBalance();
});
