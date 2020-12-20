import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// import "../../assets/css/questions.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  upld: {
    color: "black",
    backgroundColor: "white",
    // padding: "5.5px 117px",
    marginTop: "-9px !important",
    marginLeft: "26px",
  },
}));

export default function UploadButtons({ handleFileInput }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        id="contained-button-file"
        type="file"
        name="file_upload"
        required
        onChange={(e) => handleFileInput(e)}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          component="span"
          type="submit"
          className={classes.upld}
          // onClick={upload}
        >
          Upload file
        </Button>
      </label>
      {/* <input accept="image/*" className={classes.input} id="icon-button-file" type="file" /> */}
     </div>
  );
}
