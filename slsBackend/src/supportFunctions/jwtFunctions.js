const jwt = require('jsonwebtoken');
const config = require('../config/config');
const pg = require('pg');

module.exports = {
  jwtSignUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign({user}, config.jwtSecret, {
      expiresIn: ONE_WEEK
    })
  },

  async jwtAuthentication (token) {
    if (!token) {
      return undefined;
    }
    var userID;
    const pool = new pg.Pool({
      connectionString: config.connectionString
    });
    const client = await pool.connect();
    try {
      const jwtuser = jwt.verify(token, config.jwtSecret);
      const resp = await client.query('SELECT user_id FROM users WHERE user_id = $1', [jwtuser.user.user_id]);
      userID = resp.rows[0].user_id;
    } catch (err) {
      userID = undefined;
    } finally {
      client.release();
    }
    pool.end();
    return userID;
  }
}