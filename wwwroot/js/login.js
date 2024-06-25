document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("fake_email").value;
        const password = document.getElementById("fake_password").value;

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

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error logging in:", errorData);
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", data.username);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error logging in:", error);
        }
    });

    document.getElementById("signupButton").addEventListener("click", function () {
        window.location.href = "signup.html";
    });
});
