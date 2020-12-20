import React, { Component } from "react";
// import Pic from "../assets/sushi.jpg";
import Logo from "../assets/logo2-02.png";
import { Link } from "react-router-dom";

class Dashboardnavbar extends Component {
  constructor() {
    super();
    this.getCurrentPage = () => {
      const url = window.location.href.split("/");
      let current = url[url.length - 1];
      if (current === "") current = "dashboard";
      // console.log("current", current);
      return current;
    };
    this.state = {
      current: this.getCurrentPage(),
      tabs: [
        {
          name: "dashboard",
          icon: "fa fa-dashboard",
          to: "/dashboard",
          tabHeading: "DASHBOARD",
          activeColor: "#7edfff",
        },
        {
          name: "questions",
          icon: "fa fa-calendar-o",
          to: "/dashboard/questions",
          tabHeading: "QUESTIONS",
          activeColor: "#7edfff",
        },
        {
          name: "market",
          icon: "fa fa-shopping-cart",
          to: "/dashboard/market",
          tabHeading: "MARKET",
          activeColor: "#7edfff",
        },
        {
          name: "inventory",
          icon: "fa fa-line-chart",
          to: "/dashboard/inventory",
          tabHeading: "INVENTORY",
          activeColor: "#7edfff",
        },
        {
          name: "trading",
          icon: "fa fa-group",
          to: "/dashboard/tradestart",
          tabHeading: "TRADING",
          activeColor: "#7edfff",
        },
        {
          name: "tradehistory",
          icon: "fa fa-group",
          to: "/dashboard/tradehistory",
          tabHeading: "TRADE HISTORY",
          activeColor: "#7edfff",
        },
      ],
    };
  }
  changePage = (name) => {
    this.setState({ current: name });
  };
  render() {
    const { current } = this.state;
    const { user } = this.props;
    return (
      <div>
        <div
          className="side-menu"
          data-aos="flip-right"
          data-aos-duration="3000"
        >
          <div className="logo">
            <a className="navbar-brand" href={Logo}>
              <img alt="LOGO" src={Logo} />
            </a>
          </div>

          <div className="profile">
            <div className="avatar" style={{ alignContent: "center" }}>
              <img alt="PIC" src={user.profilePicLink} />
            </div>
            <br />
            <h2 className="username">{user.name}</h2>
          </div>

          <ul className="left-nav">
            {this.state.tabs.map(
              ({ name, activeColor, icon, to, tabHeading }, i) => (
                <li key={i}>
                  <Link to={to} onClick={() => this.changePage(name)}>
                    <i
                      style={name === current ? { color: activeColor } : {}}
                      className={`${icon}`}
                    ></i>
                    <span
                      style={name === current ? { color: activeColor } : {}}
                    >
                      {tabHeading}
                    </span>
                  </Link>
                </li>
              )
            )}
            <li>
              <a
                href={`${process.env.REACT_APP_BASE_URL}/api/auth/logout`}
                className="side-signout "
                role="button"
                aria-pressed="true"
              >
                <i className="fa fa-power-off"></i>
                <span>SIGN OUT</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default Dashboardnavbar;
