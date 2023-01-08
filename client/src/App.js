import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SignatureCanvas from "react-signature-canvas";
import "./signatureCanvas.css";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";

function App() {
  const [value, setDateValue] = useState(new Date());
  const sigCanvas = useRef({});

  console.log("date", value);
  const [tabValue, setTabValue] = React.useState("1");
  const [imageURL, setImageURL] = useState(null);
  console.log("imageusrl", imageURL);

  //tab change
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //canvas actions
  const clear = () => sigCanvas.current.clear();
  const save = () => setImageURL(sigCanvas.current.toDataURL());

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
                  <Tab label="Upload" value="2" />
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
                <div className="w-[239px]">
                  <input type="file" />
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default App;
