const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const dbName = "fuel";
const collectionName = "users";
const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // This will parse incoming request body as JSON

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting Data Base And Node JS

const url =
  "mongodb+srv://pavani:EnQF3VACSJR8wOGc@fuelcluster.hsukpl1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

const main = async () => {
  try {
    await client.connect();
    console.log("Connection Success");
    // await dataBasesLists(client);
  } catch (e) {
    console.log(e);
  }
};

main();

// Registration API
app.post("/register", async (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    password: req.body.password,
    city: req.body.city,
    country: req.body.country,
  };

  const result = await client
    .db(dbName)
    .collection(collectionName)
    .insertOne(user);
  console.log("User Details Registered Successfully");

  const success = {
    status: 200,
    description: "Success",
  };
  res.header("Access-Control-Allow-Origin", "*");
  res.json(success);
});

// Login API
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const login = await client
    .db(dbName)
    .collection(collectionName)
    .findOne({ email: email, password: password });
  if (login) {
    res.header("Access-Control-Allow-Origin", "*");

    const success = {
      status: 200,
      description: "Success",
    };
    res.json(success);
    console.log("Login Success");
  } else {
    const failed = {
      status: 500,
      description: "Failed",
    };
    res.header("Access-Control-Allow-Origin", "*");

    res.json(failed);
    console.log("Login failed");
  }
});

app.listen(3001, () => {
  console.log("Server listening on port 3002");
});

// Test API
app.get("/", (req, res) => {
  console.log("Test API");

  res.header("Access-Control-Allow-Origin", "*");
  res.send("Test API is Working fine!");
});
// Define Order schema
// const orderSchema = new mongoose.Schema({
//   state: { type: String, required: true },
//   district: { type: String, required: true },
//   city: { type: String, required: true },
//   address: { type: String, required: true },
//   fueltype: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   deliverydate: { type: Date, required: true },
//   paymentmethod: { type: String, required: true },
// }, { timestamps: true });

// Define Order model
// const Order = mongoose.model('Order', orderSchema);

// Define API endpoint to add new order
// app.post('/api/orders', async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).send(order);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// });

// Define API endpoint to get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/orders-test", (req, res) => {
res.send("Orders api is working fine")});


app.post('/api/placeorder', async (req, res) => {
  const order = {
    state: req.body.state,
    district: req.body.district,
    city: req.body.city,
    address: req.body.address,
    fueltype: req.body.fueltype,
    quantity: req.body.quantity,
    deliverydate: new Date(req.body.deliverydate),
    paymentmethod: req.body.paymentmethod,
  };
  const ordersCollection = await client
    .db(dbName).collection('orders');
  ordersCollection.insertOne(order, (err, result) => {
    if (!ordersCollection){
      res.header("Access-Control-Allow-Origin", "*");
      console.error('Error inserting order:', err);
      res.status(500).send('Server error');
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.status(201).send(order);
    }
  });
});

