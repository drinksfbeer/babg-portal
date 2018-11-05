import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../public/home/home';
import LoginContainer from '../public/login/loginContainer';
import customFormDisplay from '../public/customFormDisplay/customFormDisplay';
import Register from '../public/register/register';
import sfbwContainer from '../public/sfbw/sfbwContainer';

const Routes = [
  <Route
    exact
    path="/"
    component={Home}
    key="home"
  />,
  <Route
    exact
    path="/login"
    component={LoginContainer}
    key="login"
  />,
  <Route
    exact
    path="/login/sfbw"
    component={sfbwContainer}
    key="login"
  />,
  <Route
    exact
    path="/forgot"
    component={LoginContainer}
    key="forgot"
  />,
  <Route
    path="/forms/:id"
    component={customFormDisplay}
    key="form-builder-form"
  />,
  <Route
    exact
    path="/register"
    component={Register}
    key="register"
  />,
  <Route
    exact
    path="/register/sfbw"
    component={sfbwContainer}
    key="register"
  />,
];

export default Routes;
