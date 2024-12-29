import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddItemPage from "./components/AddItemPage";
import RecipePage from "./components/RecipePage";

function App() {
  return (
    <Router>
      
        <Route path="/" exact component={HomePage} />
        <Route path="/add-item" component={AddItemPage} />
        <Route path="/recipe" component={RecipePage} />
      
    </Router>
  );
}

export default App;
