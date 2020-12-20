import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import Products from "./Products";
import Cart from "./cart";
import axios from "../../util/axios";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3),
  },
}));
function InventoryIn() {
  const classes = useStyles();
  const [Components, setComponents] = useState([]);
  const [Quantity, setQuantity] = useState({});
  const [money, setMoney] = useState(10000);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  //Function on increement button

  const getMyComponents = async () => {
    try {
      const { data } = await axios.get("/inventory/team/get");
      setBalance(data.balance);
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);

    getMyComponents();
  }, []);
  useEffect(() => {
    if (!message) return;
    return Swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: message,
      timer: 3000,
    }).then(() => {
      setMessage(null);
    });
  }, [message]);

  useEffect(() => {
    if (!error) return;
    return Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: error,
      timer: 3000,
    }).then(() => {
      setError(null);
    });
  }, [error]);

  const onIncrement = (e) => {
    // console.log(e);
    if (!e.target.id) return;
    const price = Components.filter((data) => data._id === e.target.id);
    const cal = money - price[0].price;
    if (cal < 0) return;
    setMoney(cal);
    setQuantity({
      ...Quantity,
      [e.target.id]: Quantity[e.target.id] + 1,
    });
  };

  // function for Decrement Button

  const onDecrement = (e) => {
    if (!e.target.id) return;
    if (Quantity[e.target.id] <= 0) return;
    const price = Components.filter((data) => data._id === e.target.id);
    const cal = money + price[0].price;
    if (cal > 10000) return;
    setMoney(cal);
    setQuantity({
      ...Quantity,
      [e.target.id]: Quantity[e.target.id] - 1,
    });
  };

  // function for buy now

  const buyNow = async () => {
    try {
      const resetQuantity = {};
      let componentsCart = Object.keys(Quantity).map((componentId) => {
        resetQuantity[componentId] = 0;
        return {
          _id: componentId,
          qty: Quantity[componentId],
        };
      });
      componentsCart = componentsCart.filter((c) => c.qty > 0);
      const { data } = await axios.post("/inventory/buy", {
        components: componentsCart,
      });
      setMessage(data.msg);
      setBalance(data.data.balance);

      // setMoney(0); //!
      setQuantity(resetQuantity);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setError(err.response?.data?.msg);
    }
  };

  useEffect(() => {
    axios.get("/inventory/get/components").then((data) => {
      setComponents(data.data);
      let Quant = {};
      // setQuantity
      data.data.forEach((quan) => {
        Quant[quan._id] = 0;
      });
      setQuantity(Quant);
      setLoading(false);
    });
  }, []);
  if (loading) return <h4 style={{ color: "white" }}>LOADING</h4>;
  return (
    <>
      <Grid container direction="column">
        <Grid container item>
          <Grid item xs={6} sm={10} />
          <Grid item xs={2} sm={2}>
            <Cart
              Quant={Quantity}
              data={Components}
              money={money}
              buyNow={buyNow}
              initialMoney={10000}
              balance={balance}
            />
          </Grid>
        </Grid>
        <br />
        <Grid item container>
          <Grid item xs={1} sm={2} />
          <Products
            data={Components}
            money={money}
            Quant={Quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          {/* <button onClick={buyNow}>CLICK FOFFR COMPS</button> */}
          <Grid item xs={1} sm={2} />
        </Grid>
      </Grid>
    </>
  );
}

export default InventoryIn;
