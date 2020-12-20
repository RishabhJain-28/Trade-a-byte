import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

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
    minWidth: 100,
  },
});

export default function Order({ data }) {
  // const classes = useStyles();
  // console.log("info: ", data.requestComponents);
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <h6>Requesting: </h6>
        <ComponentsTable components={data.requestComponents} />
        {data.requestAmount !== 0 && (
          <Typography variant="body1">
            Amount requesting: ₹{data.requestAmount}
          </Typography>
        )}
      </Grid>
      <Grid item xs={6}>
        <h6>Offering: </h6>
        <ComponentsTable components={data.offerComponents} />
        {data.offerAmount !== 0 && (
          <Typography variant="body1">
            Amount offering: ₹{data.offerAmount}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

const ComponentsTable = ({ components }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{ backgroundColor: "#041544" }}>
              Components
            </StyledTableCell>
            <StyledTableCell
              align="right"
              style={{ backgroundColor: "#041544" }}
            >
              Quantity
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components &&
            components.map((c) => (
              <StyledTableRow key={c._id}>
                <StyledTableCell component="th" scope="row">
                  {c.comp.name}
                </StyledTableCell>
                <StyledTableCell align="right">{c.qty}</StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
