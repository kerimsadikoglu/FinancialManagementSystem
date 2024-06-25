document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const signupError = document.getElementById("signupError");

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5238/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                signupError.textContent = errorData.message;
                signupError.classList.remove("hidden");
                throw new Error("Sign up failed");
            }

            // Redirect to login page after successful sign up
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    });
});
