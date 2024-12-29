const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serial Port Configuration
const port = new SerialPort({
  path: "/dev/cu.usbmodem142201", // Replace with your Arduino's port
  baudRate: 9600,
});
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Sensor Data Storage
let sensorData = {
  doorStatus: "Closed",
  temperature: 0,
  shelf1Status: "Empty",
  shelf2Status: "Empty",
};

// Handle incoming data from Arduino
parser.on("data", (line) => {
  console.log("Received from Arduino:", line);
  const [key, value] = line.trim().split(":");
  switch (key) {
    case "Door Status":
      sensorData.doorStatus = value;
      break;
    case "Temperature":
      sensorData.temperature = parseFloat(value);
      break;
    case "Shelf1":
      sensorData.shelf1Status = value === "1" ? "Occupied" : "Empty";
      break;
    case "Shelf2":
      sensorData.shelf2Status = value === "1" ? "Occupied" : "Empty";
      break;
    default:
      console.log("Unknown data:", line);
  }
});

// Routes
app.get("/api/sensors", (req, res) => {
  res.json(sensorData);
});

app.post("/api/add-item", (req, res) => {
  const { shelf, item } = req.body;
  if (!shelf || !item) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const command = `${shelf}:${item}\n`; // Example format: "Shelf1:Milk"
  port.write(command, (err) => {
    if (err) {
      console.error("Error sending data to Arduino:", err);
      return res.status(500).json({ error: "Failed to send data to Arduino" });
    }
    console.log(`Sent to Arduino: ${command}`);
    res.json({ success: true });
  });
});

app.post("/api/recipe", async (req, res) => {
  const { inventory } = req.body;

  if (!inventory || !Array.isArray(inventory)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const prompt = `Suggest recipes based on these pantry items: ${inventory.join(
    ", "
  )}. Provide step-by-step instructions.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
      }
    );

    res.json({ recipe: response.data.choices[0].text });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
