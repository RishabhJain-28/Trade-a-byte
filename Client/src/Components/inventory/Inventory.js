import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Products from "./Products";
// import Cart from "./cart";
import axios from "../../util/axios";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3),
  },
}));
//! SHOW CURRENTN BALANCE OF THE USER
function InventoryIn() {
  const [inventory, setInventory] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const getMyComponents = async () => {
    try {
      const { data } = await axios.get("/inventory/team/get");
      const { balance, components } = data;
      setBalance(balance);
      setInventory(components);
      setLoading(false);
      console.log(components);
    } catch (err) {}
  };
  useEffect(() => {
    setLoading(true);
    getMyComponents();
  }, []);
  useEffect(() => {
    // setLoading(false);
  }, [inventory]);

  return (
    <Grid container direction="column">
      <Grid container item>
        {!loading ? (
          <>
            <Grid item xs={6} sm={10} />
            <Typography
              color="primary"
              variant="h4"
              component="p"
              style={{ color: "white", marginLeft: "33%" }}
            >
              Current Balance: ₹{balance}
            </Typography>
            <br />
            <br />
            <br />
            <br />
            <Grid item container>
              <Grid item xs={1} sm={2} />
              <Products data={inventory} />
              <Grid item xs={1} sm={2} />
            </Grid>
          </>
        ) : (
          <h4 style={{ color: "white" }}>LOADING</h4>
        )}
      </Grid>
    </Grid>
  );
}

export default InventoryIn;
