const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', (req, res) => {

  const email = req.body.email
  const password = req.body.password;
  if (email == undefined || password == undefined) {
    res.status(400).json({ error: true, message: "Request body incomplete - email and password needed"});
    return;
  } 
  const queryUser = req.db.from("users").select("*").where("email", "=", email)
  queryUser
    .then((users) => {
      if(users.length > 0){
        console.log("User already exists");
        return;
      }

      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds)
      return req.db.from("users").insert({email, hash})
    })
    .then(() => {
      res.status(201).json({success: true, message: "User created"})
    })
    .catch((err) => {
      console.log(err);
      res.json({message : "Something went wrong"})
    })  
});

router.post("/login", function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if(!email || !password) {
    res.status(400).json({error: true, message: "Request body incomplete - email and password needed"})
    return;
  }

  const queryUsers = req.db.from("users").select("*").where("email", "=", email)
  queryUsers
    .then((users) => {
      if(users.length == 0) {
        res.status(401).json({error: true, message: "User does not exist"})
        return;
      }

      const user = users[0]
      return bcrypt.compareSync(password, user.hash)
    })
    .then((match) => {
      if(!match) {
        res.status(401).json({ error: true, message: "Incorrect password" })
        return;
      }
      
      const secretKey = process.env.JWTKEY
      const expires_in = 60 * 60 * 24 //1 Day
      const exp = Math.floor(Date.now() / 1000) + expires_in
      const token = jwt.sign({ email, exp } , secretKey )
      res.status(200).json({ token_type: "Bearer", token, expires_in: expires_in })

    })
    .catch((err) => {
      console.log(err);
      res.json({message : "Something went wrong"})
    })  
})

module.exports = router;