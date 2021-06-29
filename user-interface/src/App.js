import logo from './logo.svg';
import './App.css';
import React,{useState} from "react";

var [state,setState] = [null,undefined]
var content = null;

function postToLearn(data){
  
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
      var headers = [],values = []
      result['inputs'].forEach((val,ind,arr) => {
        var inputs = (<td><input placeholder={"Enter a "+val[1]} type={val[1]} title={val[0]}></input></td>);
        var options;
        if(val[0] === "Sex"){

            options = result["gender"].map((gen) => {
            return (<option title={val[0]} value={gen}>{gen}</option>);
          })
          inputs = (<select id={val[0]}>{options}</select>)
        }
        else if (val[0] === "Embarked")
        {
            options = result["Embarked"].map((gen) => {
            return (<option title={val[0]} value={gen}>{gen}</option>);
          })
          inputs = (<select id={val[0]}>{options}</select>)
        }
        const title = (<th>{val[0]}</th>)
        headers.push(title)
        values.push(inputs)
      })
      content = (<div class="container">
                  <div class="row">
                  <p class="fs-3 fw-bold text-center">Predicted value is :</p>
                  <p class="fs-1 fw-bolder text-center"></p>
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
                  <div class="row">
                  </div>
                  </div>);
      setState({...state,loading: false,once: false});
    })
    .catch(error => console.log('error', error));
}

function App() {
  [state,setState] = useState({loading: true,once: true});

  if(state.loading === true){
    content = (<div class="loader">
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
  </div>)
  }

  if(state.once === true){
    getData();
  }

  return content;
}

export default App;
