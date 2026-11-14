
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  signupMessage.textContent = "";

  // Check password confirmation
  if (password !== confirmPassword) {
    signupMessage.textContent = "Passwords do not match!";
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      signupMessage.textContent =
        data.message ||
        data.errors?.[0]?.msg ||
        "Registration failed!";
      return;
    }

    signupMessage.textContent = "Registration successful! Redirecting to login...";

    signupForm.reset();

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);

  } catch (error) {
    console.error("Signup error:", error);
    signupMessage.textContent = "Unable to connect to the server!";
  }
});
