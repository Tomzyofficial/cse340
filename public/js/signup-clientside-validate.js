// Client side validation
(function signupValidate() {
  document
    .getElementById("createUserForm")
    .addEventListener("submit", function (e) {
      let valid = true;
      const requiredFields = [
        "account_firstname",
        "account_lastname",
        "account_email",
        "account_password",
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
})();
