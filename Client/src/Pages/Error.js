import React, { useState, useEffect } from "react";
import queryString from "query-string";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ErrorPage = () => {
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const parsed = queryString.parse(history.location.search);

    alert(JSON.stringify(parsed));
    if (!parsed || !parsed.err) {
      history.push("/");
    } else {
      setError(parsed.err);
    }

    // eslint-disable-next-line
  }, []);

  const alert = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: error,
      timer: 2500,
      showConfirmButton: true,
    }).then(() => {
      history.push("/");
    });
  };

  useEffect(() => {
    if (error) {
      alert();
    }
    // eslint-disable-next-line
  }, [error]);

  return <></>;
};

export default ErrorPage;
