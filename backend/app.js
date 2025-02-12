const express = require('express');
const app = express();
const PORT= 5000;

app.listen(port, () => {
  console.log(`backend server running at http://localhost:${PORT}`);
});