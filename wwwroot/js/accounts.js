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
    const initialBalanceInput = document.getElementById("initialBalance");
    const backButton = document.getElementById("backButton");

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

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const name = document.getElementById("accountName").value;
            const currency = accountCurrencySelect.value;
            const balance = parseFloat(initialBalanceInput.value);
            const userId = parseInt(localStorage.getItem("userId"));

            const accountData = JSON.stringify({ name, currency, balance, userId });
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

    fetchExchangeRates();
    fetchAccounts();
});
