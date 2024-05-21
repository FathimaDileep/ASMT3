const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path"); 
const cors = require ("cors");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());


//path to file containing data
const dataPath = path.join(__dirname,"hospdata.json");

 
//write data to JSON file
function writeDataToFile(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data), "utf8");
  }


//read data from JSON file
function readDataFromFile() {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  }


//get hospital
app.get("/api/hospitals",(req,res)=> {
    const data = readDataFromFile();
    res.send(data.hospitals);
  });

//post a hospital
app.post("/api/hospitals",(req,res)=> {
  const data = readDataFromFile();
  const newHospital = {
    id: Date.now().toString(),
    name: req.body.name,
    patientCount: req.body.patientCount,
    location: req.body.location,
  };
  data.hospitals.push(newHospital);
  writeDataToFile(data);
  res.status(201).send(newHospital);
});

// Update an existing hospital
app.put("/api/hospitals/:id",(req,res)=> {
  const data = readDataFromFile();
  const hospital = data.hospitals.find((h) => h.id === req.params.id);
  if (!hospital) {
    res.status(404).send("Hospital not found");
    return;
  }
  hospital.name = req.body.name;
  hospital.patientCount = req.body.patientCount;
  hospital.location = req.body.location;
  writeDataToFile(data);
  res.send(hospital);
});

//delete a hospital
app.delete("/api/hospitals/:id",(req,res) => {
  const data = readDataFromFile();
  const hospitalIndex = data.hospitals.findIndex((h) => h.id === req.params.id);
  if (hospitalIndex === -1) {
    res.status(404).send("Hospital not found");
    return;
  }
  data.hospitals.splice(hospitalIndex, 1);
  writeDataToFile(data);
  res.send(`Hospital with ID ${req.params.id} deleted`);
});



const port = process.env.PORT ||3000
app.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
});

