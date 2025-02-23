const express = require("express");

const router = express.Router();

router.get("/temp1", async (req, res) => {
  res.json({ message: "You successfully called this route in the backend" });
});

module.exports = router;
