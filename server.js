const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

//
//Controllers
//
const { UserController } = require("./controllers/UserController");
const { CompanyController } = require("./controllers/CompanyContoller");
const { ProductController } = require("./controllers/PoductController");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes

//
//User
//
app.post("/api/user/signin", UserController.signIn);

//
//Company
//
app.post("/api/company/create", CompanyController.create);
app.get("/api/company/list", CompanyController.list);

//
//buy
//
app.post("/api/buy/create", ProductController.create);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
