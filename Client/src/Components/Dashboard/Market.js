import React, { Component } from "react";
import MarketIn from "../Market/Market";
class Market extends Component {
  render() {
    return (
      <div>
        <div
          className="container row"
          data-aos="fade-right"
          data-aos-duration="3000"
        >
          <div className="col-md-12 col-sm-12 col-12">
            <div className="dashboard">
              <h1 className="code-trade">
                <span className="text-wrapper">
                  <span className="code">Market</span>
                </span>
              </h1>
            </div>
            <MarketIn />
          </div>
        </div>
      </div>
    );
  }
}

export default Market;
