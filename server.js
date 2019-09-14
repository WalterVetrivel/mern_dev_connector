const express = require('express');

const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const app = express();
connectDB();

app.get('/', (req, res) => res.end('API Working'));

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
