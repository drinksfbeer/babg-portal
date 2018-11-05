/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import notifications from 'react-notification-system-redux';
import axios from 'axios';

// import Subscriptions from '../../../resources/subscriptions/subscriptions';
import actions from '../../../../redux/actions/index';
import Loading from '../../../common/loading/loading';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import GuildSubscriptionsManagement from '../../../resources/subscriptions/management/guildSubscriptionsManagement'; // eslint-disable-line
import ChapterSubscriptionsManagement from '../../../resources/subscriptions/management/chapterSubscriptionsManagement'; // eslint-disable-line
import PlansList from '../../../resources/subscriptions/plans/list/plansList';
import PlansForm from '../../../resources/subscriptions/plans/form/plansForm';
import CouponsList from '../../../resources/subscriptions/coupons/list/couponsList';
import CouponsForm from '../../../resources/subscriptions/coupons/form/couponsForm';

// const SubscriptionsContainer = ({
//   members,
//   plans,
//   coupons,
//   onLoadOfPlans,
//   onLoadOfCoupons,
//   asyncAction,
// }) => (
//   <div>
//     <Subscriptions
//       members={members}
//       plans={plans}
//       coupons={coupons}
//       onLoadOfPlans={onLoadOfPlans}
//       onLoadOfCoupons={onLoadOfCoupons}
//       asyncAction={asyncAction}
//     />
//   </div>
// );

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

class SubscriptionsContainer extends React.Component {
  async componentDidMount() {
    const {
      plans,
      onLoadOfPlans,
      coupons,
      onLoadOfCoupons,
    } = this.props;

    if (!plans.length) {
      const plans = (await axios.get(`${hostname}/api/v1/plans`)).data;
      onLoadOfPlans(plans);
    }

    if (!coupons.length) {
      const coupons = (await axios.get(`${hostname}/api/v1/coupons`)).data;
      onLoadOfCoupons(coupons);
    }
  }

  render() {
    const {
      user,
      chapters,
      members,
      membersLoading,
      plans,
      coupons,
      asyncAction,
      crudAction,
      success,
      error,
    } = this.props;
    const isMaster = user.role && user.role === 'master';
    const isChapter = user.role && user.role === 'chapter';
    const sections = [
      {
        title: 'Member Subscriptions',
        icon: 'card_membership',
        to: '/subscriptions',
      },
    ];
    if (isMaster) {
      sections.push({
        title: 'Plans',
        icon: 'assignment',
        to: '/subscriptions/plans',
      }, {
        title: 'Coupons',
        icon: 'card_giftcard',
        to: '/subscriptions/coupons',
      });
    }

    return (
      <div>
        <SectionHeader
          title="Guild Member Subscriptions"
          icon="autorenew"
          replaceHistory
          sections={sections}
        />
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions"
            render={({ history }) => (
              <div className="sectionPadding">
                <GuildSubscriptionsManagement
                  role={user.role}
                  chapters={chapters}
                  members={members}
                  history={history}
                />
              </div>
            )}
          />
        }
        <Route
          exact
          path={isMaster ? '/subscriptions/:id' : '/subscriptions'}
          render={({ match }) => {
            const chapterId = isMaster ? match.params.id : user.chapterUuid;
            const chapter = chapters.find(ch => {
              if (isMaster) return ch._id === chapterId;
              return ch.uuid === chapterId;
            });
            if (!chapter) return null;
            if (membersLoading || members.length < 1) return <Loading />;

            return (
              <div className="sectionPadding">
                <ChapterSubscriptionsManagement
                  role={user.role}
                  chapter={chapter}
                  members={members}
                  plans={plans}
                  coupons={coupons}
                  asyncAction={asyncAction}
                />
              </div>
            );
          }}
        />
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions/plans"
            render={() => (
              <div className="sectionPadding">
                <PlansList
                  userId={user._id}
                  plans={plans}
                  asyncAction={asyncAction}
                  crudAction={crudAction}
                  success={msg => success({ title: msg })}
                  error={msg => error({ title: msg })}
                />
              </div>
            )}
          />
        }
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions/plans/new"
            render={() => (
              <div className="sectionPadding">
                <PlansForm />
              </div>
            )}
          />
        }
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions/plan/:id"
            render={({ match }) => {
              const planId = match.params.id;
              let plan = plans.find(plan => plan.id === planId);

              if (plan) {
                plan = JSON.parse(JSON.stringify(plan)); // deep-copy
                // `TextField` has `PropTypes.string`
                if (typeof plan.amount !== 'string') {
                  plan.amount = (plan.amount / 100).toFixed(2);
                }
                return (
                  <div className="sectionPadding">
                    <PlansForm plan={plan} />
                  </div>
                );
              } else {
                // wait for plan to load, so in the meantime, show nothing
                return null;
              }
            }}
          />
        }
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions/coupons"
            render={() => (
              <div className="sectionPadding">
                <CouponsList
                  coupons={coupons}
                  asyncAction={asyncAction}
                />
              </div>
            )}
          />
        }
        {
          isMaster &&
          <Route
            exact
            path="/subscriptions/coupons/new"
            render={() => (
              <div className="sectionPadding">
                <CouponsForm />
              </div>
            )}
          />
        }
        {/* <Route
          exact
          path="/subscriptions/coupon/:id"
          render={({ match }) => {
            const couponId = match.params.id;
            let coupon = coupons.find(coupon => coupon.id === couponId);

            if (coupon) {
              coupon = JSON.parse(JSON.stringify(coupon)); // deep-copy
              coupon.percentOff = coupon.percent_off.toString();
              coupon.numMonths = coupon.duration_in_months;
              delete coupon.percent_off;
              delete coupon.duration_in_months;
              return (
                <div className="sectionPadding">
                  <CouponsForm coupon={coupon} />
                </div>
              );
            } else {
              return null;
            }
          }}
        /> */}
      </div>
    );
  }
}

SubscriptionsContainer.propTypes = {
  user: PropTypes.shape({}),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  membersLoading: PropTypes.bool,
  plans: PropTypes.arrayOf(PropTypes.shape({})),
  coupons: PropTypes.arrayOf(PropTypes.shape({})),
  onLoadOfPlans: PropTypes.func.isRequired,
  onLoadOfCoupons: PropTypes.func.isRequired,
  asyncAction: PropTypes.func.isRequired,
  crudAction: PropTypes.func.isRequired,
  success: PropTypes.func,
  error: PropTypes.func,
};

SubscriptionsContainer.defaultProps = {
  user: {},
  chapters: [],
  members: [],
  membersLoading: true,
  plans: [],
  coupons: [],
  success: () => {},
  error: () => {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
    chapters: state.chapters.list._list,
    members: state.members.list._list,
    membersLoading: state.members.list.loading,
    plans: state.plans,
    coupons: state.coupons,
  }),
  dispatch => ({
    onLoadOfPlans: items => (
      dispatch(actions.plans({
        type: 'SET_PLANS',
        data: { items },
      }))
    ),
    onLoadOfCoupons: items => (
      dispatch(actions.coupons({
        type: 'SET_COUPONS',
        data: { items },
      }))
    ),
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
    crudAction: bindActionCreators(actions.crudAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(SubscriptionsContainer);
