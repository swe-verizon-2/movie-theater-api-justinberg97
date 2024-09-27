const express = require ("express");
const userRoutes = require('../routes/users');
const showRoutes = require('../routes/shows');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoutes);
app.use('/shows', showRoutes);

module.exports = app;