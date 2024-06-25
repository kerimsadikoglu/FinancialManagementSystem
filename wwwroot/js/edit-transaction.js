document.addEventListener("DOMContentLoaded", function () {
    const editTransactionForm = document.getElementById("editTransactionForm");
    const backButton = document.getElementById("backButton");
    const apiUrl = "http://localhost:5238/api";
    const transactionId = new URLSearchParams(window.location.search).get('id');

    backButton.addEventListener("click", function () {
        window.location.href = "transactions.html";
    });

    async function fetchTransaction() {
        try {
            const response = await fetch(`${apiUrl}/transactions/${transactionId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const transaction = await response.json();
            document.getElementById("editTransactionName").value = transaction.transactionName;
            document.getElementById("editTransactionAmount").value = transaction.amount;
            document.getElementById("editTransactionDescription").value = transaction.description;
        } catch (error) {
            console.error("Error fetching transaction:", error);
        }
    }

    editTransactionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const transactionName = document.getElementById("editTransactionName").value;
        const amount = parseFloat(document.getElementById("editTransactionAmount").value);
        const description = document.getElementById("editTransactionDescription").value;

        const transactionData = JSON.stringify({
            transactionName,
            amount,
            description,
            userId: parseInt(localStorage.getItem("userId"))
        });
        console.log("Updating transaction:", transactionData);

        try {
            const response = await fetch(`${apiUrl}/transactions/${transactionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: transactionData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating transaction:", errorData);
                throw new Error("Network response was not ok");
            }

            window.location.href = "transactions.html";
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    });

    fetchTransaction();
});
