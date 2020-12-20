import React, { useState, useEffect } from "react";
import Dashmain from "../Dashmain";
import "../../assets/css/tradestart.css";
import { Link } from "react-router-dom";
import axios from "../../util/axios";
import Swal from "sweetalert2";

function Tradestart() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const getCodeForTrade = async () => {
    if (loading) return;
    setLoading(true);
    const { data } = await axios.get("/transaction/start");
    console.log(data);

    Swal.fire({
      position: "center",
      icon: "success",
      title: data.code,
      text: `Give this one time use code to the team you want to trade with.`,
    });
    setCode(data.code);
    setLoading(false);
  };
  return (
    <div>
    <div className="container row">
    <div className="col-md-12 col-sm-12 col-12">
      <div className="dashboard">
        <h1 className="code-trade">
          <span className="text-wrapper">
            <span className="code">TRADE INITIATE</span>
          </span>
        </h1>
      </div>
      <div className="jumbotron" style={{textAlign:'center'}}>
      <p>
      For execution of the deal,one member from team A has to INITIATE THE TRADE by proceeding with generation of code on the portal.
      Team B has to enter the one-time trading code, along with offerings and receivings of the components or currency of each teams, on SEND TRADE OFFER USING A CODE.
      </p>
    </div>
    </div>
  </div>
        <div className="view zoom">
          <button
            disabled={loading}
            className="btn active trade"
            onClick={getCodeForTrade}
          >
            <span>{loading ? "Loading..." : "Initiate the Trade"}</span>
          </button>
        </div>
          <br />
        <div className="view zoom" >
          <Link className="btn active or" style={{marginBottom:'10vh !important', border: 'none'}}>
            <span>OR</span>
          </Link>
        </div>
        <br />
        <div className="view zoom">
          <Link
            to="/dashboard/trading"
            className="btn active trade"
            role="button"
          >
            <span>Send Trade Offer using a code</span>
          </Link>
        </div>
      </div>
  );
}

export default Tradestart;
