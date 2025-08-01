const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();

const acctController = {};

/**
 * Build the account update view
 * GET /account/update/:accountId
 */
acctController.buildUpdateAccount = async function (req, res) {
  const nav = await utilities.getNav();
  // Allow either param or body for accountId
  const account_id = req.params.accountId || req.body.account_id;
  const account = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    account,
    sticky: {},
    errors: [],
    message: null,
  });
};

/**
 * Handle account info update (POST)
 * POST /account/update
 */
acctController.updateAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  // const { account_id } = req.params;

  let errors = [];

  // Server-side validation
  if (!account_firstname || !account_lastname || !account_email) {
    errors.push("All fields are required.");
  }
  if (account_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email)) {
    errors.push("Invalid email address.");
  }

  // Check for duplicate email (if changed)
  const existing = await accountModel.getAccountByEmail(account_email);

  if (existing && existing.account_id != account_id) {
    errors.push("Email already exists. Please use a different email address.");
  }

  if (errors.length > 0) {
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      sticky: req.body,
      errors,
      message: null,
    });
  }

  // Update in DB
  const result = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (result) {
    // Get updated account for display
    const account = await accountModel.getAccountById(account_id);

    return res.render("account/management", {
      title: "Account Management",
      nav,
      account,
      message: "Account updated successfully",
      errors: null,
      sticky: null,
    });
    // return res.redirect("/account/management")
  } else {
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      sticky: req.body,
      errors: ["Update failed."],
      message: null,
    });
  }
};

/**
 * Handle password update (POST)
 * POST /account/update-password
 */
acctController.updatePassword = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  // const { account_id } = req.params;
  let errors = [];

  // Password requirements: 12+ chars, 1 upper, 1 lower, 1 number, 1 special
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!account_password || !passwordPattern.test(account_password)) {
    errors.push(
      "Password must be at least 12 characters and include uppercase, lowercase, number, and special character."
    );
  }

  if (errors.length > 0) {
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      sticky: {},
      errors,
      message: null,
    });
  }

  // Hash and update
  const hash = await bcrypt.hash(account_password, 10);
  const result = await accountModel.updateAccountPassword(account_id, hash);

  if (result) {
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/management", {
      title: "Account Management",
      nav,
      account,
      message: "Password updated successfully.",
      errors: [],
      sticky: null,
    });
  } else {
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      sticky: {},
      errors: ["Password update failed."],
      message: null,
    });
  }
};

/**
 * Build the signup view
 */
acctController.buildSignupView = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("./account/signup", {
    title: "Signup",
    nav,
    errors: [],
    message: [],
    sticky: null,
  });
};

/**
 * Handle signup POST
 */
acctController.handleSignupPost = async function (req, res, next) {
  const nav = await utilities.getNav();

  let errors = [];
  let message = [];
  let sticky = { ...req.body };

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Server-side form validation
  if (!account_firstname) errors.push("First name is required");
  if (!account_lastname) errors.push("Last name is required.");
  if (!account_email) errors.push("Email address is required.");
  if (!account_password) errors.push("Password is required");

  if (!account_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email))
    errors.push("Invalid account email address.");

  // Password requirements
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!account_password || !passwordPattern.test(account_password)) {
    errors.push(
      "Password must be at least 12 characters and include uppercase, lowercase, number, and special character."
    );
  }

  // Check if email address already exists in the account table
  const existingEmail = await accountModel.getAccountByEmail(account_email);

  if (existingEmail) {
    errors.push("Email address already in use.");
  }

  if (Array.isArray(errors) && errors.length > 0) {
    return res.render("./account/signup", {
      title: "Signup",
      nav,
      errors,
      message: null,
      sticky,
    });
  }

  // If no errors, proceed with user account creation
  try {
    const createUserAcct = await accountModel.signupUser(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (!createUserAcct) {
      throw new Error("Couldn't sign up user.");
    }

    message = "Account created successfully!";
    res.render("./account/login", {
      title: "Account Created. Login to proceed.",
      nav,
      errors: [],
      message,
      sticky: null,
    });
  } catch (error) {
    errors.push("Error creating account. Please try again.");
    res.render("./account/signup", {
      title: "Signup",
      nav,
      errors,
      message: null,
      sticky: req.body,
    });
  }
};

/**
 * Build the login view
 */
acctController.buildLoginView = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("./account/login", {
    title: "Login",
    nav,
    errors: [],
    message: [],
    sticky: null,
  });
};

/**
 * Handle login POST
 */
acctController.handleLoginPost = async function (req, res, next) {
  const nav = await utilities.getNav();

  let errors = [];
  let message = [];
  let sticky = { ...req.body };

  const { account_email, account_password } = req.body;

  // Server-side form validation
  if (!account_email) errors.push("Email address is required.");
  if (!account_password) errors.push("Password is required.");

  if (account_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email))
    errors.push("Invalid email address.");

  if (Array.isArray(errors) && errors.length > 0) {
    return res.render("./account/login", {
      title: "Login",
      nav,
      errors,
      message,
      sticky,
    });
  }

  // If no validation errors, proceed with login
  try {
    const user = await accountModel.loginUser(account_email, account_password);

    if (user) {
      // Issue JWT and set as HTTP-only cookie
      const token = jwt.sign(
        {
          account_id: user.account_id,
          account_email: user.account_email,
          account_firstname: user.account_firstname,
          account_type: user.account_type,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });

      res.redirect("/account/management");
    } else {
      errors.push("Incorrect email or password.");
      res.render("./account/login", {
        title: "Login",
        nav,
        errors,
        message: null,
        sticky,
      });
    }
  } catch (error) {
    errors.push("Error during login. Please try again.");
    res.render("./account/login", {
      title: "Login",
      nav,
      errors,
      message: null,
      sticky,
    });
  }
};

/**
 * Build the account management view
 * GET /account/management
 */
acctController.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  // Get account info from JWT (already set in res.locals by middleware)
  let account = res.locals.account;
  // If not present, try to get from DB using id in JWT
  if (!account && res.locals.account_id) {
    account = await accountModel.getAccountById(res.locals.account_id);
  }
  res.render("./account/management", {
    title: "Account",
    nav,
    account,
    message: [],
    errors: [],
    sticky: null,
  });
};

/**
 * Handle logout (Task 6)
 * POST /logout
 */
acctController.logout = async function (req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
};

module.exports = acctController;
