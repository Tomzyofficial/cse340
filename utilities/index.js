const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul id='nav_ul'>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error in getNav:", error);
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  try {
    let grid = "";
    if (data && data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach((vehicle) => {
        grid += "<li>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><img src="' +
          vehicle.inv_thumbnail +
          '" alt="Image of ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' on CSE Motors"></a>';
        grid += '<div class="namePrice">';
        grid += "<hr>";
        grid += "<h2>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details">' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          "</a>";
        grid += "</h2>";
        grid +=
          "<span>$" +
          new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
          "</span>";
        grid += "</div>";
        grid += "</li>";
      });
      grid += "</ul>";
    } else {
      grid =
        '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  } catch (error) {
    console.error("Error in buildClassificationGrid:", error);
    return '<p class="notice">Sorry, there was an error displaying the vehicle grid.</p>';
  }
};

/************* Build each inventory detail view ************* */
Util.buildInventoryDetail = async function (vehicle) {
  try {
    let detail = "";
    if (!vehicle) {
      return '<p class="notice">Sorry, no vehicle details are available.</p>';
    }

    detail = '<div id="container">';
    detail +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      '">';
    detail += "<div>";
    detail += "<p>Make: " + vehicle.inv_make + "</p>";
    detail += "<p>Model: " + vehicle.inv_model + "</p>";
    detail += "<p>year: " + vehicle.inv_year + "</p>";
    detail +=
      "<p>Price: $" +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      "</p>";
    detail += "<p>Color: " + vehicle.inv_color + "</p>";
    detail +=
      "<p>Mileage: " +
      new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
      " miles</p>";
    detail += "<p>Description: " + vehicle.inv_description + "</p>";
    detail += "</div>";
    detail += "</div>";
    return detail;
  } catch (error) {
    console.error("Error in buildInventoryDetail:", error);
    return '<p class="notice">Sorry, there was an error displaying vehicle details.</p>';
  }
};

/******* Build Classification Select List ******** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/*************** Build inventory search result view  ****************/
Util.buildSearchView = async function (data) {
  try {
    let grid = "";
    if (data && data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach((vehicle) => {
        grid += "<li>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><img src="' +
          vehicle.inv_thumbnail +
          '" alt="Image of ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' on CSE Motors"></a>';
        grid += '<div class="namePrice">';
        grid += "<hr>";
        grid += "<h2>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details">' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          "</a>";
        grid += "</h2>";
        grid +=
          "<span>$" +
          new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
          "</span>";
        grid += "</div>";
        grid += "</li>";
      });
      grid += "</ul>";
    } else {
      grid =
        '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  } catch (error) {
    console.error("Error in buildClassificationGrid:", error);
    return '<p class="notice">Sorry, there was an error displaying the vehicle grid.</p>';
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
