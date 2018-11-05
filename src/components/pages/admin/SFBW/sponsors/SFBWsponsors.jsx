import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SectionHeader from '../../../../common/sectionHeader/sectionHeader';
import SponsorForm from '../../../../resources/SFBWsponsors/SFBWsponsorsForm';
import SponsorsList from '../../../../resources/SFBWsponsors/SFBWsponsorsList';

const SponsorsContainer = () => (
  <div>
    <SectionHeader
      title="SFBW Sponsors"
      icon="attach_money"
      sections={[{
        title: 'View Sponsors',
        icon: 'remove_red_eye',
        to: '/sfbw/sponsors',
      },
      {
        title: 'Add Sponsor',
        icon: 'note_add',
        to: '/sfbw/sponsors/new',
      }]}
      replaceHistory
    />
    <Switch>
      <Route
        exact
        path="/sfbw/sponsors"
        component={SponsorsList}
      />
      <Route
        exact
        path="/sfbw/sponsors/new"
        component={SponsorForm}
      />
      <Route
        path="/sfbw/sponsors/:id"
        component={SponsorForm}
      />
    </Switch>
  </div>
);

export default SponsorsContainer;
