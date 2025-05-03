const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { Todo } = require('./mongo');
const { setAsync } = require('./redis');

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const statisticsRouter = require('./routes/statistics');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);
app.use('/statistics', statisticsRouter);
/*
(async () => {
  const added_todos = await Todo.countDocuments();
  await setAsync('added_todos', added_todos);
  console.log('Added todos:', added_todos);
})();
*/

module.exports = app;
