const express = require('express');
const cors = require('cors');
require('./event_db'); // establishes the MySQL connection pool

const app = express();

app.use(cors());        // allow cross-origin requests from the client site
app.use(express.json());

app.use('/api/events',     require('./routes/events'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => res.send('Charity Events API is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
