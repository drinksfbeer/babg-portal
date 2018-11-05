import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import moment from 'moment';
import Loading from '../../../common/loading/loading';
import FancyError from '../../../common/fancyError/fancyError';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import FancyTabs from '../../../common/fancyTabs/fancyTabs';
import Modal from '../../../common/modal/modal';
import AssignPlansForm from '../plans/form/assignPlansForm';

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';
const filters = [
  { value: 'all', label: 'All' },
  { value: 'sub', label: 'Subscribed' },
  { value: 'nonSub', label: 'Non-Subscribed' },
  { value: 'pastDue', label: 'Past Due' },
];

class ChapterSubscriptionsManagement extends React.Component {
  state = {
    loading: true,
    error: null,
    filterIndex: 0,
    details: [],
    showModal: false,
    selectedMember: null,
  };

  componentDidMount() {
    this.fetchSubscriptionDetails();
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMember } = this.state;

    if (selectedMember) {
      const { members } = nextProps;
      const updatedMember = members.find(member => member._id === selectedMember._id);
      this.setState({ selectedMember: updatedMember });
    }
  }

  async fetchSubscriptionDetails(ids = []) {
    // fetch each chapter member's subcription details
    const { chapter, members } = this.props;
    const chapterMembers = members.filter(member => member.chapterUuid === chapter.uuid);
    const memberIds = ids.length > 0 ? ids : chapterMembers.map(member => member._id);

    if (memberIds.length < 1) {
      this.setState({ loading: false }); // eslint-disable-line
      return;
    }

    try {
      const response = await axios.post(`${hostname}/api/v1/plans-detail`, { memberIds });
      const { details } = response.data;

      this.setState({ // eslint-disable-line
        loading: false,
        details: [
          ...this.state.details,
          ...details,
        ],
      });
    } catch (error) {
      this.setState({ // eslint-disable-line
        loading: false,
        error,
      });
    }
  }

  closeModal() {
    this.setState({
      showModal: false,
      selectedMember: null,
    });
  }

  render() {
    const {
      role,
      chapter,
      members: allMembers,
      plans,
      coupons,
      asyncAction,
    } = this.props;
    const {
      loading,
      error,
      filterIndex,
      details,
      showModal,
      selectedMember,
    } = this.state;
    const isMaster = role === 'master';

    if (loading) return <Loading />;
    if (error) return <FancyError error={error} />;

    // calculate overview stats
    const members = allMembers.filter(member => member.chapterUuid === chapter.uuid);
    const numChapterMembers = members.length;
    const numChapterSubscribed = members.reduce((sum, member) => {
      if (member.stripePlanId) sum++; // eslint-disable-line
      return sum;
    }, 0);
    const numChapterNonSubscribed = Math.max(numChapterMembers - numChapterSubscribed, 0);

    // apply filter
    let filteredMembers = members;
    switch (filters[filterIndex].value) {
      case 'sub': {
        filteredMembers = members.filter(member => member.stripePlanId);
        break;
      }

      case 'nonSub': {
        filteredMembers = members.filter(member => !member.stripePlanId);
        break;
      }

      case 'pastDue': {
        filteredMembers = members.filter((member) => {
          const planDetails = details.find(detail => detail.memberId === member._id);
          return planDetails && planDetails.subscription.status === 'past_due';
        });
        break;
      }

      default: break;
    }

    return (
      <div className="grid-container fluid subscriptionsManagement">
        <div className="grid-x grid-margin-x grid-margin-y grid-padding-y align-center">
          <AdminFormHeaderItem
            title={`${chapter.name} Chapter Members`}
            materialIcon="group"
            containerStyle={isMaster ? { marginBottom: '0', paddingBottom: '0' } : null}
          />
          {
            isMaster &&
            <div
              className="cell large-12 medium-12 small-12"
              style={{ marginTop: '0', paddingTop: '0' }}
            >
              <Link to="/subscriptions">
                <span style={{ fontSize: '200%', marginRight: '5px' }}>
                  &#8249;
                </span>
                <em>Back to Guild Chapters</em>
              </Link>
            </div>
          }
          <div className="cell large-3 medium-4 small-12 stat">
            <h6>Members</h6>
            <h2>{numChapterMembers ? numChapterMembers.toLocaleString() : '--'}</h2>
          </div>
          <div className="cell large-3 medium-4 small-12 stat">
            <h6>Subscribed</h6>
            <h2>{numChapterSubscribed ? numChapterSubscribed.toLocaleString() : '--'}</h2>
          </div>
          <div className="cell large-3 medium-4 small-12 stat">
            <h6>Non-Subscribed</h6>
            <h2 style={{ color: numChapterNonSubscribed > 0 ? '#C62828' : 'inherit' }}>
              {numChapterNonSubscribed ? numChapterNonSubscribed.toLocaleString() : '--'}
            </h2>
          </div>
          <FancyTabs
            containerClass="cell large-10 medium-10 small-12"
            contentClass="table"
            tabs={filters}
            index={filterIndex}
            onChange={i => this.setState({ filterIndex: i })}
          >
            {filteredMembers.map((member) => {
              const planDetails = details.find(detail => detail.memberId === member._id);
              const status = planDetails && planDetails.subscription.status;
              const daysUntilDue = planDetails && planDetails.subscription.daysUntilDue;

              return (
                <div key={member._id} className="grid-x member">
                  <div className="cell large-5 medium-5 info">
                    <img alt={member.name} src={member.image} />
                    <Link to={`/member/${member._id}`}>
                      <span>{member.name}</span>
                    </Link>
                  </div>
                  <div
                    className={classNames({
                      cell: true,
                      'large-2': true,
                      'medium-2': true,
                      status: true,
                      subscription: true,
                      active: !!member.stripePlanId,
                    })}
                  >
                    <i className="material-icons">
                      {member.stripePlanId ? 'done' : 'remove_circle_outline'}
                    </i>
                    <span>
                      {member.stripePlanId ? 'Subscribed' : 'Non-Subscribed'}
                    </span>
                  </div>
                  <div className="cell large-2 medium-2 status">
                    <i className="material-icons" style={planDetails && { color: 'black' }}>
                      date_range
                    </i>
                    {
                      !planDetails &&
                      <span style={{ color: '#9E9E9E' }}>
                        N/A
                      </span>
                    }
                    {
                      planDetails &&
                      <span style={{ color: 'black' }}>
                        {moment(planDetails.subscription.currentPeriodStart).format('MM/DD/YY')}
                        &nbsp;&ndash;&nbsp;
                        {moment(planDetails.subscription.currentPeriodEnd).format('MM/DD/YY')}
                      </span>
                    }
                  </div>
                  <div
                    className={classNames({
                      cell: true,
                      'large-2': true,
                      'medium-2': true,
                      status: true,
                      payment: !!planDetails,
                      active: status === 'active' && !daysUntilDue,
                    })}
                  >
                    <i className="material-icons">attach_money</i>
                    {
                      !status &&
                      <span>N/A</span>
                    }
                    {
                      status === 'past_due' &&
                      <span>Past Due</span>
                    }
                    {
                      status === 'unpaid' &&
                      <span>Unpaid</span>
                    }
                    {
                      (status === 'active' && daysUntilDue) &&
                      <span>
                        {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'} left to pay
                      </span>
                    }
                    {
                      status === 'canceled' &&
                      <span>Canceled</span>
                    }
                    {
                      (status === 'active' && !daysUntilDue) &&
                      <span>Paid</span>
                    }
                  </div>
                  <div className="cell large-1 medium-1" style={{ textAlign: 'center' }}>
                    {/*
                      planDetails &&
                      <button
                        className="button small"
                        style={{ display: 'none' }} // for now
                        disabled={status && (status === 'active' || status !== 'canceled')}
                      >
                        Remind
                      </button>
                    */}
                    {/*
                      !planDetails &&
                      <button
                        className="button small"
                        onClick={() => this.setState({
                          showModal: true,
                          selectedMember: member,
                        })}
                      >
                        Subscribe
                      </button>
                    */}
                    <button
                      className={classNames({
                        button: true,
                        small: true,
                        alert: !planDetails,
                      })}
                      onClick={() => this.setState({
                        showModal: true,
                        selectedMember: member,
                      })}
                    >
                      {planDetails ? 'Manage' : 'Subscribe'}
                    </button>
                  </div>
                </div>
              );
            })}
          </FancyTabs>
        </div>
        {
          showModal &&
          <Modal
            med
            close={() => this.closeModal()}
          >
            <AssignPlansForm
              member={selectedMember}
              plans={plans}
              coupons={coupons}
              asyncAction={asyncAction}
              close={() => {
                this.fetchSubscriptionDetails([selectedMember._id]);
                this.closeModal();
              }}
              isModal
            />
          </Modal>
        }
      </div>
    );
  }
}

ChapterSubscriptionsManagement.propTypes = {
  role: PropTypes.string,
  chapter: PropTypes.shape({}),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  plans: PropTypes.arrayOf(PropTypes.shape({})),
  coupons: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
};

ChapterSubscriptionsManagement.defaultProps = {
  role: '',
  chapter: {},
  members: [],
  plans: [],
  coupons: [],
  asyncAction: () => {},
};

export default ChapterSubscriptionsManagement;
