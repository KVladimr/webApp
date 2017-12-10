'use strict';

const pg = require('pg');
const config = require('./config/config');
const jwtFunctions = require('./supportFunctions/jwtFunctions');

module.exports.createNewPost = async (event, context, callback) => {
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
  
    const post = JSON.parse(event.body);
  
    const insertPostText = 'INSERT INTO posts(title, content, creation_date, creator_id, image) VALUES($1, $2, NOW(), $3, $4) RETURNING post_id';
    const values = [post.title, post.text, userID, post.image];
  
    const insertTagText = 'WITH s AS (\
        SELECT tag_id, name FROM tags WHERE name = $1\
      ), i AS (\
        INSERT INTO tags (name)\
        SELECT $1 WHERE NOT EXISTS (select 1 from s)\
        RETURNING tag_id, name\
      )\
      SELECT tag_id FROM i\
      UNION ALL\
      SELECT tag_id FROM s';
    const insertPostTagText = 'INSERT INTO post_tag(post_id, tag_id) VALUES($1, $2)';
  
    const pool = new pg.Pool({
      connectionString: config.connectionString
    });
  
    var tagsID = [];
  
    const client = await pool.connect();
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

  module.exports.findPostById = async (event, context, callback) => {
    const id = JSON.parse(event.pathParameters.id);
    
    const findPostText = 'SELECT post_id, title, content AS text, posts.creation_date, creator_id, name AS creator_name,\
     image FROM posts, users WHERE users.user_id = posts.creator_id AND post_id = $1';
    const findTagsText = 'SELECT name FROM post_tag, tags WHERE post_tag.tag_id = tags.tag_id AND post_tag.post_id = $1';
    var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  
    const pool = new pg.Pool({
      connectionString: config.connectionString
    });
  
    const client = await pool.connect();
  
    try {
      var resp = await client.query(findPostText, [id]);
      response.body = resp.rows[0];
      resp = await client.query(findTagsText, [id]);
      response.body.tags = resp.rows;
      response.body = JSON.stringify(response.body); 
      callback(null, response);
    } catch (err) {
      callback(null, {
        statusCode: 404,
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

  module.exports.showPageOfPosts = async (event, context, callback) => {
    const page = JSON.parse(event.pathParameters.number);
    const params = event.queryStringParameters;
    const limit = 10;
    const tag = params ? params.tag : null
  
    const getPostsOnPageText = 'SELECT post_id, title, content AS text, posts.creation_date, creator_id, name AS creator_name,\
    image FROM posts, users WHERE users.user_id = posts.creator_id ORDER BY post_id DESC LIMIT $1 OFFSET $2';
    const countPostsText = 'SELECT count(post_id) FROM posts';
  
    const getPostsOnPageWithTagText = 'SELECT posts.post_id, title, content AS text, posts.creation_date, creator_id,\
    users.name AS creator_name, image FROM posts, users, post_tag, tags WHERE users.user_id = posts.creator_id\
    AND posts.post_id = post_tag.post_id AND post_tag.tag_id = tags.tag_id AND tags.name = $1 ORDER BY post_id DESC LIMIT $2 OFFSET $3';
    const countPostsWithTagText = 'SELECT count(posts.post_id) FROM posts, post_tag, tags WHERE posts.post_id = post_tag.post_id\
    AND post_tag.tag_id = tags.tag_id AND tags.name = $1';
  
    const findTagsText = 'SELECT name FROM post_tag, tags WHERE post_tag.tag_id = tags.tag_id AND post_tag.post_id = $1';
  
    var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  
    const pool = new pg.Pool({
      connectionString: config.connectionString
    });
  
    const client = await pool.connect();
  
    try {
      var resp;
      if (tag) {
        resp = await client.query(getPostsOnPageWithTagText, [tag, limit, (page - 1) * limit]);
        response.body = {posts: resp.rows};
        resp = await client.query(countPostsWithTagText, [tag]);
        response.body.numPages = Math.ceil(resp.rows[0].count / limit);
      } else {
        resp = await client.query(getPostsOnPageText, [limit, (page - 1) * limit]);
        response.body = {posts: resp.rows};
        resp = await client.query(countPostsText);
        response.body.numPages = Math.ceil(resp.rows[0].count / limit);
      }
  
      for (var i = 0; i < response.body.posts.length; i++) {
        resp = await client.query(findTagsText, [response.body.posts[i].post_id]);
        response.body.posts[i].tags = resp.rows;
      }
  
      response.body = JSON.stringify(response.body);  
      callback(null, response);
    } catch (err) {
      callback(null, {
        statusCode: 400,
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

  module.exports.getFrequentTags = async (event, context, callback) => {    
    const getFrequentTagsText = 'SELECT count(tags.tag_id), tags.name FROM post_tag, tags\
    WHERE post_tag.tag_id = tags.tag_id GROUP BY tags.tag_id ORDER BY count DESC LIMIT 15;';
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
      var resp = await client.query(getFrequentTagsText);
      response.body.tags = resp.rows;
      response.body = JSON.stringify(response.body); 
      callback(null, response);
    } catch (err) {
      callback(null, {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          message: 'Не удалось получить список тегов.',
        })
      });
    } finally {
      client.release();
    }
    pool.end();
  };
