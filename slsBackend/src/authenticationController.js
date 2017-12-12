'use strict';

const pg = require('pg');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
const config = require('./config/config');
const jwtFunctions = require('./supportFunctions/jwtFunctions');
const Joi = require('joi');

module.exports.register = (event, context, callback) => {
  const user = JSON.parse(event.body);
  const schema = {
    name: Joi.string().regex(
      new RegExp('^[a-zA-Z0-9]{4,20}$')
    ),
    password: Joi.string().regex(
      new RegExp('^[a-zA-Z0-9]{5,32}$')
    )
  };

  const result = Joi.validate(user, schema);
  if (result.error) {
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: 'Неверный формат данных',
      })
    });
    return;
  }

  const SALT_FACTOR = 8

  bcrypt.genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.password = hash;
    })
    .then(sus => {
      const text = 'INSERT INTO users(name, password, creation_date) VALUES($1, $2, NOW()) RETURNING user_id, name';
      const values = [user.name, user.password];
      var client = new pg.Client(config.connectionString);
      client.connect();
      client.query(text, values, (err, resp) => {
        if (err) {
          client.end();
          callback(null, {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              error: 'ошибка регистрации',
            })
          });
        } else {
          client.end();
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              user: resp.rows[0],
              token: jwtFunctions.jwtSignUser(resp.rows[0])
            })
          });
        }
      })
    })
};

module.exports.login = (event, context, callback) => {
  const {name, password} = JSON.parse(event.body);
  var user;

  const text = 'SELECT users.user_id, users.name, users.password FROM users WHERE users.name = $1';
  const values = [name];

  var client = new pg.Client(config.connectionString);
  client.connect();

  client.query(text, values, (err, resp) => {
    try {
      if (err) {
        throw err;
      } else {
        client.end();
        user = resp.rows[0];
        if (!user) {
          callback(null, {
            statusCode: 403,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              error: 'Введены неверные данные',
            })
          });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
          callback(null, {
            statusCode: 403,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              error: 'Введены неверные данные',
            })
          });
        }
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({
            user: {
              user_id: user.user_id,
              name: user.name
            },
            token: jwtFunctions.jwtSignUser(user)
          })
        });
      }
    } catch (err) {
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: 'Ошибка при попытке входа',
        })
      });
    }
  });
};
