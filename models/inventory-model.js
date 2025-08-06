const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/*********** Get the inventory search result *************/
// This function searches for inventory items by make and also the classification name (case-insensitive).
// Returns an array of matching rows, or an empty array if none found.
async function getInvSearchResult(searchTerm, searchTerm) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_make ILIKE $1 OR c.classification_name ILIKE $2`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return result.rows;
  } catch (error) {
    console.error("Get inventory search error:", error);
    return [];
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Unable to add classification: " + error.message);
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventoryItem(data) {
  try {
    const sql = `INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Unable to add inventory item: " + error.message);
  }
}

module.exports = {
  getClassifications,
  getInvSearchResult,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventoryItem,
};
