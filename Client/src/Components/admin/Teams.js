import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@material-ui/core";
import { Link } from "react-router-dom";
const Teams = ({ teams, eventTeamMap, setSelectedTeam }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Sent to</TableCell>
            <TableCell>Status</TableCell>
            {/* <TableCell>time </TableCell>
                <TableCell>Status</TableCell> */}
            <TableCell />
            {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((t) => {
            if (!eventTeamMap[t._id]) return;
            return (
              <TableRow key={t._id}>
                <TableCell component="th" scope="row">
                  {t.teamName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {eventTeamMap[t._id].evaluated
                    ? "EVALUATED"
                    : "NOT EVALUATED"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {eventTeamMap[t._id].balance}
                </TableCell>
                <TableCell onClick={() => setSelectedTeam(t)} align="left">
                  <Link to="/admin/team">SELECT</Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

    // </div>
    // </div>
  );
};

export default Teams;
