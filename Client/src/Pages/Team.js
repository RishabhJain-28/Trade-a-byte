import React, { useState, useEffect } from "react";
import axios from "../util/axios";

const Team = () => {
  const [code, setCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const createTeam = async () => {
    //! try catch
    const { data } = await axios.post("/team/create", {
      teamName,
    });
    console.log(data);
    setCode(data.code);
  };
  const joinTeam = async () => {
    //! try catch
    const { data } = await axios.get(`/team/join/${code}`);
    console.log(data);
    setTeamName(data.teamName);
    // setCode(data.code);
  };
  return (
    <div>
      <h1>{teamName}</h1>
      <button style={{ color: "white" }} onClick={createTeam}>
        CREATE TEAM
      </button>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      <br />
      <h6>NAME: </h6>
      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
      <br />
      <button style={{ color: "white" }} onClick={joinTeam}>
        JOIN TEAM
      </button>
    </div>
  );
};

export default Team;
