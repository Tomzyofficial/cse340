const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const baseController = {};

/************* Build home view *************/
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

/********** Build inventory search result view *************/
baseController.buildInvSearchResult = async function (req, res) {
  const nav = await utilities.getNav();
  const searchTerm = req.query.searchInv;

  // If no search term provided, redirect to home and show a message
  if (!searchTerm || searchTerm.trim() === "") {
    return res.render("index", { title: "No search term provided", nav });
  }

  // Get search results from the inventory model
  const data = await invModel.getInvSearchResult(searchTerm, searchTerm);

  // If no results, show a message
  if (!data || data.length < 1) {
    return res.render("index", { title: "No results found", nav });
  }

  // Build the grid view for results
  const grid = await utilities.buildSearchView(data);

  // Render the results page
  res.render("inventory/result", {
    title: `Search results for ${searchTerm}`,
    nav,
    grid,
  });
};

/* ***************************
 *  Intentional Error Route
 * ************************** */
baseController.triggerError = async function (req, res, next) {
  // Intentionally throw an error to test error handling
  throw new Error("Intentional error for testing purposes");
};

module.exports = baseController;
