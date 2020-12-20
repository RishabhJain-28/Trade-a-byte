import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Transaction from "./Pages/Transaction";
import Login from "./Pages/Login";
import Team from "./Pages/Team";
import ErrorPage from "./Pages/Error";
import AdminPage from "./Pages/AdminPage";
import "./Components/animation/stars";
function App() {
  // return <Transaction />;
  return (
    <div className="App">
      <Switch>
        <Route path="/team" component={Team} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/error" component={ErrorPage} />
        <Route exact path="/" component={Login} />
      </Switch>
      {/* <Dashboard /> */}
      {/* <Transaction /> */}
    </div>
  );
}

export default App;
