import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import moment from 'moment';

import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import AdminMemberDetails from '../../../resources/members/details/adminMemberDetails';

// assumes this component will be used as a component prop for a Route component

const MemberDetailsContainer = ({
  _list: members,
  loading,
  // error,
  match: {
    params: {
      id,
    },
  },
  events,
}) => {
  const foundMember = members.find(member => member._id === id);
  if (!foundMember) return null;

  const memberEvents = events
    .filter(event => (
      moment(event.endDate).isAfter(moment()) &&
      event.location &&
      event.location.member &&
      event.location.member.uuid === foundMember.uuid
    ));

  if (loading) return <Loading />;

  return (
    <div>
      <SectionHeader
        replaceHistory
        title={foundMember.name}
        icon="account_balance"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          to: '/events',
          color: 'rgba(0,0,0,0.6)',
        }, {
          title: 'See Details',
          icon: 'pageview',
          to: `/member/${foundMember._id}`,
        }]}
      />
      <Route
        exact
        path="/member/:id"
        render={() => (
          <div className="sectionPadding">
            <AdminMemberDetails
              member={foundMember}
              events={memberEvents}
            />
          </div>
        )}
      />
    </div>
  );
};

MemberDetailsContainer.propTypes = {
  _list: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  // error: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})),
};

MemberDetailsContainer.defaultProps = {
  _list: [],
  loading: false,
  // error: false,
  events: [],
};
export default connect(
  state => ({
    ...state.members.list,
    users: state.users.list._list,
    events: state.events.list._list,
  }),
  null,
  null,
  { pure: false },
)(MemberDetailsContainer);
