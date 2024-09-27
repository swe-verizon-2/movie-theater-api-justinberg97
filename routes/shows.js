const express = require("express");
const { Show, User } = require("../models/index");
const { check, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const shows = await Show.findAll();
    res.json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const number = req.params.id;
    const show = await Show.findByPk(number);
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ error: "No Show with this ID" });
    }
  } catch (error) {
    console.error("Error finding Show by ID", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/users", async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id, { include: User });
    if (show) {
      res.json(show.users);
    } else {
      res.status(404).json({ error: "This user has not seen any shows" });
    }
  } catch (error) {
    console.error("Error finding Users by Shows", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// update this. add available and title property
//
router.put(
  "/:id/available",
  [check("available").isBoolean(), check("title").isLength({ max: 25 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const show = await Show.findByPk(req.params.id);
      if (show) {
        show.available = !show.available;
        await show.save();
        res.status(200).json(show);
      } else {
        res.status(404).json({ message: "Cannot update the show" });
      }
    } catch (error) {
      console.error("Error updating show avaliability", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id);
    if (show) {
      await show.destroy();
      res.status(200).json({ message: "Show deleted" });
    } else {
      res.status(404).json({ message: "Show not found so cannot be deleted" });
    }
  } catch (error) {
    console.error("Error deleting show", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/genre/genre", async (req, res) => {
  try {
    const shows = await Show.findAll({
      where: { genre: req.query.genre },
    });
    res.json(shows);
  } catch (error) {
    console.error("Error finding shows based on genre selection", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

// const user = await User.findByPk(req.params.id, { include: Show });