import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [sensors, setSensors] = useState({
    doorStatus: "Closed",
    temperature: 0,
    shelf1Status: "Empty",
    shelf2Status: "Empty",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/sensors");
      setSensors(res.data);
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Pantry System</h1>
      <p>Door Status: {sensors.doorStatus}</p>
      <p>Temperature: {sensors.temperature} °C</p>
      <p>Shelf 1: {sensors.shelf1Status}</p>
      <p>Shelf 2: {sensors.shelf2Status}</p>
      <Link to="/add-item">
        <button>Add Item to Pantry</button>
      </Link>
      <Link to="/make-recipe">
        <button>Make Me a Recipe</button>
      </Link>
    </div>
  );
}

export default HomePage;
