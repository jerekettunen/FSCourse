const express = require('express');
const router = express.Router();
const { getAsync } = require('../redis');
const app = require('../app');


/* GET statistics. */
router.get('/', async (_, res) => {
  const added_todos = parseInt(await getAsync('added_todos'), 10) || 0;
  res.send({
    added_todos
  });
});

module.exports = router;