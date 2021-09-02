import React, { useState, useCallback, useContext, useEffect } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import "../App.css";
import axios from "axios";
import { Alert } from 'reactstrap';
import { AuthContext } from "../App";

function Register () {
  const [visibleAlert, setVisibleAlert] = useState(false);
  const onDismissAlert = () => setVisibleAlert(false);
  const { dispatch } = useContext(AuthContext);
  const initialState = {
    email: "",
    password: "",
    isSubmitting: false, 
    errorMessage: null,
  };
  
  // assign input values to state when input fields are changed
  const [inputValues, setInputValues] = useState({initialState});
  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  useEffect(() => {
    if( inputValues.isSubmitting ) {
      // pose request for new user
      axios.post(process.env.REACT_APP_API_REGISTER, {
        "email": inputValues.email,
        "password": inputValues.password
      })
      // throw response for access to api error information
      // needed to display api error information
      .then((response) => {
        throw response;
      })
      .catch((error) => {
        if(error.status === 201){
          setInputValues({
            ...inputValues,
            isSubmitting: false,
            errorMessage: error.data.message || error
          });
          // dispatch to update registered so that user is routed to login page
          dispatch({
            type: "REGISTER"
          })
          setVisibleAlert(false);
        } else {
          // set error response for display within the alert component
          setInputValues({
            ...inputValues,
            isSubmitting: false,
            errorMessage: error.response.data.message
          });
          setVisibleAlert(true);
        }
      });
    }
  }, [ inputValues ]);

  
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
      <div className="register">
          <div>
            <h1>Register</h1>
          </div>
          <form onSubmit={ handleSubmit }>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" id="email" 
                  value={ inputValues.email || "" }
                  onChange={ handleOnChange } 
                  />
              </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" name="password" id="password"
                  value={ inputValues.password || "" }
                  onChange={ handleOnChange }
                  />
            </FormGroup>
            <FormGroup>
              <Button 
                block 
                color="info"
                type="submit"
                disabled={ inputValues.isSubmitting }>
                  { inputValues.isSubmitting ? ("Processing...") 
                  : ("Register User") }
              </Button>
            </FormGroup>
          </form>
          <div>
            <Alert color="info" isOpen={ visibleAlert } toggle={ onDismissAlert }>
              { inputValues.errorMessage }
            </Alert>
          </div>
        </div>
    </div>    
  );
}

export default Register;