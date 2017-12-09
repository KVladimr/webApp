'use strict';

const pg = require('pg');
const config = require('./config/config');
const jwtFunctions = require('./supportFunctions/jwtFunctions');

module.exports.saveNote = async (event, context, callback) => {
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

  const note = JSON.parse(event.body);
  const saveOrUpdateNoteText = 'INSERT INTO notes (creator_id, content, target_id) VALUES ($1, $2, $3)\
  ON CONFLICT (creator_id, target_id) DO UPDATE SET content = $2 RETURNING content AS notetext';  
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
    var resp = await client.query(saveOrUpdateNoteText, [userID, note.content, note.targetId]);
    response.body = resp.rows[0];
    response.body = JSON.stringify(response.body);

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Не удалось добавить заметку.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};

module.exports.deleteNote = async (event, context, callback) => {
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
  const target_id = JSON.parse(event.pathParameters.number);
  const deleteNoteText = 'DELETE FROM notes WHERE creator_id = $1 AND target_id = $2';  
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
    await client.query(deleteNoteText, [userID, target_id]);
    response.body = JSON.stringify({
      message: 'Заметка удалена.',
    });

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Не удалось удалить заметку.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};
