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
            console.log("API response data:", data); // Debug: API yanıtını kontrol et
            exchangeRates = data.rates;
            balances = { ...data.rates }; // Balances, rates ile aynı şekilde doldurulur
            console.log("Exchange Rates:", exchangeRates); // Debug: Exchange rates kontrol et
            console.log("Balances:", balances); // Debug: Balances kontrol et
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
                    <p>Balance: ${account.balance}</p>
                    <p>User ID: ${account.userId}</p>
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
        }
    }

    async function deleteAccount(accountId) {
        try {
            const response = await fetch(`${apiUrl}/accounts/${accountId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Sayfayı yenile
            location.reload();
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    }

    if (accountForm) {
        accountForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const currency = accountCurrencySelect.value.split(' - ')[0]; // Döviz türünü seçmek
            const balance = balances[currency]; // API'den gelen balance değeri kullanılır
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
    fetchUserTLBalance();
});
