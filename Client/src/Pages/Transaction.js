import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "../util/axios";

const Transaction = () => {
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState();
  const [code, setCode] = useState();
  const [pending, setPending] = useState([]);
  const [transaction, setTransaction] = useState();

  useEffect(() => {
    if (!user.id) return;
    console.log("new socket connection");

    setSocket(
      io.connect("http://localhost:5000", {
        query: { token: user.id },
      })
    );
  }, [user]);

  useEffect(() => {
    axios.defaults.headers.common["x-team-id"] = user.id;
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    console.log(socket);
    socket.on("push_message", ({ type, data, status }) => {
      console.log("MSSSG-data: ", data);
      console.log("MSSSG-status: ", status);
      if (type === 1) return setPending([...pending, data]);
      else return alert(status);
    });
  }, [socket, pending]);

  const sendOffer = async () => {
    const { data } = await axios.post("/transaction/offer", {
      // to: "1",
      // from: "2",
      amount: 200,
      components: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 200 },
      ],
      code,
    });
    console.log(data);
    setTransaction(data);
  };
  const getCode = async () => {
    const { data } = await axios.get("/transaction/start");
    console.log(data);
  };

  const accept = async (p) => {
    const { data } = await axios.get(`/transaction/accept/${p._id}`);
  };
  const reject = async (p) => {
    const { data } = await axios.get(`/transaction/reject/${p._id}`);
  };
  const cancel = async (transaction) => {
    const { data } = await axios.get(`/transaction/cancel/${transaction._id}`);
  };
  return (
    <div>
      <h1>Transactions</h1>
      <h2>id</h2>
      <input
        onChange={(e) => setUser({ id: e.target.value })}
        value={user.id}
      ></input>
      <h2>code</h2>
      <input onChange={(e) => setCode(e.target.value)} value={code}></input>
      <button onClick={sendOffer}>SEND OFFER</button>
      <button onClick={getCode}>GET CODE</button>
      <button onClick={() => cancel(transaction)}>CANCEL OFFER</button>

      <div>
        <ul>
          {pending.map((p, i) => (
            <li key={i}>
              <h6>{p._id}</h6>
              <button onClick={() => accept(p)}>Accept</button>
              <button onClick={() => reject(p)}>REJECT</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transaction;
