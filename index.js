import express from "express";
import bodyparser from "body-parser"
import axios from "axios";
import { render } from "ejs";

var port = 3000;
var app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  app.post("/submit",async (req,res)=>{
    let lat = 0;
    let lon = 0;
    const city = req.body.cityName;
    const api = "45eb26615f0908533d339ed9b65014f5";
    try{
        const respond = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`);
        const result = respond.data;
         lat =result[0].lat;
         lon = result[0].lon;
    }
    catch(error){
       console.error("failed to make request ",error.message)
    }
    try{
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}`)
        const result =  response.data;
        let main = result.list[10].weather[0].main;
        let message = "";

        console.log(main);

        switch(main){
          case "Rain":
           message = "tomorrow will rain please  should use ambrella 🌂 and dont use makeup 😂" ;
           break;
          case "Clear":
            message = "tomorrow your free just use sunglass if you have";
            break;
          case "Snow":
            message = "buy cot and sweater if you dont have it will be ❄️";
            break;
          case "Clouds":
            message = "tomorrow it will be darker some how you can have touch";
            break;
          case "Drizzle":
            message = "its better tomorrow to take ambrella and sweater ";
            break;
          case "Thunderstorm":
            message = "head phone its so important tomorrow because Voice will be to loud ⛈️";
            break;
          default:
            message = "nothing to woory";
            break;

        }

        res.render("index.ejs",{
          data:result, message:message
        });
        // console.log(result.list[10].weather[0].main);
    
    }
    catch(error){
        console.error("connection failed " ,error.message)
    }
    
  })

app.listen(port,()=>{
console.log(`server are connected at port ${port}`);

});
