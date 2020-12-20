import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  makeStyles,
  TableBody,
} from "@material-ui/core";
import moment from "moment";
import axios from "../../util/axios";
import TradeDialogue from "./TradeDialogue";

const TradeHistory = ({ team, updateTransaction }) => {
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTransaction, setOpenTransaction] = useState({});

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const classes = useStyles();

  const getTradeHistory = async () => {
    const { data } = await axios.get("/transaction/team/all");
    console.log("tradedata: ", data);
    setTransactions(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("cancel");
  };
  useEffect(() => {
    getTradeHistory();
  }, []);

  useEffect(() => {
    if (!updateTransaction) return;
    const data = updateTransaction;
    const temp = transactions.filter((t) => t._id !== data._id);
    temp.push(data);
    setTransactions(temp);
    // eslint-disable-next-line
  }, [updateTransaction]);

  const getName = (t) => {
    if (t.to.id === team._id) {
      if (t?.from?.name) {
        return t.from.name;
      } else return "Not set";
    } else {
      if (t?.to?.name) {
        return t.to.name;
      } else return "Not set";
    }
  };
  return (
    <div>
      <div className="container row">
        <div className="col-md-12 col-sm-12 col-12">
          <div className="dashboard">
            <h1 className="code-trade">
              <span className="text-wrapper">
                <span className="code">TRADE HISTORY</span>
              </span>
            </h1>
          </div>
          <div className="jumbotron">
            <p>
              Team A can look into the deal and can accept or reject it. An
              error message might be generated owing to lack of
              components/currency required for the deal. Successful execution of
              the deal updates INVENTORY of each team.
            </p>
          </div>
          <TradeDialogue
            open={open}
            setOpen={setOpen}
            data={openTransaction}
            handleClose={handleClose}
            transactions={transactions}
            setTransactions={setTransactions}
          />
          <TableContainer
            component={Paper}
            style={{
              background: "transparent",
              color: "white !important",
              marginLeft: "25px",
            }}
          >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: "white " }}>Sent by</TableCell>
                  <TableCell style={{ color: "white " }}>Sent to</TableCell>
                  <TableCell style={{ color: "white " }}>time </TableCell>
                  <TableCell style={{ color: "white " }}>Status</TableCell>
                  <TableCell />
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.reverse().map((t) => (
                  <TableRow key={t._id}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ color: "white " }}
                    >
                      {t?.from?.name || "-"}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ color: "white " }}
                    >
                      {t.code === "-" ? t?.to?.name : "-"}
                    </TableCell>
                    <TableCell style={{ color: "white " }}>
                      {moment(t.status.time || t.createdAt).format("LT")}
                      <span style={{ fontStyle: "oblique", color: "#fff" }}>
                        ({moment(t.status.time || t.createdAt).fromNow()})
                      </span>
                    </TableCell>
                    <TableCell style={{ color: "white " }}>
                      {t.status.value}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        // alert(t.code );
                        if (t.code === "-" && t.from.id === team._id) {
                          t.me = true;
                        } else t.me = false;
                        setOpenTransaction(t);
                        setOpen(true);
                      }}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      <a
                        className="btn"
                        style={{
                          backgroundColor: "white",
                          color: "#041544",
                          paddingTop: "10px",
                        }}
                      >
                        Info
                      </a>
                    </TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
// {newTransactions.map((t) => (
//   <TableRow key={t._id}>
//     <TableCell component="th" scope="row">
//       {getName(t)}--*NEW
//     </TableCell>
//     <TableCell>{t.status.time || t.createdAt}</TableCell>
//     <TableCell align="right">{t.status.value}</TableCell>
//     <TableCell align="right">OPEN LINK</TableCell>
//     {/* <TableCell align="right">{row.protein}</TableCell> */}
//   </TableRow>
// ))}
