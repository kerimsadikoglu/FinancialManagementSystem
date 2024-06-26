document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signupError = document.getElementById("signupError");

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let valid = true;

        // Validate username
        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "Kullanıcı adı gerekli.");
            valid = false;
        } else {
            hideError(usernameInput);
        }

        // Validate email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, "Geçerli bir email adresi girin.");
            valid = false;
        } else {
            hideError(emailInput);
        }

        // Validate password
        if (passwordInput.value.length < 6) {
            showError(passwordInput, "Şifre en az 6 karakter olmalıdır.");
            valid = false;
        } else {
            hideError(passwordInput);
        }

        if (valid) {
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

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
                    signupError.textContent = errorData.message || "Sign up failed";
                    signupError.style.display = "block";
                    throw new Error("Sign up failed");
                }

                // Redirect to login page after successful sign up
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error during sign up:", error);
            }
        }
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    function hideError(input) {
        const errorElement = input.nextElementSibling;
        errorElement.style.display = "none";
    }
});
