const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

//
//Controllers
//
const { UserController } = require("./controllers/UserController");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes
app.post("/api/user/signin", UserController.signIn);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
