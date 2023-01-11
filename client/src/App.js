import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SignatureCanvas from "react-signature-canvas";
import "./signatureCanvas.css";
import axios from "axios";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

function App() {
  const [value, setDateValue] = useState(new Date());
  const sigCanvas = useRef({});
  const canvas = useRef({});
  const canvas2 = useRef({});
  const [tabValue, setTabValue] = React.useState("1");
  const [imageURL, setImageURL] = useState(null);
  const [name, setName] = useState("");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [fontView, setFontView] = useState(true);
  const [initial, setInitial] = useState("");

  let BASE_URL = "http://localhost:5000";

  //tab change
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //canvas actions
  const clear = () => sigCanvas.current.clear();
  const save = () => {
    setImageURL(sigCanvas.current.toDataURL());
    toast.success("Signature Saved");
  };

  //state value clearing
  const clearValue = (value) => {
    setImageURL(null);
    if (value === 1) {
      setFontView(true);
    } else if (value === 2) {
      setFontView(false);
    }
    // setFontView((prev) => !prev);
  };

  //for predefined font draw
  const draw = (context) => {
    context.font = "30px monospace";
    context.fillText(`${name} ${initial}`, 10, 50);
  };
  const draw2 = (context) => {
    context.font = "30px serif";
    context.fillText(`${name} ${initial}`, 10, 50);
  };
  useEffect(() => {
    if (fontView === true && name.length) {
      const context = canvas.current.getContext("2d");
      const contextt = canvas2.current.getContext("2d");
      draw(context);
      draw2(contextt);
    }
  });

  //upload case validation and conversion
  const convert = (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
      toast.error("Please choose jpg,jpeg,png file", {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    }
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      console.log(reader.result); //base64encoded string
      setImageURL(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  //Api call for form submisssion
  const formSubmisson = async () => {
    console.log("name", name);
    console.log("date", value);
    console.log("SignatureUrl", imageURL);

    let data = {
      firstName: name,
      lastName: initial,
      date: value,
      signature: imageURL,
    };
    if (data.signature !== null) {
      await axios
        .post(`${BASE_URL}/form`, data)
        .then(function (response) {
          console.log(response);
          toast.success("Form data saved successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        .catch(function (error) {
          toast.error("Something went wrong", {
            position: "top-right",
            autoClose: 5000,
          });
          console.log(error);
        });
    } else {
      toast.error("Please add valid signature", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  useEffect(() => {
    if (check1 === true) {
      setImageURL(canvas.current.toDataURL());
    } else if (check2 === true) {
      setImageURL(canvas2.current.toDataURL());
    } else {
      setImageURL(null);
    }
  }, [check1, check2]);
  const check1Handler = () => {
    setCheck1((check) => !check);
    setCheck2(false);
  };
  const check2Handler = () => {
    setCheck2((check) => !check);
    setCheck1(false);
  };
  return (
    <div className="flex flex-col justify-center w-full items-center ">
      <div className="flex justify-center">
        <p className="justify-center p-2 mt-8 text-[50px] font-medium md:mr-[20px] sm:ml-[24px] ">
          Create Signature
        </p>
      </div>
      <div className="flex flex-col justify-center md:mt-[80px] md:ml-[65px] sm:ml-[190px] sm:mt-[10px]">
        <div className="flex flex-row">
          <div className="sm:ml-[2px] md:ml-[2px]">
            <TextField
              className="md:w-[400px]"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="sm:ml-[2px] md:ml-[8px] ">
            <TextField
              className="md:w-[400px]"
              id="outlined-basic"
              label="Initail"
              variant="outlined"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
            />
          </div>
        </div>
        <div className="md:mr-[80px] mt-[30px] md:w-[400px] sm:ml-[2px] md:ml-[2px]">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date"
              value={value}
              onChange={(newValue) => {
                setDateValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>

        <div className="mt-[30px]">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Draw" value="1" onClick={() => clearValue(1)} />
                  <Tab label="Upload" value="2" onClick={() => clearValue(2)} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className:
                      "md:mt-[40px] md:w-[400px] sm:mt-[5px] sm:w-[239px] h-[250px] signatureCanvas",
                  }}
                />
                <div className="mt-[10px] flex flex-row ">
                  <div className="mt-[10px]">
                    <Button variant="outlined" onClick={save}>
                      Save
                    </Button>
                  </div>
                  <div className="mt-[10px] ml-[10px] ">
                    <Button variant="outlined" onClick={clear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="sm:w-[239px] mt-[50px] md:w-[400px] sm:mr-[190px]">
                  <input type="file" onChange={convert} />
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
        {fontView ? (
          <div className="m:w-[400px]">
            <p className="text-[20px]">Predefined font</p>
            {name.length ? (
              <>
                <div className="flex flex-row">
                  <div className="mt-[20px]">
                    <Checkbox
                      {...label}
                      checked={check1}
                      onChange={check1Handler}
                    />
                  </div>
                  <div>
                    <canvas
                      ref={canvas}
                      id="myCanvas"
                      key={name.length + "1"}
                      width="500"
                      height="100"
                    ></canvas>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="mt-[20px]">
                    <Checkbox
                      {...label}
                      checked={check2}
                      onChange={check2Handler}
                    />
                  </div>
                  <div>
                    <canvas
                      ref={canvas2}
                      key={name.length + "2"}
                      id="myCanvas"
                      width="500"
                      height="100"
                    ></canvas>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-5">Please enter your name </div>
            )}
          </div>
        ) : null}
        <div className="flex flex-row mb-[100px]">
          <div className="p-2 mt-[5px]">
            <Button variant="contained" onClick={formSubmisson}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} /*  */

export default App;
