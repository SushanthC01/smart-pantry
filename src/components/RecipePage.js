import React, { useState } from "react";
import axios from "axios";

function RecipePage() {
  const [inventory, setInventory] = useState(["Milk", "Eggs", "Flour"]);
  const [recipe, setRecipe] = useState("");

  const getRecipe = async () => {
    const res = await axios.post("/api/recipe", { inventory });
    setRecipe(res.data.recipe);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Make Me a Recipe</h1>
      <button onClick={getRecipe}>Get Recipe</button>
      <p>{recipe}</p>
    </div>
  );
}

export default RecipePage;
