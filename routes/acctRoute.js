const express = require("express");
const utilities = require("../utilities");
const acctController = require("../controllers/acctController");
const { requireAllClients } = require("../middleware/auth");
const router = new express.Router();

/**
 * Account Routes
 */

// Signup view
router.get("/signup", utilities.handleErrors(acctController.buildSignupView));

// Signup POST
router.post("/signup", utilities.handleErrors(acctController.handleSignupPost));

// Login view
router.get("/login", utilities.handleErrors(acctController.buildLoginView));

// Login POST
router.post("/login", utilities.handleErrors(acctController.handleLoginPost));

// Logout (Task 6)
router.post("/logout", utilities.handleErrors(acctController.logout));

// Account management view (accessible to all logged-in users)
router.get(
  "/management",
  requireAllClients,
  utilities.handleErrors(acctController.buildManagementView)
);

// Account update view (GET) - only for logged-in users
router.get(
  "/update/:accountId",
  requireAllClients,
  utilities.handleErrors(acctController.buildUpdateAccount)
);

// Account update POST - only for logged-in users
router.post(
  "/update/:accountId",
  requireAllClients,
  utilities.handleErrors(acctController.updateAccount)
);

// Password update POST - only for logged-in users
router.post(
  "/update-password/:accountId",
  requireAllClients,
  utilities.handleErrors(acctController.updatePassword)
);

module.exports = router;
