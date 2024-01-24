import React, { PureComponent } from "react";
import { Route, Routes, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Department from "../Department/index";
import User from "../Users/index";

class Routers extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return (
      <Routes>
        <Route exact path="/" element={<Department />}></Route>
        <Route exact path="/user" element={<User />}></Route>
      </Routes>
    );
  }
}

export default Routers;
