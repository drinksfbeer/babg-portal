import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import actions from '../../../../redux/actions/index';
import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import DeleteConfirmation from '../../../common/prompts/confirmation';
import AdminMemberDetails from '../../../resources/members/details/adminMemberDetails';
import MemberForm from '../../../resources/members/form/membersForm';
// import UserDirectory from '../../../resources/users/common/adminUserDirectory';
import LocationsList from '../../../resources/locations/list/adminLocationsList';
import LocationsNav from '../../../resources/locations/nav/adminLocationsNav';
import LocationForm from '../../../resources/locations/form/locationform';
// import AssignPlan from '../../../resources/subscriptions/assign-plan';
import AssignPlansForm from '../../../resources/subscriptions/plans/form/assignPlansForm';
import AdminCreateUser from '../../../resources/users/createUser/adminCreateUser';
import EventsForm from '../../../resources/events/form/eventsForm';

// assumes this component will be used as a component prop for a Route component

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';
const getPlans = async () => (
  (await axios.get(`${hostname}/api/v1/plans`)).data
);
const getCoupons = async () => (
  (await axios.get(`${hostname}/api/v1/coupons`)).data
);

class MemberDetailsContainer extends React.Component {
  async componentDidMount() {
    const { onLoadOfPlans, onLoadOfCoupons } = this.props;

    const plans = await getPlans();
    onLoadOfPlans(plans);

    const coupons = await getCoupons();
    onLoadOfCoupons(coupons);
  }

  render() {
    const {
      _list: members,
      loading,
      // error,
      match: {
        params: {
          id,
        },
      },
      history: {
        replace,
      },
      // users,
      plans,
      coupons,
      locations,
      events,
      asyncAction,
    } = this.props;

    const foundMember = members.find(member => member._id === id);
    if (!foundMember) return null;

    // const filteredUsers = users
    //   .filter(user => user.memberUuid && typeof user.member === 'object')
    //   .filter(user => user.memberUuid === foundMember.uuid);
    if (loading) return <Loading />;

    const memberEvents = events
      .filter(event => (
        moment(event.endDate).isAfter(moment()) &&
        event.location &&
        event.location.member &&
        event.location.member.uuid === foundMember.uuid
      ));

    /*
    // removed since we now have the accounts management system
    {
      title: 'Users',
      icon: 'supervised_user_circle',
      to: `/member/${foundMember._id}/users`,
    },
    */

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
          }, {
            title: 'Edit Member',
            icon: 'edit',
            to: `/member/${foundMember._id}/edit`,
          }, {
            title: 'Subscription',
            icon: 'card_membership',
            to: `/member/${foundMember._id}/subscription`,
          }, {
            title: 'Locations',
            icon: 'edit_location',
            to: `/member/${foundMember._id}/locations`,
          }, {
            title: 'Create New Event',
            icon: 'event',
            to: `/member/${foundMember._id}/events/new`,
          }, {
            title: 'Delete Member',
            icon: 'delete_forever',
            to: `/member/${foundMember._id}/delete`,
            color: '#cc4b37',
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
        <Route
          exact
          path="/member/:id/edit"
          render={() => (
            <div className="sectionPadding">
              <h2 className="text-center">
                Edit Member
              </h2>
              <MemberForm
                member={foundMember}
                isAdmin
              />
            </div>
          )}
        />
        <Route
          exact
          path="/member/:id/subscription"
          render={() => (
            <div className="sectionPadding">
              <AssignPlansForm
                plans={plans}
                coupons={coupons}
                member={foundMember}
                asyncAction={asyncAction}
              />
            </div>
          )}
        />
        <Route
          exact
          path="/member/:id/locations"
          render={() => {
            if (!foundMember.locations) {
              console.warn('member requires locations, check backend code for missing locations'); // eslint-disable-line
              return null;
            }
            // const locations = foundMember.locations.map(location => ({
            //   ...location,
            //   member: {
            //     name: foundMember.name,
            //     image: foundMember.image,
            //   },
            // }));
            const memberLocations = locations
              .filter(location => location.memberUuid === foundMember.uuid)
              .map(location => ({
                ...location,
                member: {
                  name: foundMember.name,
                  image: foundMember.image,
                },
              }));
            return (
              <div className="sectionPadding">
                <LocationsNav member={foundMember} />
                <h3 style={{ borderBottom: 'solid grey 2px' }}>
                  Brewery Locations
                </h3>
                <LocationsList
                  member={foundMember}
                  locations={memberLocations.filter(location => location.profileLocation)}
                />
                <div style={{ padding: '30px' }} />
                <h3 style={{ borderBottom: 'solid grey 2px' }}>
                  Event Only Venues
                </h3>
                <LocationsList
                  member={foundMember}
                  locations={memberLocations.filter(location => !location.profileLocation)}
                />
              </div>
            );
          }}
        />
        <Route
          exact
          path="/member/:id/events/new"
          render={() => (
            <EventsForm member={foundMember} />
          )}
        />
        <Route
          exact
          path="/member/:id/locations/new"
          render={() => (
            <div className="sectionPadding">
              <Link
                to={`/member/${foundMember._id}/locations`}
                style={{ fontStyle: 'italic' }}
              >
                <span style={{ fontSize: '200%' }}>
                  &#8249;
                </span>
                Back to Locations List
              </Link>
              <h2>Create New Location</h2>
              <LocationForm member={foundMember} />
            </div>
          )}
        />
        {/* <Route
          exact
          path="/member/:id/users"
          render={() => (
            <div className="sectionPadding">
              <UserDirectory users={filteredUsers} />
            </div>
          )}
        /> */}
        {
          foundMember &&
          <Route
            exact
            path="/member/:id/users/add"
            render={() => (
              <div className="sectionPadding">
                <AdminCreateUser
                  member={foundMember}
                  asyncAction={asyncAction}
                />
              </div>
            )}
          />
        }
        <Route
          exact
          path="/member/:id/delete"
          render={() => (
            <DeleteConfirmation
              message="Are you sure you want to delete this member forever?"
              resource="members"
              record={foundMember}
              response={(err, response) => {
                if (response && !err) {
                  replace('/guild/members');
                }
              }}
            />
          )}
        />
      </div>
    );
  }
}

MemberDetailsContainer.propTypes = {
  _list: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  // error: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  // users: PropTypes.arrayOf(PropTypes.shape({
  //   memberUuid: PropTypes.string,
  //   member: PropTypes.shape({
  //     uuid: PropTypes.string.isRequired,
  //     locations: PropTypes.arrayOf(PropTypes.shape({
  //       name: PropTypes.string.isRequired,
  //     })),
  //   }),
  // })),
  plans: PropTypes.arrayOf(PropTypes.shape({})),
  coupons: PropTypes.arrayOf(PropTypes.shape({})),
  onLoadOfPlans: PropTypes.func.isRequired,
  onLoadOfCoupons: PropTypes.func.isRequired,
  asyncAction: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
};

MemberDetailsContainer.defaultProps = {
  _list: [],
  // users: [],
  locations: [],
  events: [],
  loading: false,
  plans: [],
  coupons: [],
  // error: false,
};

export default connect(
  state => ({
    ...state.members.list,
    // users: state.users.list._list,
    plans: state.plans,
    coupons: state.coupons,
    locations: state.locations.list._list,
    events: state.events.list._list,
  }),
  dispatch => ({
    onLoadOfPlans: items => (
      dispatch(actions.plans({
        type: 'SET_PLANS',
        data: {
          items,
        },
      }))
    ),
    onLoadOfCoupons: items => (
      dispatch(actions.coupons({
        type: 'SET_COUPONS',
        data: {
          items,
        },
      }))
    ),
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
  }),
  null,
  { pure: false },
)(MemberDetailsContainer);
