import React, { Component } from "react";
import InventoryIn from "../inventory/Inventory";
class Inventory extends Component {
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
                  <span className="code">Inventory</span>
                </span>
              </h1>
            </div>
            <InventoryIn />
          </div>
        </div>
      </div>
    );
  }
}

export default Inventory;
