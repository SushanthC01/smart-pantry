import React, { useState } from "react";
import axios from "axios";

function AddItemPage() {
  const [item, setItem] = useState("");
  const [shelf, setShelf] = useState("Shelf1");

  const addItem = async () => {
    await axios.post("/api/add-item", { shelf, item });
    alert(`Item "${item}" added to ${shelf}`);
    setItem("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Item to Pantry</h1>
      <select value={shelf} onChange={(e) => setShelf(e.target.value)}>
        <option value="Shelf1">Shelf 1</option>
        <option value="Shelf2">Shelf 2</option>
      </select>
      <input
        type="text"
        placeholder="Item Name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

export default AddItemPage;
