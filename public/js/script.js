var loginForm = document.getElementById("loginForm");
var message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "logging in...";

  try {
    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message;
      return;
    }

    message.textContent=data.message;

    window.location.href='/dashboard.html'

  } catch (e) {
    console.log("login error :",e);
    message.textContent="unable to connect to server"
  }
});
