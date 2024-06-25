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
    const accountForm = document.getElementById("accountForm");
    const accountList = document.getElementById("accountList");
    const accountCurrencySelect = document.getElementById("accountCurrency");
    const backButton = document.getElementById("backButton");
    const tlBalanceElement = document.getElementById("tlBalance");
    const balanceForm = document.getElementById("balanceForm");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            window.location.href = "login.html";
        });
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    const apiUrl = "http://localhost:5238/api";
    let exchangeRates = {};
    let balances = {};

    async function fetchExchangeRates() {
        try {
            const response = await fetch('http://demo6772440.mockable.io/rates');
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("API response data:", data);
            exchangeRates = data.rates;
            console.log("Exchange Rates:", exchangeRates);
            populateCurrencyDropdown(data.rates);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
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

    function populateCurrencyDropdown(rates) {
        if (accountCurrencySelect) {
            accountCurrencySelect.innerHTML = "";
            for (const currency in rates) {
                const option = document.createElement("option");
                option.value = currency;
                option.textContent = `${currency} - ${rates[currency]}`;
                accountCurrencySelect.appendChild(option);
            }
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
                const card = document.createElement("div");
                card.className = "account-card";
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${account.currency}</h3>
                        <span class="delete-icon" data-account-id="${account.accountId}">&#128465;</span>
                    </div>
                    <p>Güncel Kur: ${exchangeRates[account.currency]}</p>
                    <p>Bakiye: ${account.balance}</p>
                    <p>User ID: ${account.userId}</p>
                    <input type="number" class="amount-input" placeholder="Miktar girin">
                    <button class="buy-button" data-account-id="${account.accountId}" data-currency="${account.currency}">Al</button>
                    <button class="sell-button" data-account-id="${account.accountId}" data-currency="${account.currency}">Sat</button>
                `;
                accountList.appendChild(card);
            });

            const deleteIcons = document.querySelectorAll(".delete-icon");
            deleteIcons.forEach(icon => {
                icon.addEventListener("click", function () {
                    const accountId = this.getAttribute("data-account-id");
                    const confirmDelete = confirm("Hesabı silmek istediğinizden emin misiniz?");
                    if (confirmDelete) {
                        deleteAccount(accountId);
                    }
                });
            });

            const buyButtons = document.querySelectorAll(".buy-button");
            buyButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const accountId = this.getAttribute("data-account-id");
                    const currency = this.getAttribute("data-currency");
                    const amountInput = this.previousElementSibling;
                    const amount = parseFloat(amountInput.value);
                    if (isNaN(amount) || amount <= 0) {
                        alert("Geçerli bir miktar girin.");
                        return;
                    }
                    handleBuy(accountId, currency, amount);
                });
            });

            const sellButtons = document.querySelectorAll(".sell-button");
            sellButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const accountId = this.getAttribute("data-account-id");
                    const currency = this.getAttribute("data-currency");
                    const amountInput = this.previousElementSibling.previousElementSibling;
                    const amount = parseFloat(amountInput.value);
                    if (isNaN(amount) || amount <= 0) {
                        alert("Geçerli bir miktar girin.");
                        return;
                    }
                    handleSell(accountId, currency, amount);
                });
            });
        }
    }

    async function handleBuy(accountId, currency, amount) {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/accounts/buy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, accountId, currency, amount, rate: exchangeRates[currency] })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            await fetchUserTLBalance();
            await fetchAccounts();
        } catch (error) {
            console.error("Error buying currency:", error);
        }
    }

    async function handleSell(accountId, currency, amount) {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/accounts/sell`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, accountId, currency, amount, rate: exchangeRates[currency] })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            await fetchUserTLBalance();
            await fetchAccounts();
        } catch (error) {
            console.error("Error selling currency:", error);
        }
    }

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const currency = accountCurrencySelect.value.split(' - ')[0];
            const balance = 0;
            const userId = parseInt(localStorage.getItem("userId"));

            const accountData = { currency, balance, userId };
            console.log("Submitting account:", accountData);

            try {
                const response = await fetch(`${apiUrl}/accounts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(accountData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error adding account:", errorText);
                    throw new Error("Network response was not ok: " + errorText);
                }

                location.reload();
            } catch (error) {
                console.error("Error adding account:", error);
            }
        });
    }

    if (balanceForm) {
        balanceForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const amount = parseFloat(document.getElementById("balanceAmount").value);
            updateUserTLBalance(amount);
            balanceForm.reset();
        });
    }

    async function deleteAccount(accountId) {
        try {
            const response = await fetch(`${apiUrl}/accounts/${accountId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchAccounts();
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    }

    async function updateUserTLBalance(amount) {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`${apiUrl}/users/${userId}/updateBalance`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchUserTLBalance();
        } catch (error) {
            console.error("Error updating TL balance:", error);
        }
    }

    (async function initializePage() {
        await fetchExchangeRates();
        await fetchAccounts();
        fetchUserTLBalance();
    })();
});
