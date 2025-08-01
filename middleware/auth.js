const utilities = require("../utilities");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/********* Middleware to restrict inventory admin routes ************/
async function requireEmployeeOrAdmin(req, res, next) {
  let errors = [];
  let message = [];
  const token = req.cookies.jwt;
  const nav = await utilities.getNav();

  if (!token) {
    // If not logged in, render message and back to the login page
    errors.push("You need to log in to access this page.");
    res.render("./account/login", {
      title: "Login",
      errors,
      nav,
      sticky: null,
      message,
    });
  }

  // If logged in, check for jwt
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (
      payload.account_type === "Employee" ||
      payload.account_type === "Admin"
    ) {
      res.locals.account = payload;
      res.locals.isLoggedIn = true;
      return next();
    } else {
      // Logged in but not authorized: redirect to login page with message
      errors.push("You don't have permission to this page.");
      res.render("./account/login", {
        title: "Login",
        errors,
        nav,
        sticky: null,
        message,
      });
    }
  } catch (err) {
    // Invalid or expired token: redirect to login page with message
    res.render("./account/login", {
      title: "Login",
      errors,
      nav,
      sticky: null,
      message,
    });
  }
}

/********* Middleware to restrict management and update routes ************/
async function requireAllClients(req, res, next) {
  const nav = await utilities.getNav();
  const token = req.cookies.jwt;
  const errors = [];
  const message = [];

  if (!token) {
    // If not logged in, render message and back to the login page
    errors.push("You need to log in to access this page.");
    res.render("./account/login", {
      title: "Login",
      errors,
      nav,
      sticky: null,
      message,
    });
  }

  // If logged in, check for jwt
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      payload.account_type === "Client" ||
      payload.account_type === "Admin" ||
      payload.account_type === "Employee"
    ) {
      res.locals.account = payload;
      res.locals.isLoggedIn = true;
      return next();
    } else {
      errors.push("You don't have permission to this page.");
      res.render("./account/login", {
        title: "Login",
        errors,
        nav,
        sticky: null,
        message,
      });
    }
  } catch (error) {
    res.render("./account/login", {
      title: "Login",
      errors,
      nav,
      sticky: null,
      message,
    });
  }
}

module.exports = { requireEmployeeOrAdmin, requireAllClients };
