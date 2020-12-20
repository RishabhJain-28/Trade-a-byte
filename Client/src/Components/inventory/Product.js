import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  CardActions,
  CardContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  div: {
    padding: "2px",
  },
}));

const Product = ({ comp: { name, description, image }, qty }) => {
  const classes = useStyles();
  return (
    <Grid item xs={false} sm={5} lg={4}>
      <div className={classes.div}>
        <Card style={{boxShadow:'0px 0px 10px #81C2F7',backgroundColor:'#041544',color:'white', borderRadius:'5px'}}>
          
          <CardContent style={{ paddingBottom: "0px"}}>
            <Typography variant="h5" component="h3" style={{textAlign:'center'}}>
              {name}
            </Typography>
            <br />
            <Typography variant="body2" component="p" style={{textAlign:'justify'}}>
              {description}
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            <Typography variant="h6" component="p" align="center">
              Quantity: <span style={{ fontWeight: "bold" }}> {qty}</span>
            </Typography>
          </CardActions>
        </Card>
      </div>
    </Grid>
  );
};

export default Product;
