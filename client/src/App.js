import React, { useState, useRef } from "react";
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

function App() {
  const [value, setDateValue] = useState(new Date());
  const sigCanvas = useRef({});
  const [tabValue, setTabValue] = React.useState("1");
  const [imageURL, setImageURL] = useState(null);
  const [name, setName] = useState("");

  let BASE_URL = "http://localhost:5000";

  //tab change
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //canvas actions
  const clear = () => sigCanvas.current.clear();
  const save = () => setImageURL(sigCanvas.current.toDataURL());

  //state value clearing
  const clearValue = () => {
    setImageURL(null);
  };

  //upload case validation and conversion
  const convert = (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
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
      name,
      date: value,
      signature: imageURL,
    };
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
  };

  return (
    <div className="flex flex-col justify-center w-full items-center ">
      <div className="flex justify-center">
        <p className="justify-center p-2 mt-8 text-[50px] font-medium md:mr-[20px] sm:ml-[24px] ">
          Create Signature
        </p>
      </div>
      <div className="flex flex-col justify-center md:mt-[80px] md:ml-[65px] sm:ml-[-11px] sm:mt-[10px]">
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
                  <Tab label="Draw" value="1" />
                  <Tab label="Upload" value="2" onClick={clearValue} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="green"
                  canvasProps={{
                    className:
                      "md:mt-[40px] md:w-[400px] sm:mt-[5px] sm:w-[239px] h-[250px] signatureCanvas",
                  }}
                />
                <div className="mt-[10px] flex flex-row">
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
                <div className="w-[239px] mt-[50px]">
                  <input type="file" onChange={convert} />
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
        <div className="p-2 mt-[20px]">
          <Button variant="contained" onClick={formSubmisson}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
