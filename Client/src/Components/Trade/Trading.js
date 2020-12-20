import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
// import Dashboardnavbar from "../Dashboardnavbar";
import TradeComponents from "./TradingComponents";
import "../../assets/css/tradingstyle.css";
import axios from "../../util/axios";

const Trading = () => {
  const [allComponents, setAllComponents] = useState([]);
  const [myComponents, setMyComponents] = useState([]);
  const [requestComponents, setRequestComponents] = useState({});
  const [offerComponents, setOfferComponents] = useState({});
  const [requestAmount, setRequestAmount] = useState(0);
  const [offerAmount, setOfferAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const getAllComponents = async () => {
    try {
      const { data } = await axios.get("/inventory/get/components");
      // console.log("all comp", data);
      setAllComponents(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getMyComponents = async () => {
    try {
      const { data } = await axios.get("/inventory/team/get");
      // console.log("my comp", data);
      data.components = data.components.map((c) => {
        return {
          _id: c._id,
          qty: c.qty,
          ...c.comp,
        };
      });
      setMyComponents(data.components);
    } catch (err) {}
  };
  useEffect(() => {
    getAllComponents();
  }, []);
  useEffect(() => {
    getMyComponents();
  }, []);

  const increment = (_id, cart, setCart, max) => {
    const temp = { ...cart };
    // console.log(_id);
    if (!temp[_id]) temp[_id] = 0;
    if (max && temp[_id] + 1 >= max) temp[_id] = max;
    else temp[_id]++;

    setCart(temp);
  };
  const decrement = (_id, cart, setCart) => {
    const temp = { ...cart };
    // console.log(_id);

    if (!temp[_id]) return;
    temp[_id]--;
    if (temp[_id] === 0) delete temp[_id];
    setCart(temp);
  };
  const sendTradeRequest = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const { data } = await axios.post("/transaction/offer", {
        requestComponents,
        offerComponents,
        requestAmount,
        offerAmount,
        code,
      });

      // console.log(data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "success",
        text: `Offer sent successfull`,
      });
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setLoading(false);
      setError(err.response?.data?.msg);
    }
  };
  useEffect(() => {
    if (!error) return;

    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: error,
      timer: 4000,
      showConfirmButton: true,
    }).then(() => {
      setError(null);
    });
  }, [error]);
  return (
    <div>
      <div className="container row">
        <div className="col-md-12 col-sm-12 col-12">
          <div className="dashboard">
            <h1 className="code-trade">
              <span className="text-wrapper">
                <span className="code">TRADE-a-CODE</span>
              </span>
            </h1>
          </div>

          <div className="body-container">
            <h3 style={{ fontWeight: "bold" }}>Request Components</h3>
            <br />
            <div className="scroll-list" style={{ height: "290px" }}>
              <TradeComponents
                list={allComponents}
                decrement={decrement}
                increment={increment}
                cart={requestComponents}
                setCart={setRequestComponents}
              />
            </div>
            <div
              className="row"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <input
                id="request-amount"
                className="amount"
                type="number"
                value={requestAmount}
                onChange={(e) => {
                  if (e.target.value >= 0) setRequestAmount(e.target.value);
                  setOfferAmount(0);
                }}
                style={{ marginLeft: "250px" }}
                placeholder="Request for amount"
              />
              <div className="enter">
                {/* <li id="code-id"></li> */}
                <input
                  className="custom-id"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the code for trading"
                />
              </div>
            </div>
            <br />
            <h3 style={{ fontWeight: "bold" }}>Offer Components</h3>
            <br />
            {myComponents.length != 0 && (
              <div className="scroll-list">
                <TradeComponents
                  list={myComponents}
                  decrement={decrement}
                  increment={increment}
                  cart={offerComponents}
                  setCart={setOfferComponents}
                />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <input
                id="offer-amount"
                className="amount"
                type="number"
                value={offerAmount}
                placeholder="Offer Amount"
                onChange={(e) => {
                  if (e.target.value >= 0) setOfferAmount(e.target.value);
                  setRequestAmount(0);
                }}
                style={{ marginLeft: "250px", marginTop: "-5rem" }}
              />
            </div>
            <div className="view zoom">
              <button
                className="btn active req"
                // role="button"
                // href="../Trading/trading.html"
                aria-pressed="true"
                onClick={sendTradeRequest}
              >
                {/* <a
                className="btn active req"
                role="button"
                href="../Trading/trading.html"
                aria-pressed="true"
              > */}
                <span>{!loading ? `SEND TRADE REQUEST` : "Loading..."}</span>
              </button>
            </div>
          </div>
          {/* <button
            onClick={() => {
              console.log("request cart", requestCart);
              console.log("offer cart", offerCart);
            }}
          >
            CART
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Trading;
