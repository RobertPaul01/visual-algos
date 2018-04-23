import React, { PureComponent } from 'react';
import './Home.css';

export default class NavBar extends PureComponent {
  render() {
    return (
      <div className="Home-Text">
        <p>
          Hi,
        </p>
        <p>
          On this website, I will be showing some algorithm visualizations written with ReactJS. I will be showing algorithms that I think are interesting and easy to follow.
        </p>
        <p>
          If you find some of the visuals hard to understand, I would recommend slowing them down and using smaller test cases.
        </p>
      </div>
    )
  }
}