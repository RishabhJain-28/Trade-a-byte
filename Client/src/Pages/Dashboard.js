import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Redirect, Route, Switch } from "react-router-dom";
import { Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "../util/axios";

import Dashboardnavbar from "../Components/Dashboardnavbar";
import Trading from "../Components/Trade/Trading";
import TradeHistory from "../Components/Trade/TradeHistory";
import Tradestart from "../Components/Trade/Tradestart";
// import TradeInfo from "../Components/Trade/TradeInfo";
import Questions from "../Components/Dashboard/Questions";
import Inventory from "../Components/Dashboard/Inventory";
import Market from "../Components/Dashboard/Market";
import Dashmain from "../Components/Dashmain";

import "../assets/css/codeTradeDashboard.css";

function Dashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [socket, setSocket] = useState();
  const [code, setCode] = useState();
  // const [pending, setPending] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [updateTransaction, setUpdateTransaction] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          setLoading(false);
          return setUser(user);
        }
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/participant/profile`
        );
        setLoading(false);
        setUser(data);
        // console.log("user", user);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        setRedirect(true);
      }
    }
    if (!user._id) getProfile();
  }, []);

  useEffect(() => {
    if (!user._id) return;

    setSocket(
      io.connect(process.env.REACT_APP_BASE_URL, {
        query: { token: user.teams[0]._id },
      })
    );
  }, [user]);
  // useEffect(() => {
  //   if (user.teams && user.teams[0]) {
  //     axios.defaults.headers.common["x-team-id"] = user.teams[0]._id;
  //   }
  // }, [user]);

  useEffect(() => {
    if (!socket) return;
    // console.log(socket);
    socket.on("push_message", ({ type, data, status }) => {
      // console.log("MSSSG-data: ", data);
      // console.log("MSSSG-type: ", type);

      if (type === 1) {
        setAlert({
          title: "NEW OFFER",
          message: `New trade offer from team ${data.from.name}`,
          severity: "info",
        });
        setOpen(true);
        console.log("updated tran", data);
        setUpdateTransaction(data);
        console.log("OFFER");
        //! cause refetch
      } else if (type === 2) {
        setAlert({
          title: `OFFER ${status}`,
          message: `A trade offer was ${status.toLowerCase()} by the team ${
            data.to.name
          }`,
          severity: status === "ACCEPTED" ? "success" : "error",
        });
        setOpen(true);
        console.log("updated tran", data);
        setUpdateTransaction(data);
        console.log("OFFER");
      } else if (type === 4) {
        setAlert({
          title: "OFFER CANCELED",
          message: `A trade offer was canceled by the team ${data.from.name}`,
          severity: "warning",
        });
        setOpen(true);
        console.log("updated tran", data);
        setUpdateTransaction(data);
        console.log("OFFER");
      } else if (type === 20) {
        // console.log("news", data);
        setAlert({
          title: `News flashed`,
          message: `new news check the dashboard`,
          severity: "info",
        });
        setOpen(true);
      }
    });
  }, [socket]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (redirect) return <Redirect to="/" />;
  if (loading) return <div>LOADING....................</div>;
  return (
    <div>
      {/* <h2>id</h2>
      <input
        onChange={(e) => setUser({ id: e.target.value })}
        value={user.id}
      ></input> */}
      <Dashboardnavbar user={user} />

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant="filled" severity={alert.severity}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>

      <Switch>
        <Route exact path="/dashboard/questions" component={Questions} />
        <Route exact path="/dashboard/tradestart" component={Tradestart} />
        <Route exact path="/dashboard/trading" component={Trading} />
        {/* <Route exact path="/dashboard/trade/info" component={TradeInfoCard} /> */}
        <Route
          exact
          path="/dashboard/tradehistory"
          render={() => (
            <TradeHistory
              // transactions={transactions}
              // setTransactions={setTransactions}
              team={user.teams && user.teams[0]}
              updateTransaction={updateTransaction}
            />
          )}
        />
        <Route exact path="/dashboard/inventory" component={Inventory} />
        <Route exact path="/dashboard/market" component={Market} />
        <Route
          exact
          path="/dashboard"
          // component={Dashmain}
          render={() => <Dashmain user={user} />}
        />
        {/* <Route exact path="/dashboard" component={Dashmain} render={()=>} /> */}
      </Switch>
    </div>
  );
}

export default Dashboard;
