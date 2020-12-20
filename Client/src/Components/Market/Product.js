import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Card,
  CardMedia,
  Typography,
  CardActions,
  CardContent,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles((theme) => ({
  div: {
    padding: "2px",
  },
}));

const Product = (props) => {
  // console.log(props);
  const classes = useStyles();
  return (
    <Grid item xs={false} sm={5} lg={4}>
      <div className={classes.div}>
        <Card
          style={{
            boxShadow: "0px 0px 10px #81C2F7",
            backgroundColor: "#041544",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <CardContent style={{ paddingBottom: "0px" }}>
            <Typography
              variant="h5"
              style={{ textAlign: "center" }}
              component="h3"
            >
              {props.name}
            </Typography>
            <br />
            <Typography
              variant="body2"
              style={{ textAlign: "justify" }}
              component="p"
            >
              {props.description}
            </Typography>
            <br />
            <Typography variant="h6" component="p" align="center">
              ₹{props.price}
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            <Button id={props._id} onClick={props.onIncrement} color="primary">
              <AddIcon id={props._id} />
            </Button>
            <p style={{ fontWeight: "bold" }}>{props.Quant[props._id]}</p>
            <Button
              id={props._id}
              onClick={props.onDecrement}
              color="secondary"
            >
              <RemoveIcon id={props._id} />
            </Button>
          </CardActions>
        </Card>
      </div>
    </Grid>
  );
};

export default Product;
