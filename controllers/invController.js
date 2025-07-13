const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  if (!data || data.length === 0) {
    let nav = await utilities.getNav()
    res.render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">Sorry, no vehicles could be found for this classification.</p>',
    })
    return
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid, 
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  
  if (!data) {
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: "Vehicle Not Found",
      nav,
      vehicle: '<p class="notice">Sorry, no vehicle details are available.</p>',
    })
    return
  }
  
  const vehicle = await utilities.buildInventoryDetail(data)

  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicle,
  })

}

module.exports = invCont
