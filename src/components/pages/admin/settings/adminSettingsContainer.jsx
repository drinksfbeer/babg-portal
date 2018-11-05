import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import MemberForm from '../../../resources/members/form/membersForm';
// import LocationsList from '../../../resources/locations/list/adminLocationsList';
import PortalForm from '../../../resources/portal/form/portalForm';
import PublicEventSettingsForm from '../../../resources/events/form/publicEventsSettingsForm';

const AdminSettingsContainer = ({
  user,
  pages,
  settings,
}) => {
  if (!user) return null;
  const { member } = user;
  // event venues temporarily removed until we figure out where to put it
  // (doesn't make any sense that it's in the settings)
  /* const locations = member.locations.map(loc => ({
    ...loc,
    member: {
      image: member.image,
      name: member.name,
    },
  })); */

  return (
    <div>
      <SectionHeader
        replaceHistory
        title="Guild Settings"
        icon="settings"
        sections={[{
          title: 'Bay Area Brewers Profile',
          icon: 'recent_actors',
          to: '/settings',
          exact: true,
        }, /* {
          title: 'Event Venues',
          icon: 'calendar_today',
          to: '/settings/venues',
          exact: true,
          }, */ {
          title: 'Portal Settings',
          icon: 'developer_board',
          to: '/settings/portal',
          exact: true,
        }, {
          title: 'Festival Events',
          icon: 'date_range',
          to: '/settings/festival',
          exact: true,
        }]}
      />
      <Route
        exact
        path="/settings"
        render={() => (
          <div className="sectionPadding">
            <MemberForm
              member={member}
            />
          </div>
        )}
      />
      {/* <Route
        exact
        path="/settings/venues"
        render={() => (
          <div className="sectionPadding">
            <LocationsList
              locations={locations}
            />
          </div>
        )}
      /> */}
      <Route
        exact
        path="/settings/portal"
        render={() => (
          <div className="sectionPadding">
            <PortalForm
              settings={settings[0]}
              user={user}
              pages={pages}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/settings/festival"
        render={() => (
          <div className="sectionPadding">
            <PublicEventSettingsForm
              settings={settings[0]}
              user={user}
            />
          </div>
        )}
      />
    </div>
  );
};

AdminSettingsContainer.propTypes = {
  user: PropTypes.shape({}),
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  settings: PropTypes.arrayOf(PropTypes.shape({})),
};

AdminSettingsContainer.defaultProps = {
  user: null,
  pages: [],
  settings: [],
};
export default connect(
  state => ({
    user: state.users.auth.user,
    pages: state.pages.list._list,
    settings: state.settings.list._list,
  }),
  null,
  null,
  { pure: false },
)(AdminSettingsContainer);
