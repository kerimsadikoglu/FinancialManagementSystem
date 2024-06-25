document.addEventListener("DOMContentLoaded", function () {
    const updateForm = document.getElementById("updateForm");
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    const updateError = document.getElementById("updateError");
    const deleteError = document.getElementById("deleteError");

    async function fetchUserDetails() {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`http://localhost:5238/api/users/${userId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const user = await response.json();
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    updateForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userId = localStorage.getItem("userId");
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`http://localhost:5238/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: parseInt(userId), username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                updateError.textContent = errorData.message;
                updateError.classList.remove("hidden");
                throw new Error("Update failed");
            }

            alert("User information updated successfully");
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    });

    deleteAccountButton.addEventListener("click", async function () {
        const userId = localStorage.getItem("userId");

        if (confirm("Are you sure you want to delete your account?")) {
            try {
                const response = await fetch(`http://localhost:5238/api/users/${userId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    deleteError.textContent = errorData.message;
                    deleteError.classList.remove("hidden");
                    throw new Error("Delete failed");
                }

                alert("Account deleted successfully");
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    });

    fetchUserDetails();
});
