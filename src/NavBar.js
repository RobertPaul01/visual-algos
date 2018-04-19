import React, { PureComponent } from 'react';
import { Redirect } from 'react-router'

export default class NavBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      redirect: undefined,
    }
  }

  render() {
    return (
      <div>
        { 
          !!this.state.redirect && <Redirect to={this.state.redirect} /> 
        }
        <select onChange={(event) => {
          this.setState({ redirect: event.target.value })
        }}>
          <option value="/">Home</option>
          <option value="/lcs">Longest Common Subsequence</option>
        </select>
      </div>
    );
  }

}
