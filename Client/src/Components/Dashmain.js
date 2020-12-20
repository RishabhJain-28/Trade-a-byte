import React, { Component } from "react";
import axios from "../util/axios";
import { Typography, Grid } from "@material-ui/core";
import Float from "./Float";

class Dashmain extends Component {
  state = {
    news: [],
    user: {},
  };
  componentDidMount() {
    // const user = JSON.parse(localStorage.getItem("user"));
    // console.log(this.props.user);
    axios.get("/news/get").then((data) => {
      // console.log(data);
      this.setState({
        news: data.data,
        // user: user,
      });
    });
  }

  render() {
    if (!this.props.user?.teams) return null;
    return (
      <div>
        <div className="container row">
          <div className="col-md-12 col-sm-12 col-12">
            <div className="dashboard">
              <h1 className="code-trade">
                <span className="text-wrapper">
                  <span className="code">TRADE-a-Byte</span>
                </span>
              </h1>
            </div>
            <div className="jumbotron">
              <p>
                Welcome {this.props.user.name} to the Trade-a-Byte Event! Your
                Team is:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {this.props.user.teams[0].teamName}
                </span>{" "}
                and Team code is :{" "}
                <span style={{ fontWeight: "bold" }}>
                  {this.props.user.teams[0].inviteCode}
                </span>
              </p>
            </div>
            <Typography
              variant="h4"
              component="h2"
              style={{ color: "white", textAlign: "center" }}
            >
              News
            </Typography>
            {this.state.news ? (
              this.state.news.map((data) => {
                return (
                  <div key={data._id} className="jumbotron">
                    <p>{data.body}</p>
                  </div>
                );
              })
            ) : (
              <Typography
                variant="p"
                component="h2"
                style={{ color: "white", textAlign: "center" }}
              >
                No News available to show
              </Typography>
            )}
            <Float />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashmain;
