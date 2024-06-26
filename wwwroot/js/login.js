document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("fake_email");
    const passwordInput = document.getElementById("fake_password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginError = document.getElementById("loginError");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let valid = true;

        // Validate email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = "Geçerli bir email adresi girin.";
            emailError.style.display = "block";
            valid = false;
        } else {
            emailError.style.display = "none";
        }

        // Validate password
        if (passwordInput.value.length < 6) {
            passwordError.textContent = "Şifre en az 6 karakter olmalıdır.";
            passwordError.style.display = "block";
            valid = false;
        } else {
            passwordError.style.display = "none";
        }

        if (valid) {
            const email = emailInput.value;
            const password = passwordInput.value;

            document.getElementById("user_email").value = email;
            document.getElementById("user_pass").value = password;

            const loginData = JSON.stringify({ email, password });
            console.log("Submitting login data:", loginData);

            try {
                const response = await fetch("http://localhost:5238/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: loginData
                });

                if (response.status === 401) {
                    loginError.textContent = "Hatalı email veya şifre. Lütfen tekrar deneyin.";
                    loginError.style.display = "block";
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error logging in:", errorData);
                    loginError.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
                    loginError.style.display = "block";
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("username", data.username);
                window.location.href = "index.html";
            } catch (error) {
                console.error("Error logging in:", error);
            }
        }
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    document.getElementById("signupButton").addEventListener("click", function () {
        window.location.href = "signup.html";
    });
});
