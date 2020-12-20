import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "../util/axios";

import Teams from "../Components/admin/Teams";
import TeamPage from "../Components/admin/TeamPage";
import "../assets/css/adminPage.css";

const AdminPage = () => {
  const [teams, setTeams] = useState([]);
  const [eventTeamMap, setEventTeamMap] = useState({});
  const [selectedTeam, setSelectedTeam] = useState({});
  useEffect(() => {
    axios.defaults.headers.common["x-auth-admin"] = "thisisasecretpassword";
  }, []);
  const getAllTeams = async () => {
    const { data } = await axios.get("/team/admin/all");
    // console.log(data);
    setTeams(data.teams);
    setEventTeamMap(data.teamMap);
  };

  useEffect(() => {
    getAllTeams();
  }, []);
  const updateEventTeam = (newEventTeam) => {
    const temp = { ...eventTeamMap };
    temp[newEventTeam.team] = newEventTeam;
    setEventTeamMap(temp);
  };
  // console.log("a");
  return (
    <div className="container row">
      <div className="col-md-12 col-sm-12 col-12">
        <div className="dashboard">
          <h1 className="code-trade">
            <span className="text-wrapper">
              <span className="code">TRADE-a-CODE</span>
            </span>
          </h1>
        </div>
        <div className="jumbotron">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat,
            porro? Nisi, sunt soluta? Expedita esse facilis temporibus
            recusandae distinctio repudiandae reprehenderit dolorem praesentium
            error autem, ratione accusamus quos ad aspernatur!
          </p>
        </div>
        <Switch>
          <Route
            path="/admin/"
            exact
            render={() => (
              <Teams
                setSelectedTeam={setSelectedTeam}
                teams={teams}
                eventTeamMap={eventTeamMap}
              />
            )}
          />
          <Route
            path="/admin/team"
            exact
            render={() => (
              <TeamPage
                team={selectedTeam}
                eventTeam={eventTeamMap[selectedTeam._id]}
                updateEventTeam={updateEventTeam}
              />
            )}
          />
        </Switch>
      </div>
    </div>
    // </div>
    // </div>
  );
};

export default AdminPage;
