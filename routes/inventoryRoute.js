// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const { requireEmployeeOrAdmin } = require("../middleware/auth");
const baseController = require("../controllers/baseController");

// Route to get inventory search result
router.get(
  "/result",
  utilities.handleErrors(baseController.buildInvSearchResult)
);

// Route to get inventory by classification view (public, no auth)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get inventory detail view (public, no auth)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildDetailView)
);

// All routes below this line require Employee or Admin access

// Inventory management view (protected)
router.get(
  "/management",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

// Add-classification view (protected)
router.get(
  "/add-classification",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

// Add-classification form submission (protected)
router.post(
  "/add-classification",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.addClassification)
);

// Add-inventory view (protected)
router.get(
  "/add-inventory",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

// Add-inventory form submission (protected)
router.post(
  "/add-inventory",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
