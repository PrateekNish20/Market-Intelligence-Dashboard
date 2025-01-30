function checkEmail() {
    let emailInput = document.getElementById("emailInput").value.trim().toLowerCase();

    // Fetch the allowed email list
    fetch("allowed_emails.json")
        .then(response => response.json())
        .then(data => {
            let allowedEmails = data.emails;
            
            if (allowedEmails.includes(emailInput)) {
                // Store authentication in local storage
                localStorage.setItem("authenticated", "true");
                window.location.href = "index.html"; // Redirect to dashboard
            } else {
                document.getElementById("error-message").innerText = "Access Denied! Email not found.";
            }
        })
        .catch(error => console.error("Error loading email list:", error));
}
