/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const acctRoute = require("./routes/acctRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");
const { requireEmployeeOrAdmin } = require("./middleware/auth");

app.set("trust proxy", 1); // trust first proxy
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/*******************************
 * Middleware for body parsing
 *******************************/
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // for JSON data

/********* Middleware to set login state for views ************/
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      res.locals.isLoggedIn = true;
      res.locals.account = payload;
    } catch (err) {
      res.locals.isLoggedIn = false;
      res.locals.account = null;
    }
  } else {
    res.locals.isLoggedIn = false;
    res.locals.account = null;
  }
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Error test route
app.get("/error-test", utilities.handleErrors(baseController.triggerError));

// Inventory route (protected)
app.use("/inv", requireEmployeeOrAdmin, inventoryRoute);

// Account routes
app.use("/account", acctRoute);

// Logout controller
app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
