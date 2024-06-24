document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const transactionForm = document.getElementById("transactionForm");
    const transferForm = document.getElementById("transferForm");

    const userList = document.getElementById("userList");
    const transactionList = document.getElementById("transactionList");
    const transferList = document.getElementById("transferList");

    const fromUserSelect = document.getElementById("fromUser");
    const toUserSelect = document.getElementById("toUser");

    // API base URL
    const apiUrl = "http://localhost:5238/api";

    // Fetch users and populate dropdowns
    async function fetchUsers() {
        try {
            const response = await fetch(`${apiUrl}/users`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const users = await response.json();
            populateUserDropdown(fromUserSelect, users);
            populateUserDropdown(toUserSelect, users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    function populateUserDropdown(dropdown, users) {
        dropdown.innerHTML = "";
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.userId;
            option.textContent = user.username;
            dropdown.appendChild(option);
        });
    }

    // Fetch users on page load
    fetchUsers();

    // Add event listeners for form submissions (implement other form handlers similarly)
    userForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        // Your user form submission logic
    });

    transactionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        // Your transaction form submission logic
    });

    transferForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        // Your transfer form submission logic
    });
});
