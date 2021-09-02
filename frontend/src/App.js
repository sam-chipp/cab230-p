import React from 'react';
import './App.css';
import Logo from "./stock-image.jpg";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, 
  Redirect
} from "react-router-dom";
import StocksTable from "./components/StocksTable";
import QuoteTable from "./components/QuoteTable";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
 
export const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  isRegistered: false,
  token: null
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", JSON.stringify(action.payload.data.token));
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: false,
        token: action.payload.data.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        isRegistered: false,
        token: null
      };
    case "REGISTER":
      return {
        ...state,
        isRegistered: true
      }
    default:
      return state;
  }
};


function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/searchStocks">Stocks</Link>
          </li>
          <li className="li-Right">
            {!state.isAuthenticated ? <Link to="/login">Login</Link> : <Link to="/logout" onClick={() => dispatch({type: "LOGOUT"})}>Logout</Link> }
          </li>
          <li className="li-Right">
            {!state.isAuthenticated ? <Link to="/resgisterUser"  onClick={() => dispatch({type: "LOGOUT"})}>Register</Link> : <div></div>}
          </li>
        </ul>
        <Switch>
          <Route exact path="/">
            <Home  />
          </Route>
          <Route path="/searchStocks">
              <StocksTable />
              <QuoteTable isAuthenticated={state.isAuthenticated} />
          </Route>
          <Route path="/resgisterUser">
          <AuthContext.Provider
                  value={{
                    state,
                    dispatch
                  }}
                >
                  <div className="App">{!state.isRegistered ? <Register /> : <Redirect to="/login" />}</div>
            </AuthContext.Provider>
          </Route>
          <Route path="/login">
            <AuthContext.Provider
                  value={{
                    state,
                    dispatch
                  }}
                >
                  <div className="App">{!state.isAuthenticated ? <Login /> : <Redirect to="/searchStocks" />}</div>
            </AuthContext.Provider>
          </Route>
          <Route path="/logout">
              <Redirect to="/login" />}
          </Route>
        </Switch>
      </div>
      </Router>
  );
}

// simple home page, handle locally for convenience
function Home() {
  return (
    <div className="home">
     <h1>Stock Finder</h1>
      <p>Welcome to the stock finder portal. Click Stocks to see all our available companies and 
      search for stock pricing.
      </p>
      <img  src={Logo} alt="stock-image"></img>
    </div>
  );
}

export default App;
