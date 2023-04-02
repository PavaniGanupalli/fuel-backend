const express = require("express");
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
