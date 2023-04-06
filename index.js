import client from "./client.js";

import path from "path";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get all users
app.get("/", (req, res) => {
  client.getUsers(null, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
      res.status(500).send({
        error: err.message,
      });
    }
  });
});

//Get single user
app.get("/:id", (req, res) => {
  client.getUser({id: req.params.id}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
      res.status(500).send({
        error: err.message,
      });
    }
  });
});

//create a user
app.post("/save", (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  };

  client.addUser(newUser, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        error: err.message,
      });
    } else {
      res.send(data);
      console.log("User created successfully", data);
    }
  });
});


// update an existing user
app.post("/update/:id", (req, res) => {
    const updateUser = {
        id: req.params.id,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    client.update(updateUser, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({
              error: err.message,
            });
          } else {
            res.send(data);
          }
    });
});

//remove a user
app.post("/remove/:id", (req, res) => {
    client.remove({ id: req.params.id }, (err, _) => {
        if (err) {
            console.error(err);
            res.status(500).send({
              error: err.message,
            });
          } else {
            res.send("User deleted successfully")
          }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});