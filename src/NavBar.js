import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'

export default class NavBar extends PureComponent {

  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <br/> 
        {"Algorithms: "}
        <Link to="/lcs">Longest Common Subsequence</Link>
      </div>
    );
  }

}
