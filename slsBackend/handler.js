'use strict';

const pg = require('pg');
const connectionString = 'postgres://lwibphyt:a0nIOEpAPAXhtOSCeM9A4dGPTCEu0rWu@baasu.db.elephantsql.com:5432/lwibphyt';

const jwt = require('jsonwebtoken');

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign({user}, 'secret', {
    expiresIn: ONE_WEEK
  })
}

export const hello = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${(await message({ time: 1, copy: 'Your function executed successfully!'}))}`,
      input: event
    }),
  };

  callback(null, response);
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) => 
  setTimeout(() => {
    resolve(`${rest.copy} (with a delay)`);
  }, time * 1000)
);

module.exports.createNewPost = async (event, context, callback) => {

  const post = JSON.parse(event.body);

  const insertPostText = 'INSERT INTO posts(title, content, creation_date, creator_id, image) VALUES($1, $2, NOW(), $3, $4) RETURNING post_id';
  const values = [post.title, post.text, post.creator_id, post.image];

  const insertTagText = 'WITH s AS (\
      SELECT tag_id, name FROM tags WHERE name = $1\
    ), i AS (\
      INSERT INTO tags (name)\
      SELECT $1 WHERE NOT EXISTS (select 1 from s)\
      RETURNING tag_id, name\
    )\
    SELECT tag_id FROM i\
    UNION ALL\
    SELECT tag_id FROM s'

  const insertPostTagText = 'INSERT INTO post_tag(post_id, tag_id) VALUES($1, $2)'

  const pool = new pg.Pool({
    connectionString: connectionString
  });

  var tagsID = [];

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const resp = await client.query(insertPostText, values)

    for (var tag in post.tags) {
      tagsID[tagsID.length] = await client.query(insertTagText, [post.tags[tag]])
      await client.query(insertPostTagText, [resp.rows[0].post_id, tagsID[tagsID.length - 1].rows[0].tag_id])
    }

    await client.query('COMMIT')
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(resp.rows[0])
    });
  } catch (err) {
    await client.query('ROLLBACK')
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Ошибка. Не удалось добавить пост.',
      })
    });
  } finally {
    client.release()
  }
  pool.end();
};

module.exports.register = (event, context, callback) => {
  const Promise = require('bluebird');
  const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

  const user = JSON.parse(event.body);

  const SALT_FACTOR = 8

  bcrypt.genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.password = hash;
    })
    .then(sus => {
      const text = 'INSERT INTO users(name, password) VALUES($1, $2) RETURNING user_id, name';
      const values = [user.name, user.password];
      var client = new pg.Client(connectionString);
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
              token: jwtSignUser(resp.rows[0])
            })
          });
        }
      })
    })
};

module.exports.login = (event, context, callback) => {
  const Promise = require('bluebird');
  const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

  const {name, password} = JSON.parse(event.body);
  var user;

  const text = 'SELECT users.user_id, users.name, users.password FROM users WHERE users.name = $1';
  const values = [name];

  var client = new pg.Client(connectionString);
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
            token: jwtSignUser(user)
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

module.exports.findPostById = async (event, context, callback) => {
  const id = JSON.parse(event.pathParameters.id);
  
  const findPostText = 'SELECT post_id, title, content AS text, creation_date, creator_id, name AS creator_name,\
   image FROM posts, users WHERE users.user_id = posts.creator_id AND post_id = $1';
  const findTagsText = 'SELECT name FROM post_tag, tags WHERE post_tag.tag_id = tags.tag_id AND post_tag.post_id = $1';
  // const findCreatorText = 'SELECT user_id, name FROM users WHERE user_id = $1'
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };

  const pool = new pg.Pool({
    connectionString: connectionString
  });

  const client = await pool.connect();

  try {
    var resp = await client.query(findPostText, [id]);
    response.body = resp.rows[0];
    resp = await client.query(findTagsText, [id]);
    response.body.tags = resp.rows;
    // resp = await client.query(findCreatorText, [response.body.creator]);
    // response.body.creator = resp.rows[0];
    response.body = JSON.stringify(response.body);

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'Пост не найден.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};

module.exports.findUserById = async (event, context, callback) => {
  const id = JSON.parse(event.pathParameters.id);

  const findUserText = 'SELECT user_id, name, avatar FROM users WHERE user_id = $1';
  const countPostsText = 'SELECT count(post_id) FROM posts WHERE creator_id = $1';
  
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };

  const pool = new pg.Pool({
    connectionString: connectionString
  });

  const client = await pool.connect();

  try {
    var resp = await client.query(findUserText, [id]);
    response.body = resp.rows[0];
    resp = await client.query(countPostsText, [id]);
    response.body.postsCount = resp.rows[0].count;
    response.body = JSON.stringify(response.body);

    callback(null, response);
  } catch (err) {
    callback(null, {
      statusCode: 400,
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

module.exports.showPageOfPosts = async (event, context, callback) => {
  const page = JSON.parse(event.pathParameters.number);
  const limit = 10;

  const getPostsOnPageText = 'SELECT post_id, title, content AS text, creation_date, creator_id, name AS creator_name,\
  image FROM posts, users WHERE users.user_id = posts.creator_id ORDER BY post_id DESC LIMIT $1 OFFSET $2';
  const findTagsText = 'SELECT name FROM post_tag, tags WHERE post_tag.tag_id = tags.tag_id AND post_tag.post_id = $1';
  const countPostsText = 'SELECT count(post_id) FROM posts';

  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };

  const pool = new pg.Pool({
    connectionString: connectionString
  });

  const client = await pool.connect();

  try {
    var resp = await client.query(getPostsOnPageText, [limit, (page - 1) * limit]);
    response.body = {posts: resp.rows};
    resp = await client.query(countPostsText);
    response.body.numPages = Math.ceil(resp.rows[0].count / limit);
    response.body.page = page;

    for (var i = 0; i < response.body.posts.length; i++) {
      resp = await client.query(findTagsText, [response.body.posts[i].post_id]);
      response.body.posts[i].tags = resp.rows;
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
        message: 'Страница не найдена.',
      })
    });
  } finally {
    client.release();
  }
  pool.end();
};
