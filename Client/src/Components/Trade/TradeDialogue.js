import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TradeInfoTable from "./TradeInfoTable";
import Slide from "@material-ui/core/Slide";
import { Typography } from "@material-ui/core";
import Swal from "sweetalert2";
import axios from "../../util/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TradeDialogue = ({
  open,
  setOpen,
  handleClose,
  data,
  transactions,
  setTransactions,
}) => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const acceptOffer = async () => {
    try {
      setLoading(true);
      const { data: responseData } = await axios.get(
        `/transaction/accept/${data._id}`
      );
      // console.log(responseData);
      const temp = transactions.filter((t) => t._id !== responseData._id);
      setTransactions([...temp, responseData]);

      setOpen(false);
      setMessage("Transaction accepted");
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setOpen(false);
      setError(err.response?.data?.msg);
      setLoading(false);
    }
  };

  const rejectOffer = async () => {
    try {
      setLoading(true);
      const { data: responseData } = await axios.get(
        `/transaction/reject/${data._id}`
      );
      // console.log(responseData);
      const temp = transactions.filter((t) => t._id !== responseData._id);
      setTransactions([...temp, responseData]);

      setOpen(false);
      setMessage("Transaction Rejected");
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setOpen(false);
      setError(err.response?.data?.msg);
      setLoading(false);
    }
  };
  const cancelOffer = async () => {
    try {
      setLoading(true);
      const { data: responseData } = await axios.get(
        `/transaction/cancel/${data._id}`
      );
      // console.log(responseData);
      const temp = transactions.filter((t) => t._id !== responseData._id);
      setTransactions([...temp, responseData]);

      setOpen(false);
      setMessage("Transaction Canceled");
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setOpen(false);
      setError(err.response?.data?.msg);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!error) return;

    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: error,
      timer: 4000,
      showConfirmButton: true,
    }).then(() => {
      setError(null);
    });
  }, [error]);
  useEffect(() => {
    if (!message) return;

    return Swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: message,
      timer: 4000,
    }).then(() => {
      setMessage(null);
    });
  }, [message]);
  const ShowCode = ({ code }) => {
    return <Typography variant="h3">Transaction code: {code}</Typography>;
  };
  return (
    <Dialog
      maxWidth="lg"
      fullWidth={true}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Info</DialogTitle>
      <DialogContent>
        {data.code !== "-" ? (
          <ShowCode code={data.code} />
        ) : (
          <TradeInfoTable data={data} />
        )}
        <DialogContentText id="alert-dialog-slide-description">
          {/* <Typography variant="body1"> */}
          Status: {data.status?.value}
          {/* </Typography> */}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {loading && <h6>LOADING...</h6>}
        {!loading &&
          data.status?.value === "SENT" &&
          (!data.me ? (
            <>
              <Button
                style={{ color: "green" }}
                onClick={acceptOffer}
                color="primary"
              >
                Accept
              </Button>
              <Button
                style={{ color: "red" }}
                onClick={rejectOffer}
                color="primary"
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              style={{ color: "red" }}
              onClick={cancelOffer}
              color="primary"
            >
              Cancel OFFER
            </Button>
          ))}
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeDialogue;
