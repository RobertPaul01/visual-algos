import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import Home from './Home';
import LCS from './LCS';
import NavBar from './NavBar';
import './index.css';

const AppRoutes = () => (
  <div className="MainContainer">
    <div>
      <NavBar />
    </div>
    <hr/>

    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/lcs" component={LCS} />
    </div>
  </div>
);

ReactDOM.render((
  <HashRouter>
    <AppRoutes/>
  </HashRouter>
), document.getElementById("root"));
registerServiceWorker();
