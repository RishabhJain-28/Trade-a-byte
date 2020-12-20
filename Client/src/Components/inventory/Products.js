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

const Products = ({ data }) => {
  const classes = useStyles();
  let Components = data
    ? data.map((product) => {
        return <Product key={product._id} {...product} />;
      })
    : null;
  return (
    <Grid container item justify="center" spacing={4} xs={12} sm={8}>
      {Components}
    </Grid>
  );
};

export default Products;
