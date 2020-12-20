import React, { useState, useEffect } from "react";
import Dashmain from "../Dashmain";
import "../../assets/css/questions.css";
import UploadButtons from "../Question/ques-upload";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import CustomizedSteppers from "../Question/Ques-progressbar";
import queryString from "query-string";
import Swal from "sweetalert2";
// import Swal from "sweetalert2";
import axios from "../../util/axios";
import QuestionsComponents from "../Question/QuestionsComponents";
const confirmationSwal = Swal.mixin({
  customClass: {
    confirmButton: "confirm-alert",
    cancelButton: "reject-alert",
  },
  buttonsStyling: false,
});
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  upld: {
    color: "black",
    backgroundColor: "white",
    // padding: "5.5px 117px",
    marginTop: "-4px !important",
    marginLeft: "26px",
  },
}));
function Questions() {
  const [question, setQuestion] = useState({});
  const [cart, setCart] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [myComponents, setMyComponents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [round, setRound] = useState("");
  const confirmAlert = ({ title, message }) => {
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
      cancelButtonAriaLabel: "Cancel",
    });
  };
  const askConfirm = () => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to send this sol",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      upload();
    });
  };
  const classes = useStyles();

  const upload = async () => {
    if (loading) return;
    try {
      setLoading(true);
      // cart["5fc65c5677013546d220d0db"] = 1;
      let componentsCart = Object.keys(cart).map((componentId) => {
        // cart[componentId] = 3;
        return {
          // _id: componentId,
          comp: componentId,
          // qty: 3,
          qty: cart[componentId],
        };
      });
      componentsCart = componentsCart.filter((c) => c.qty > 0);

      console.log("componentsCart", JSON.stringify(componentsCart));
      console.log("cart", JSON.stringify(cart));

      const formData = new FormData();
      formData.append("components", JSON.stringify(componentsCart));
      formData.append("cart", JSON.stringify(cart));
      formData.append("file", file);

      const { data } = await axios.post(`/questions/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { components, msg, submitted } = data;
      console.log("data", components);
      const myComponents = components.map((c) => {
        return {
          _id: c._id,
          qty: c.qty,
          ...c.comp,
        };
      });
      console.log("my", myComponents);
      setMyComponents(myComponents);
      setSubmitted(submitted);
      setMessage(msg);
      setLoading(false);
      setCart({});
      setFile(null);
    } catch (err) {
      console.log(err.response?.data?.msg);
      setError(err.response?.data?.msg);
      setLoading(false);
      setCart({});
      setFile(null);
    }
  };

  useEffect(() => {
    axios
      .get("/questions/get")
      .then(({ data }) => {
        // console.log(data);
        if (data.submitted) setSubmitted(true);
        else {
          setSubmitted(false);
          console.log("question ", data);
          setQuestion(data.question);
        }

        setRound(data.currentRound);
        // console.log(data);
      })
      .catch((err) => {
        setError(err.response?.data?.msg);
      });
  }, []);
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
  const getMyComponents = async () => {
    try {
      const { data } = await axios.get("/inventory/team/get");
      data.components = data.components.map((c) => {
        return {
          _id: c._id,
          qty: c.qty,
          ...c.comp,
        };
      });
      setMyComponents(data.components);
    } catch (err) {
      setError("Cannot load inventory. Reload");
    }
  };
  useEffect(() => {
    getMyComponents();
  }, []);
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
  // if (myComponents.length === 0) return <h1>LOADING MY COMPS</h1>;
  if (submitted)
    return (
      <div>
        <div className="container row">
          <div className="col-md-12 col-sm-12 col-12">
            <div className="dashboard">
              <h1 className="code-trade">
                <span className="text-wrapper">
                  <span className="code">Question</span>
                </span>
              </h1>
            </div>
            <div className="jumbotron">
              <p>Solution for {round} submitted </p>
            </div>
          </div>
        </div>
        <div className="container row">
          <div className="col-md-12 col-sm-12 col-12" id="question-text">
            <br />
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="container row">
        <div className="col-md-12 col-sm-12 col-12" id="question-text">
          <div className="dashboard">
            <h1 className="code-trade">
              <span className="text-wrapper">
                <span className="code">Questions</span>
              </span>
            </h1>
          </div>
          <div className="jumbotron">
            <p style={{ whiteSpace: "pre-line" }}>
              {" "}
              Round : {round.slice(-1)} / 3
            </p>
            <p style={{ whiteSpace: "pre-line" }}>
              {question.question ? question.question : null}
            </p>
            <img
              src={
                question.image
                  ? `${process.env.REACT_APP_BASE_URL}/images/${question.image}`
                  : null
              }
            />
          </div>
          {myComponents.length != 0 && (
            <div className="scroll-list">
              <QuestionsComponents
                list={myComponents}
                decrement={decrement}
                increment={increment}
                cart={cart}
                setCart={setCart}
              />
            </div>
          )}
        </div>

        <div className="col-md-12 col-sm-12 col-12">
          <div className="row" id="next-btn">
            <div className="col-md-4 col-sm-4 "></div>
            {/* <div className="col-md-4 col-sm-4  "> */}
            {file === null ? (
              <UploadButtons
                handleFileInput={(e) => {
                  console.log(e.target.files[0]);
                  setFile(e.target.files[0]);
                }}
              />
            ) : (
              <>
                <Button
                  disabled={loading || file === null}
                  onClick={askConfirm}
                  variant="contained"
                  className={classes.upld}
                  style={{ margin: "3px" }}
                >
                  {loading
                    ? "LOADING..."
                    : !file
                    ? "Upload file first"
                    : "Submit"}
                </Button>
                <Button
                  style={{ margin: "3px" }}
                  variant="contained"
                  className={classes.upld}
                  onClick={() => setFile(null)}
                >
                  Remove {file.name}
                </Button>
              </>
            )}

            {/* <button
                className="animated-button thar-three"
                disabled={loading || file === null}
                onClick={askConfirm}
              >
                {loading
                  ? "LOADING..."
                  : !file
                  ? "Upload file first"
                  : "Submit"}
              </button> */}
            {/* <button onClick={() => console.log(file)}>CLICKME</button> */}
            {/* </div> */}
            <div className="col-md-4 col-sm-4 "></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
