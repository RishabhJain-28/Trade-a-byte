import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

export default function Order(props) {
  const classes = useStyles();
  // console.log(props);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow >
            <StyledTableCell style={{backgroundColor:'#041544'}}>Components</StyledTableCell>
            <StyledTableCell align="right" style={{backgroundColor:'#041544'}}>Price</StyledTableCell>
            <StyledTableCell align="right" style={{backgroundColor:'#041544'}}>Quantity</StyledTableCell>
            <StyledTableCell align="right" style={{backgroundColor:'#041544'}}>Price Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.Components.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.price}</StyledTableCell>
              <StyledTableCell align="right">
                {props.Quant[row._id]}
              </StyledTableCell>
              <StyledTableCell align="right">
                ${row.price * props.Quant[row._id]}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
