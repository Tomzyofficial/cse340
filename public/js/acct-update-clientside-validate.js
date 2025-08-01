// Client side validation
// Validate update account info
function updateAccountInfo() {
  document
    .getElementById("accountUpdateForm")
    .addEventListener("submit", function (e) {
      let valid = true;
      const requiredFields = [
        "account_firstname",
        "account_lastname",
        "account_email",
      ];
      requiredFields.forEach(function (field) {
        const el = document.getElementById(field);
        if (el && el.value.trim() === "") {
          valid = false;
          el.style.borderColor = "red";
        } else if (el) {
          el.style.borderColor = "";
        }
      });

      if (!valid) {
        e.preventDefault();
        alert("Please fill out all required fields.");
      }
    });
}
updateAccountInfo();

// Validate update password
function updatePassword() {
  document
    .getElementById("passwordChangeForm")
    .addEventListener("submit", (e) => {
      let valid = true;

      const el = document.getElementById("account_password");
      if (el && el.value.trim() === "") {
        valid = false;
        el.style.borderColor = "red";
      } else if (el) {
        el.style.borderColor = "";
      }

      if (!valid) {
        e.preventDefault();
        alert("Please fill out all required fields.");
      }
    });
}
updatePassword();
