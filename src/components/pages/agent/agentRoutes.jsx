import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AgentEventsContainer from './events/agentEventsContainer';
import SFBWeventsDetails from './events/agentEventsDetailsContainer';
import Payment from './payment/payment';
import Four04 from '../../common/404/404';

const Routes = (
  <Switch>
    <Route
      path="/sfbw/events"
      component={AgentEventsContainer}
    />
    <Route
      path="/sfbw/payment"
      component={Payment}
    />
    <Route
      path="/sfbw/event/:id"
      component={SFBWeventsDetails}
    />
    <Route component={Four04} />
  </Switch>
);

export default Routes;
