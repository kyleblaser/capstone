/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static("public/images"));

app.post("/api/log-combat-event", (req, res) => {
  const combatLog = req.body;
  const logEntry = JSON.stringify(combatLog) + "\n";

  fs.appendFile("combat_logs.txt", logEntry, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Error logging event");
    }
    console.log("Logged:", logEntry);
    res.status(200).send("Log received");
  });
});

app.post("/api/clear-combat-log", (req, res) => {
  fs.writeFile("combat_logs.txt", "", (err) => {
    if (err) {
      console.error("Error clearing combat log:", err);
      return res.status(500).send("Error clearing combat log");
    }
    console.log("Combat log cleared");
    res.status(200).send("Combat log cleared");
  });
});

app.get("/api/combat-log", (req, res) => {
  fs.readFile("combat_logs.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading combat log file:", err);
      return res.status(500).send("Error reading combat log");
    }

    const lines = data.trim().split("\n");
    const lastFourLines = lines
      .slice(-4)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (parseError) {
          console.error("Error parsing line:", parseError);
          return null;
        }
      })
      .filter((line) => line !== null);

    res.json(lastFourLines);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
