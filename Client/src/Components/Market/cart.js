import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Order from "./Order";
import Slide from "@material-ui/core/Slide";
import { Typography } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cart(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // console.log("cancel");
  };
  const buyNow = () => {
    props.buyNow();
    setOpen(false);
  };
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<ShoppingCartIcon />}
        style={{ color: "#041544", backgroundColor: "white" }}
      >
        Cart
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Order Now"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Order
              Components={props.data}
              Quant={props.Quant}
              money={props.money}
              initialMoney={props.initialMoney}
            />
            <Typography variant="body1">
              Total Amount : ₹ {props.initialMoney - props.money}
            </Typography>
            <Typography variant="body1">
              Current Balance : ₹ {props.balance}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={buyNow} color="primary">
            Buy Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
