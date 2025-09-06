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
const { SellController } = require("./controllers/SellController");
const { ServiceController } = require("./controllers/ServiceController");

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
app.get("/api/user/info", UserController.info); 
app.put("/api/user/update/", UserController.update);
app.get("/api/user/list", UserController.list);
app.post("/api/user/create", UserController.create);
app.put("/api/user/update/:id", UserController.updateRow);
app.delete("/api/user/remove/:id", UserController.remove);

//
//Company
//
app.post("/api/company/create", CompanyController.create);
app.get("/api/company/list", CompanyController.list);

//
//buy
//
app.post("/api/buy/create", ProductController.create);
app.get("/api/buy/list", ProductController.list); //กรณีเป็นสินค้ามือสอง
app.put("/api/buy/update/:id", ProductController.update);
app.delete("/api/buy/remove/:id", ProductController.remove); //ลบแบบ soft delete

//
//sell
//
app.post("/api/sell/create", SellController.create);
app.get("/api/sell/list", SellController.list);
app.delete("/api/sell/remove/:id", SellController.remove);
app.get("/api/sell/confirm", SellController.confirm);
app.get("/api/sell/dashboard", SellController.dashboard);

//
//service
//
app.post("/api/service/create", ServiceController.create);
app.get("/api/service/list", ServiceController.list);
app.put("/api/service/update/:id", ServiceController.update);
app.delete("/api/service/remove/:id", ServiceController.remove);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
