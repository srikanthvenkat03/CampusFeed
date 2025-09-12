require("dotenv").config(); // add this at the very top
const express = require("express");
const cors = require("cors");
const postsRouter = require("./routes/posts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
