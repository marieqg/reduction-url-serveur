const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/url", {
  useNewUrlParser: true
});

const Address = mongoose.model("Address", {
  longUrl: {
    type: String,
    unique: true,
    required: true
  },
  shortUrl: {
    type: String
  },
  counter: {
    type: Number
  },
  keyUrl: {
    type: String
  }
});

// CREATE

app.post("/create", async (req, res) => {
  try {
    // condition 1, creation uniquement si addresse envoyée en paramètre

    if (req.body.url) {
      for (let i = 0; i < req.body.length; i++) {
        console.log("hello");
      }
      const randomStr = uid2(5);
      const newAddress = new Address({
        longUrl: req.body.url,
        shortUrl: `https://short-url-marie-quittelier.herokuapp.com/${randomStr}`,
        counter: 0,
        keyUrl: randomStr
      });
      await newAddress.save();
      return res.json({ message: "Success!" });
    } else {
      return res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: { message: "L'URL a déjà été utilisée" } });
  }
});

// READ

app.get("/", async (req, res) => {
  try {
    const addresses = await Address.find();
    return res.json(addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ & REDIRECT

app.get("/:keyUrl", async (req, res) => {
  try {
    const address = await Address.findOne({ keyUrl: req.params.keyUrl });
    if (address) {
      address.counter = address.counter + 1;
      await address.save();
      return res.redirect(address.longUrl);
    } else {
      return res.status(400).json({ error: { message: "L'URL n'existe pas" } });
    }
  } catch (error) {
    return res.status(400).json({ error: { message: error.message } });
  }
});

// UPDATE

app.post("/update", async (req, res) => {
  try {
    const address = await Address.findById(req.body.id);
    if (address) {
      address.counter += 1;
      await address.save();
      return res.json({ message: "Success!" });
    } else {
      return res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
