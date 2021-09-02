import React, { useState, useEffect,  useCallback, useContext } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import "../App.css";
import { AuthContext } from "../App";
import axios from "axios";
import { Alert } from 'reactstrap';


function Login() {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const onDismissAlert = () => setVisibleAlert(false);
  const { dispatch } = useContext(AuthContext);
  const initialState = {
    email: "",
    password: "",
    isSubmitting: false, 
    errorMessage: null,
  };
  const [inputValues, setInputValues] = useState({initialState});
  
  // set input values
  const handleOnChange = useCallback(event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  useEffect(() => {
    if(inputValues.isSubmitting){
      // post user details to api and use reponse to output result
      axios.post(process.env.REACT_APP_API_LOGIN, {
        "email": inputValues.email,
        "password": inputValues.password
      })
      .then((response) => {
        dispatch({
          type: "LOGIN",
          payload: response
        })
        throw response;
      })
      .catch((error) => {
        if(error.status === 200){
          setInputValues({
            ...inputValues,
            isSubmitting: false,
            errorMessage: error.status || error
          });
          setVisibleAlert(false);
        } else {
          // asign error response data for use within alert component
          setInputValues({
            ...inputValues,
            isSubmitting: false,
            errorMessage: error.response.data.message
          });
          setVisibleAlert(true);
        }
      });
    }
  }, [inputValues]);


  function handleSubmit(event) {
    event.preventDefault();
    setInputValues({
      ...inputValues,
      isSubmitting: true,
      errorMessage: null
    });
  } 

  return (
    <div>
      <div className="login">
        <div className="loginHeader">
          <h1>Login</h1>
        </div>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" name="email" id="email" 
            value={inputValues.email || ""}
            onChange={handleOnChange} />
        </FormGroup>
        <FormGroup >
          <Label>Password</Label>
          <Input type="password" name="password" id="password"
            value={inputValues.password || ""}
            onChange={handleOnChange}
            type="password" />
        </FormGroup>
        <Button block color="info" type="submit">
          Login
        </Button>
      </form>
      <div className="logAlert">
        <Alert color="info" isOpen={visibleAlert} toggle={onDismissAlert}>
          {inputValues.errorMessage}
        </Alert>
      </div>
      </div> 
    </div>
  );
}

export default Login;