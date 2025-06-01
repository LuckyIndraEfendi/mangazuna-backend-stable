const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET",
  })
);
app.use(express.json());

app.use("/api/v1", require("./src/routes/manga-maid"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
