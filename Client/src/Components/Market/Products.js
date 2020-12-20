import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import Product from "./Product";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Products = (props) => {
  const classes = useStyles();
  // console.log(props);
  let Components = props.data
    ? props.data.map((content) => {
        return (
          <Product
            key={content._id}
            Quant={props.Quant}
            money={props.money}
            onIncrement={props.onIncrement}
            onDecrement={props.onDecrement}
            {...content}
          />
        );
      })
    : null;
  return (
    <Grid container item justify="center" spacing={4} xs={12} sm={8}>
      {Components}
    </Grid>
  );
};

export default Products;
