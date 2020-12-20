import React, { useEffect } from "react";
import LoginPng from "../assets/trade.png";
import { Grid } from "@material-ui/core";
import "../assets/css/loginStyles.css";

const Login = () => {
  useEffect(() => {
    localStorage.clear(); // clear for user
  }, []);
  return (
    <>
      <Grid item xs={12} md={12}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Grid container justify="center">
              <img
                className="login-pic"
                src={LoginPng}
                alt="trade"
                style={{ width: "28vw", height: "auto", marginTop: "12vh" }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="btn active login">
                <a href={`${process.env.REACT_APP_BASE_URL}/api/auth/login`}>
                  <span
                    className="login"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Login to Trade-a-Byte
                  </span>
                </a>
              </button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
