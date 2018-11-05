import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DashboardContainer from './dashboard/memberDashboardContainer';
import GuildContainer from './guildActivity/memberGuildActivityContainer';
import LocationsContainer from './locations/memberLocationsContainer';
import LocationDetailsContainer from './locationDetails/memberLocationDetailsContainer';
import MemberDetailsContainer from './memberDetails/memberMemberDetailsContainer';
import EventsContainer from './events/memberEventsContainer';
import EventDetailsContainer from './eventDetails/memberEventDetailsContainer';
import AccountsContainer from './accounts/memberAccountsContainer';
import SettingsContainer from './settings/settingsContainer';

import Four04 from '../../common/404/404';

const Routes = (
  <Switch>
    <Route
      path="/dashboard"
      component={DashboardContainer}
    />
    <Route
      path="/guild"
      component={GuildContainer}
    />
    <Route
      path="/locations"
      component={LocationsContainer}
    />
    <Route
      path="/events"
      component={EventsContainer}
    />
    <Route
      path="/location/:id"
      component={LocationDetailsContainer}
    />
    <Route
      path="/event/:id"
      component={EventDetailsContainer}
    />
    <Route
      path="/member/:id"
      component={MemberDetailsContainer}
    />
    <Route
      path="/accounts"
      component={AccountsContainer}
    />
    <Route
      path="/account/:id"
      component={AccountsContainer}
    />
    <Route
      path="/settings"
      component={SettingsContainer}
    />
    <Route component={Four04} />
  </Switch>
);

export default Routes;
