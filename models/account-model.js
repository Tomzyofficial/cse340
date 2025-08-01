const pool = require("../database");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

// Get account by id
async function getAccountById(account_id) {
  const data = await pool.query(
    "SELECT * FROM public.account WHERE account_id = $1",
    [account_id]
  );
  return data.rows[0];
}

// Get account by email
async function getAccountByEmail(account_email) {
  const data = await pool.query(
    "SELECT * FROM public.account WHERE account_email = $1",
    [account_email]
  );
  return data.rows[0];
}

// Update account info
async function updateAccountInfo(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE public.account
    SET account_firstname = $1, account_lastname = $2, account_email = $3
    WHERE account_id = $4
    RETURNING *`;
  const data = await pool.query(sql, [firstname, lastname, email, account_id]);
  return data.rows[0];
}

// Update password
async function updateAccountPassword(account_id, hash) {
  const sql = `
    UPDATE public.account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *`;
  const data = await pool.query(sql, [hash, account_id]);
  return data.rows[0];
}

// Sign up user
async function signupUser(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, SALT_ROUNDS);
    const insertQuery =
      "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    const querySql = await pool.query(insertQuery, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
      "Employee", // Default account type
    ]);

    if (!querySql) throw new Error("Failed to insert into database");
    return querySql.rows[0];
  } catch (err) {
    throw new Error("Unable to insert user: " + err.message);
  }
}

// Log in user
async function loginUser(account_email, account_password) {
  try {
    const query = "SELECT * FROM public.account WHERE account_email = $1";
    const result = await pool.query(query, [account_email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(
        account_password,
        user.account_password
      );
      if (match) {
        return user;
      }
    }
    return null;
  } catch (err) {
    throw new Error("Unable to login user: " + err.message);
  }
}

module.exports = {
  signupUser,
  loginUser,
  getAccountById,
  getAccountByEmail,
  updateAccountInfo,
  updateAccountPassword,
};
