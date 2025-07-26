const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    let nav = await utilities.getNav();
    res.render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">Sorry, no vehicles could be found for this classification.</p>',
    });
    return;
  }

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);

  if (!data) {
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: "Vehicle Not Found",
      nav,
      vehicle: '<p class="notice">Sorry, no vehicle details are available.</p>',
    });
    return;
  }

  const vehicle = await utilities.buildInventoryDetail(data);

  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicle,
  });
};

/* ***************************
 *  Deliver Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    message: [],
  });
};

/* ***************************
 *  Deliver Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    message: [],
    errors: [],
  });
};

/* ***************************
 *  Handle Add Classification POST
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  let errors = [];
  let message = [];
  // Server-side validation: only letters and numbers, no spaces or special characters
  if (!classification_name || !/^[A-Za-z0-9]+$/.test(classification_name)) {
    errors.push(
      "Classification name must not contain spaces or special characters."
    );
  }
  if (classification_name && classification_name.length > 30) {
    errors.push("Classification name must be 30 characters or fewer.");
  }
  if (errors.length > 0) {
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: null,
      errors,
    });
  }
  try {
    const result = await invModel.addClassification(classification_name);
    nav = await utilities.getNav();
    if (result) {
      message.push("Classification added successfully!");
      if (message.length > 0) {
        console.log("Classification added");
        // req.flash && req.flash("notice", "Classification added successfully!");
        return res.render("./inventory/management", {
          title: "Classification item Added",
          nav,
          message,
          errors: null,
        });
      } else {
        console.log("Classification not added");
        return;
      }
    } else {
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: null,
        errors: ["Failed to add classification. Please try again."],
      });
    }
  } catch (error) {
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: null,
      errors: [error.message || "Database error."],
    });
  }
};

/* ***************************
 *  Deliver Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    message: [],
    errors: [],
    sticky: {},
  });
};

/* ***************************
 *  Handle Add Inventory POST
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const sticky = { ...req.body };
  const classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  );
  let errors = [];
  let message = [];
  // Server-side validation for all fields
  if (!req.body.classification_id) errors.push("Classification is required.");
  if (!req.body.inv_make) errors.push("Make is required.");
  if (!req.body.inv_model) errors.push("Model is required.");
  if (
    !req.body.inv_year ||
    isNaN(req.body.inv_year) ||
    req.body.inv_year < 1886 ||
    req.body.inv_year > 2099
  )
    errors.push("Year must be between 1886 and 2099.");
  if (!req.body.inv_description) errors.push("Description is required.");
  if (!req.body.inv_image) errors.push("Image path is required.");
  if (!req.body.inv_thumbnail) errors.push("Thumbnail path is required.");
  if (
    !req.body.inv_price ||
    isNaN(req.body.inv_price) ||
    req.body.inv_price < 0
  )
    errors.push("Price must be a positive number.");
  if (
    !req.body.inv_miles ||
    isNaN(req.body.inv_miles) ||
    req.body.inv_miles < 0
  )
    errors.push("Miles must be a positive number.");
  if (!req.body.inv_color) errors.push("Color is required.");
  if (errors.length > 0) {
    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      message: null,
      errors,
      sticky,
    });
  }
  try {
    const result = await invModel.addInventoryItem(req.body);
    nav = await utilities.getNav();
    if (result) {
      // req.flash && req.flash("notice", "Inventory item added successfully!");
      message.push("Inventory item added successfully!");
      if (message.length > 0) {
        console.log("Inventory added successfully");
        return res.render("./inventory/management", {
          title: "Inventory Item Added",
          nav,
          message,
          errors: null,
        });
      } else {
        console.log("Inventory Not Added");
        return;
      }
    } else {
      return res.render("./inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav,
        classificationList,
        message: null,
        errors: ["Failed to add inventory item. Please try again."],
        sticky,
      });
    }
  } catch (error) {
    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      message: null,
      errors: [error.message || "Database error."],
      sticky,
    });
  }
};

module.exports = invCont;
