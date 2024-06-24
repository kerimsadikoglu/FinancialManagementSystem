document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("http://localhost:5238/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                loginError.textContent = errorData.message;
                loginError.classList.remove("hidden");
                throw new Error("Login failed");
            }

            const data = await response.json();
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", data.username);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error during login:", error);
        }
    });
});
