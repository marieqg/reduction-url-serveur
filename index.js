const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uid2 = require("uid2");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/", { useNewUrlParser: true });

const Address = mongoose.model("Address", {
  longUrl: {
    type: String
  },
  shortUrl: {
    type: String
  }
});

// Create

app.post("/create", async (req, res) => {
  try {
    if (req.body.url) {
      const newAddress = new Address({
        longUrl: req.body.url,
        shortUrl: uid2(5)
      });
      await newAddress.save();
      res.json({ message: "Success!" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read

app.get("/", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
