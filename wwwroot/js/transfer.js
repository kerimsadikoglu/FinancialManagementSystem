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
    const backButton = document.getElementById("backButton");
    const transferForm = document.getElementById("transferForm");
    const transferList = document.getElementById("transferList");
    const toUserSelect = document.getElementById("toUser");
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

    async function fetchUsers() {
        try {
            const response = await fetch(`${apiUrl}/users`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const users = await response.json();
            populateUserDropdown(toUserSelect, users);
        } catch (error) {
            console.error("Error fetching users:", error);
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
                fetchUserTLBalance(); // TL bakiyesini güncelle
                transferForm.reset();
            } catch (error) {
                console.error("Error adding transfer:", error);
            }
        });
    }

    fetchUsers();
    fetchTransfers();
    fetchUserTLBalance(); // TL bakiyesini fetch et
});
