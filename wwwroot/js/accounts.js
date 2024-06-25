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
                const card = document.createElement("div");
                card.className = "account-card";
                card.innerHTML = `
                    <h3>${account.currency}</h3>
                    <p>Balance: ${account.balance}</p>
                    <p>User ID: ${account.userId}</p>
                `;
                accountList.appendChild(card);
            });
        }
    }

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const currency = accountCurrencySelect.value;
            const balance = parseFloat(initialBalanceInput.value);
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
                    const errorText = await response.text(); // JSON olarak parse etmeden önce metin olarak alın
                    console.error("Error adding account:", errorText);
                    throw new Error("Network response was not ok: " + errorText);
                }

                // Sayfayı yenile
                location.reload();
            } catch (error) {
                console.error("Error adding account:", error);
            }
        });
    }

    fetchExchangeRates();
    fetchAccounts();
});
