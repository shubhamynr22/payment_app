const express = require('express');
const cors = require('cors');
const rootRouter = require('./routes/index');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
