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
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });

    const accountForm = document.getElementById("accountForm");
    const accountList = document.getElementById("accountList");

    const apiUrl = "http://localhost:5238/api";
    const currencyApiUrl = "http://demo6772440.mockable.io/rates";

    async function fetchCurrencies() {
        try {
            const response = await fetch(currencyApiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            populateCurrencyDropdown(data.rates);
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    }

    function populateCurrencyDropdown(rates) {
        const currencySelect = document.getElementById("accountCurrency");
        currencySelect.innerHTML = "";
        for (const [currency, rate] of Object.entries(rates)) {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = `${currency} (${rate} TL)`;
            currencySelect.appendChild(option);
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
        accountList.innerHTML = "";
        accounts.forEach(account => {
            const li = document.createElement("li");
            li.textContent = `${account.name} - ${account.currency}`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Sil";
            deleteButton.addEventListener("click", () => deleteAccount(account.accountId));
            li.appendChild(deleteButton);
            accountList.appendChild(li);
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

    accountForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("accountName").value;
        const currency = document.getElementById("accountCurrency").value;
        const userId = localStorage.getItem("userId");

        console.log("Submitting account:", { name, currency, userId });

        try {
            const response = await fetch(`${apiUrl}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, currency, userId })
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

    fetchCurrencies();
    fetchAccounts();
});
