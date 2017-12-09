'use strict';

const pg = require('pg');
const config = require('./config/config');
const jwtFunctions = require('./supportFunctions/jwtFunctions');

module.exports.findUserById = async (event, context, callback) => {
  const token = event.headers.Authorization;
  const userID = await jwtFunctions.jwtAuthentication(token);
  const id = JSON.parse(event.pathParameters.id);

  const findUserText = 'SELECT user_id, name, avatar, creation_date FROM users WHERE user_id = $1';
  const countPostsText = 'SELECT count(post_id) FROM posts WHERE creator_id = $1';
  const findNotesText = 'SELECT content FROM notes WHERE creator_id = $1 AND target_id = $2';  
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: {}
  };

  const pool = new pg.Pool({
    connectionString: config.connectionString
  });

  const client = await pool.connect();

  try {
    var resp = await client.query(findUserText, [id]);
    response.body.user = resp.rows[0];
    resp = await client.query(countPostsText, [id]);
    response.body.user.postsCount = resp.rows[0].count;
    if (userID && userID !== id) {
      resp = await client.query(findNotesText, [userID, id]);
      response.body.note = {
        notetext: resp.rows.length > 0 ? resp.rows[0].content : ''
      };
    }
    response.body = JSON.stringify(response.body);
    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Такого пользователя не существует.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};

module.exports.updateUserInfo = async (event, context, callback) => {
  const token = event.headers.Authorization;
  const userID = await jwtFunctions.jwtAuthentication(token);

  if (!userID) {
    callback(null, {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Доступ запрещён.',
      })
    });
    return;
  }

  const user = JSON.parse(event.body); 
  const deleteNoteText = 'UPDATE users SET avatar = $1 WHERE user_id = $2';   
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: {}
  };

  const pool = new pg.Pool({
    connectionString: config.connectionString
  });

  const client = await pool.connect();

  try {
    await client.query(deleteNoteText, [user.avatar, userID]);
    response.body = JSON.stringify({
      message: 'Информация о пользователе обновлена.',
    });

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Ошибка при обновлении информации о пользователе.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};
