const express = require('express');
const router = express.Router();
const mySQLError = {error: true, message: "Error in MySQL query"};
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get("/stocks/symbols", function(req,res, next) {
  const query = req.query.industry;
  const queryParameter = req.query;
  
  if(query != undefined) {
    let industry = "%"+req.query.industry+"%";
    req.db.from('stocks')
          .distinct('name', 'symbol', 'industry')
          .where("industry", "like", industry)
    .then((rows) => {
      if(!rows.length){
        res.status(404).json({error: true, message: "Industry sector not found"})
        return;
      }
      res.status(200).json(rows)
    })
    .catch((err) => {
      console.log(err);
      res.json(mySQLError)
    })
  } else if (Object.keys(queryParameter).length != 0 && !queryParameter.hasOwnProperty("industry")) {
      res.status(400).json({ error: true, message: "Invalid query parameter: only 'industry' is permitted" });
      return;
  } else {
    req.db.from('stocks').distinct("name", "symbol", "industry")
    .then((rows) => {
      res.status(200).json(rows)
    })
    .catch((err) => {
      console.log(err);
      res.json(mySQLError)
    })
  }
});

router.get('/stocks/:symbol', function(req, res, next) {
  console.log(req.query);
  const query = req.query;
  const from = req.query.from;
  const to = req.query.to;
  if(Object.keys(query).length == 0) {
    req.db.from('stocks')
          .distinct("*")
          .where("symbol", "=", req.params.symbol)
          .orderBy('timestamp', "desc")
    .then((row) => {
    if(!row.length){
      res.status(404).json({error: true, message: "No entry for symbol in stocks database"})
      return; 
    }
      res.status(200).json(row[0])
    })
    .catch((err) => {
      console.log(err);
      res.json(mySQLError)
    })
  } else {
    res.status(400).json({error: true, message: "Date parameters only available on authenticated route /stocks/authed"})
  } 
})

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  const secretKey = process.env.JWTKEY;
  let token = null;
  if( authorization && authorization.split(" ").length == 2) {
    token = authorization.split(" ")[1];
    
  } else {
    res.status(403).json({error: true, message: "Unauthorized user"})
  }

  try{
    const decoded = jwt.verify(token, secretKey)
    if(decoded.exp > Date.now()) {
      res.status(403).json({error: true, message: "Token has expired"})
      return;
    }
    next()
  } catch(err) {
    res.status(403).json({error: true, message: "Token is not valid"})
  }

}

router.get('/stocks/authed/:symbol', authorize, function(req, res) {

  if(!(req.headers && req.headers.authorization)) {
    res.status(403).json({error: true, message: "Authorization header not found"})
    return;
  }
  const from = req.query.from;
  const to = req.query.to;
  const queryParameter = req.query;

  if(Object.keys(queryParameter).length != 0 && !queryParameter.hasOwnProperty("from") && !queryParameter.hasOwnProperty("to")) {
    res.status(400).json({error: true, message: "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"})
    return;
  }

  if(from < "2019-11-05T14:00:00.000Z" || to > "2020-03-23T14:00:00.000Z") {
    res.status(404).json({error: true, message: 'Date range out of bounds, please select from 05/11/2019 to 23/03/2020'})
    return;
  } else if(from === to) {
    res.status(404).json({error: true, message: "from and to dates cannot be the same"})
    return;
  }
  req.db.from('stocks')
        .distinct("*")
        .where("symbol", "=", req.params.symbol)
        .whereBetween('timestamp', [from, to])
        .orderBy('timestamp', "desc")
  .then((rows) => {
    if(!rows.length){
      res.status(404).json({error: true, message: "No entry for symbol in stocks database"})
      return; 
    } else if(rows.length == 1) {
      res.status(200).json(rows[0])
      return;
    }
    
      res.status(200).json(rows)
  })
  .catch((err) => {
    console.log(err);
    res.json(mySQLError)
  })
});

module.exports = router;