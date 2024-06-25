document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const backButton = document.getElementById("backButton");
    const apiUrl = "http://localhost:5238/api";

    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

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
        transactionList.innerHTML = "";
        transactions.forEach(transaction => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${transaction.transactionName} - ${transaction.amount} - ${transaction.description}
                <button onclick="editTransaction(${transaction.transactionId})">Düzenle</button>
                <button onclick="deleteTransaction(${transaction.transactionId})">Sil</button>
            `;
            transactionList.appendChild(li);
        });
    }

    transactionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const transactionName = document.getElementById("transactionName").value;
        const amount = parseFloat(document.getElementById("transactionAmount").value);
        const description = document.getElementById("transactionDescription").value;

        const transactionData = JSON.stringify({
            transactionName,
            amount,
            description,
            userId: parseInt(localStorage.getItem("userId"))
        });
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

    window.editTransaction = function (transactionId) {
        // Redirect to edit page with transactionId
        window.location.href = `edit-transaction.html?id=${transactionId}`;
    };

    window.deleteTransaction = async function (transactionId) {
        if (confirm("İşlemi silmek istediğinizden emin misiniz?")) {
            try {
                const response = await fetch(`${apiUrl}/transactions/${transactionId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error deleting transaction:", errorData);
                    throw new Error("Network response was not ok");
                }

                fetchTransactions();
            } catch (error) {
                console.error("Error deleting transaction:", error);
            }
        }
    };

    fetchTransactions();
});
