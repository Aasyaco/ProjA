const express = require('express');
const apiRoutes = require('./api/index.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
