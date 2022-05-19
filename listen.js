const app = require("./app");

const { PORT = 2202 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
  }
)
