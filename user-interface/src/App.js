import './App.css';
import ReactDOM from "react-dom";
import React,{useState} from "react";

var [state,setState] = [null,undefined]
var content = null;
var load = (<div class="loader">
<div class="loader-inner">
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
</div>
</div>);

function postToLearn(data){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: data,
  redirect: 'follow'
};

fetch("http://localhost:5000/expressPostData", requestOptions)
  .then(response => response.text())
  .then(result => {
    result = JSON.parse(result);
    var loader = document.getElementById('columns')
    var others = document.getElementById('others')
    ReactDOM.render((<div class="spinner-border text-secondary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>),loader);
    ReactDOM.render("",others);
    
    var columns = result['columns'].map((col) => {
      return(<div class="col"><img src={`data:image/jpeg;base64,${col}`}></img></div>)
    })

    var otherContent = [(<div class="col"><img src={`data:image/jpeg;base64,${result['scatter_matrix']}`}></img></div>),(<div class="col"><img src={`data:image/jpeg;base64,${result['object_columns']}`}></img></div>)]
  
    ReactDOM.render((<div class="overflow">{columns}</div>),loader);
    ReactDOM.render(otherContent,others);
    ReactDOM.render(result['prediction'],document.getElementById('prediction'));

  })
  .catch(error => console.log('error', error));
}

function submit(){
  var inputs = [...document.getElementsByTagName('INPUT')];
  var selections = [...document.getElementsByTagName('SELECT')]

  var data = {Age: 0};
  inputs.forEach((input) => {
    var value = input.value
    if(isNaN(value) === false){
      data[input.getAttribute('title')] =[ (value.search('.') === -1)?parseFloat(value):parseInt(value)];
    }else{
      data[input.getAttribute('title')] = [value];
    }
  })

  selections.forEach((select) => {
    var selected = select.options;
    var index = select.selectedIndex;
    console.log('selected option =',selected[index].getAttribute('title'),", selected value =",selected[index].value)
    data[selected[index].getAttribute('title')] = [selected[index].value];
  })

  delete data[null];
  console.log("data = ",JSON.stringify(data));
  postToLearn(data);

}

function getData(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://localhost:5000/expressGetData", requestOptions)
    .then(response => response.text())
    .then(result => {
      result = JSON.parse(result);
      console.log(result);
      var headers = [],values = []
      result['inputs'].forEach((val,ind,arr) => {
        // console.log(val);
        var inputs = (<td><input placeholder={"Enter a "+val[1]} type={val[1]} title={val[0]}></input></td>);
        var options;
        if(val[0] === "Sex"){

            options = result["gender"].map((gen) => {
            return (<option title={val[0]} value={gen}>{gen}</option>);
          })
          inputs = (<select id={val[0]} defaultValue={result['gender'][0]}>{options}</select>)
        }
        else if (val[0] === "Embarked")
        {
            options = result["Embarked"].map((gen) => {
            return (<option title={val[0]} value={gen}>{gen}</option>);
          })
          inputs = (<select id={val[0]} defaultValue={result['Embarked'][0]}>{options}</select>)
        }
        const title = (<th>{val[0]}</th>)
        headers.push(title)
        values.push(inputs)
      })

      var columns = <div class="overflow">{result['columns'].map((col) => {
        return(<div class="col"><img src={`data:image/jpeg;base64,${col}`}></img></div>)
      })}</div>
  
      var otherContent = [(<div class="col"><img src={`data:image/jpeg;base64,${result['scatter_matrix']}`}></img></div>),(<div class="col"><img src={`data:image/jpeg;base64,${result['object_columns']}`}></img></div>)]

      content = (<div class="container">
                  <div class="row">
                  <p class="fs-3 fw-bold text-center">Predicted value is :</p>
                  <p id="prediction" class="fs-1 fw-bolder text-center"></p>
                  </div>
                  <div class="row">
                  <table class="table">
                  <thead>
                    <tr>
                      {headers}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {values}
                    </tr>
                    </tbody>
                    </table>
                    <button onClick={submit} type="button" class="btn btn-secondary">Submit</button>
                  </div>
                  <div id="columns" class="row">
                  {columns}
                  </div>
                  <div id="others" class="row"></div>
                  {otherContent}
                  </div>);
      setState({...state,loading: false,once: false});
    })
    .catch(error => console.log('error', error));
}

function App() {
  [state,setState] = useState({loading: true,once: true});

  if(state.loading === true){
    content = load;
  }

  if(state.once === true){
    getData();
  }

  return content;
}

export default App;
