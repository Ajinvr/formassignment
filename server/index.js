const express = require("express");
const app = express();
const cors = require('cors');
const bcrypt = require("bcryptjs")
const port = 4000;
const saltround = 10;

app.use(cors());
app.use(express.json()); 

let users = [];
let details;
let profile;

const corsOptions = {
    origin: 'https://frontendform.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 201,
  };
  
  app.use(cors(corsOptions));


app.post('/', async (req, res) => {
    const {name,email,password} = req.body;
    
    if (users.find(user=>user.email == email)) {
        res.send({
            "success": "false",
            "user":true
        });
    }
    else{ 
        let hashpass = await bcrypt.hashSync(password,saltround)
        let formdetails ={
            name,
            email,
            hashpass
        }
        users.push(formdetails)
        profile={
            name,email
        }
        res.send({
            "success": "true",
        });}
   
});


app.post('/login', async (req,res)=>{
 details = req.body

if (users.find(user=>user.email == details.emailval)) {
    let login = users.find(user=>user.email == details.emailval)
    let passwordoriginal = login.hashpass
    let passwordfrmuser = details.passwordval
    let result = await bcrypt.compareSync(passwordfrmuser,passwordoriginal) 
    
    if (result) {

        let name = login.name 
        let email = login.email 
        profile = {
            name,email
        }

        res.send({
            "matched":true,  
                 })
      }
       else{
         res.send({
        "matched":false,
                  })
    }
     }else{
        res.send({
            "user":false
        })
     }

})



app.get("/",(req,res)=>{
    res.send(profile)
})

app.listen(port, function () {
    console.log(`running on port ${port}`);
});
