const express = require('express');
var axios = require('axios');

const app = express();
app.use(express.json())
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!').statusCode(200);
})

app.get('/expressGetData',(req, res) => {

    var config = {
        method: 'get',
        url: 'http://127.0.0.1:8000/getData',
        headers: { }
      };
      
      axios(config)
      .then( (response) => {
        //   console.log(response);
        res.status(200).json(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });

})

app.post('/expressPostData',(req,res) => {
    var data = req.body;
      console.log(data)

    // var config = {
    // method: 'post',
    // url: 'http://127.0.0.1:8000/postData',
    // headers: { 
    //     'Content-Type': 'application/json'
    // },
    // data : data
    // };

    axios.post('http://127.0.0.1:8000/postData',req.body,{headers: { 
      'Content-Type': 'application/json'
  }})
    .then(function (response) {
    response = response.data
    // console.log(JSON.stringify(response));
    res.status(200).send(response);
    })
    .catch(function (error) {
    console.log(error);
    });

})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})