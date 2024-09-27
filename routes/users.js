const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { User } = require("../models/index");
const { Show } = require("../models/index");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const number = req.params.id;
    const user = await User.findByPk(number);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "No User with this ID" });
    }
  } catch (error) {
    console.error("Error finding User by ID", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/shows", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Show });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User has not seen any shows" });
    }
  } catch (error) {
    console.error("Error finding shows User has watched", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/",

  [
    check("username").isEmail().withMessage("Username must be an email"),
    check("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id/shows/:showId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.showId);

    if (user && show) {
      await user.addShow(show);
      const updatedUser = await User.findByPk(req.params.id, { include: Show });

      res.status(200).json({ message: "Show was successfully added" , updatedUser });
    } else {
      res.status(404).json({ message: "Cannot find the user or the show" });
    }
  } catch (error) {
    console.error("Error finding shows User has watched", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;