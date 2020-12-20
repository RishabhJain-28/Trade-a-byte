import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Swal from "sweetalert2";
import ComponentsList from "./ComponentsList";
import axios from "../../util/axios";
// const confirmationSwal = Swal.mixin({
//   customClass: {
//     confirmButton: 'confirm',
//     cancelButton: 'reject'
//   },
//   buttonsStyling: false
// })

const TeamPage = ({ team, updateEventTeam }) => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState({});
  const [eventTeam, setEventTeam] = useState({});
  const confirmationSwal = Swal.mixin({
    customClass: {
      confirmButton: "confirm-btn",
      cancelButton: "reject-btn",
    },
    buttonsStyling: false,
  });

  const confirmAlert = ({ title, message }) => {
    console.log("SS");
    return confirmationSwal.fire({
      title: `<strong><u>${title}</u></strong>`,
      icon: "info",
      html: `<b>${message}</b>, `,

      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: `Confirm`,
      confirmButtonAriaLabel: "Confirm",
      showCancelButton: true,
      cancelButtonText: `Cancel`,
      // cancelButtonText: `<span class="reject">Cancel</span>`,
      cancelButtonAriaLabel: "Cancel",
    });
  };
  const getEventTeam = async (id) => {
    try {
      // setLoading(false);
      const { data } = await axios.get(`/inventory/team/get/${id}`);
      console.log(data);
      setEventTeam(data);
      // setLoading(true);
    } catch (err) {
      setError("cant find teams inventory. Return ");
    }
  };

  useEffect(() => {
    console.log(team);
    getEventTeam(team._id);
  }, [team]);
  const increment = (_id, cart, setCart, max) => {
    const temp = { ...cart };
    if (!temp[_id]) temp[_id] = 0;
    if (max && temp[_id] + 1 >= max) temp[_id] = max;
    else temp[_id]++;
    setCart(temp);
  };
  const decrement = (_id, cart, setCart) => {
    const temp = { ...cart };
    if (!temp[_id]) return;
    temp[_id]--;
    if (temp[_id] === 0) delete temp[_id];
    setCart(temp);
  };
  const markCorrect = async () => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to mark this solution as correct",
    }).then(async (result) => {
      try {
        if (!result.isConfirmed) return;
        setLoading(true);
        const { data } = await axios.post("/invigilator/correct", {
          components,
          eventTeamId: eventTeam._id,
        });
        console.log(data);
        updateEventTeam(data.eventTeam);
        setEventTeam(data.eventTeam);
        setMessage(data.msg);
        setLoading(false);
        setComponents({});
      } catch (err) {
        setError(err.response?.data?.msg);
        setLoading(false);
      }
    });
  };
  const rejectSolution = async () => {
    confirmAlert({
      title: "Rejection",
      message: "Are you sure you want to mark this solution as incorrect",
    }).then(async (result) => {
      try {
        if (!result.isConfirmed) return;
        setLoading(true);
        const { data } = await axios.get(
          `/invigilator/reject/${eventTeam._id}`
        );
        console.log(data);
        updateEventTeam(data.eventTeam);
        setEventTeam(data.eventTeam);
        setMessage(data.msg);
        setLoading(false);
        setComponents({});
      } catch (err) {
        setError(err.response?.data?.msg);
        setLoading(false);
      }
    });
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
  useEffect(() => {
    if (!message) return;
    return Swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: message,
      timer: 4000,
    }).then(() => {
      setMessage(null);
    });
  }, [message]);

  if (!team) return <Redirect to="/admin" />;
  if (!eventTeam?._id)
    return (
      <>
        <Typography color="primary" variant="h4" component="h3">
          LOADING...
        </Typography>
        <Typography color="primary" variant="h4" component="h3">
          {/* {team.teamName} */}
          <Link to="/admin">back to all team</Link>
        </Typography>
      </>
    );

  return (
    <div>
      <Typography color="primary" variant="h4" component="h3">
        {team.teamName}
      </Typography>
      {/* <h4></h4> */}
      <div className="scroll-list">
        <ComponentsList
          list={eventTeam.components}
          decrement={decrement}
          increment={increment}
          cart={components}
          setCart={setComponents}
        />
      </div>
      <button
        // style ={{color:"green"}}
        className="btn  mark-correct "
        disabled={loading}
        onClick={markCorrect}
      >
        {loading ? "loading..." : "MARK CORRECT"}
      </button>
      <button
        // style ={{color:"green"}}
        className="btn  mark-reject "
        disabled={loading}
        onClick={rejectSolution}
      >
        {loading ? "loading..." : "REJECT SOLUTION"}
      </button>
      <Typography color="primary" variant="h4" component="h3">
        {/* {team.teamName} */}
        <Link to="/admin">back to all team</Link>
      </Typography>
    </div>
  );
};

export default TeamPage;
