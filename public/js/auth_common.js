

function redirectLogin() {
  window.location.replace("login.html");
}

async function getCsrfToken() {
    const response = await fetch("/api/auth/csrf-token", {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  }

document
    .getElementById("logoutForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const csrfToken = await getCsrfToken();
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
        });
        if (response.ok) {
          delete window.userRole
          window.location.href = "/login.html";
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    });
