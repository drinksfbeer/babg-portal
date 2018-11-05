import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import swal from 'sweetalert';
import FancyTabs from '../../../common/fancyTabs/fancyTabs';
import TextField from '../../../common/form/inputs/textField';
import Icon from '../../../common/icon/icon';

class AgentEventsList extends React.Component {
  state = {
    tabIndex: 0,
    search: '',
    sortCategory: 'date',
    sortAscending: true,
  };

  render() {
    const {
      events,
      eventVersions,
      asyncAction,
      admin,
      users,
      success,
      error,
      history,
    } = this.props;
    const {
      tabIndex,
      search,
      sortCategory,
      sortAscending,
    } = this.state;

    const eventIds = events.map(event => event._id);
    const rejectedIds = eventVersions.reduce((ids, version) => {
      // ids.push(...version.rejected);
      version.rejected.forEach(id => eventIds.includes(id) && ids.push(id));
      return ids;
    }, []);
    const pendingIds = eventVersions.reduce((ids, version) => {
      // ids.push(...version.pending);
      version.pending.forEach(id => eventIds.includes(id) && ids.push(id));
      return ids;
    }, []);
    const approvedIds = eventVersions.reduce((ids, version) => {
      // ids.push(...version.approved);
      version.approved.forEach(id => eventIds.includes(id) && ids.push(id));
      return ids;
    }, []);
    const draftsIds = eventVersions.reduce((ids, version) => {
      ids.push(...version.drafts);
      return ids;
    }, []);
    const getEventStatus = (event) => {
      if (approvedIds.includes(event._id)) return 'approved';
      if (pendingIds.includes(event._id)) return 'pending';
      if (rejectedIds.includes(event._id)) return 'rejected';
      return 'unknown';
    };
    const filters = [{
      value: 'all',
      label: 'All',
      sublabel: `(${Math.max(events.length - draftsIds.length, 0)})`,
    }, {
      value: 'approved',
      label: 'Approved',
      sublabel: `(${approvedIds.length})`,
    }, {
      value: 'pending',
      label: 'Pending',
      sublabel: `(${pendingIds.length})`,
    }, {
      value: 'rejected',
      label: 'Rejected',
      sublabel: `(${rejectedIds.length})`,
    }];
    const filteredEvents = events.filter((event) => {
      if (tabIndex === 0) {
        return true;
      } else if (tabIndex === 1) {
        return approvedIds.includes(event._id);
      } else if (tabIndex === 2) {
        return pendingIds.includes(event._id);
      } else if (tabIndex === 3) {
        return rejectedIds.includes(event._id);
      }
      return false;
    }).filter((event) => {
      if (!search) return true;

      const searchString = search.toLowerCase();
      const agent = users.find(user => user._id === event.userId);
      let indexableStrings = `${event.title}|`;
      if (agent && agent.company && agent.company.name) {
        indexableStrings += `${agent.company.name}|`;
      }
      indexableStrings += `${event.location.name}`;
      indexableStrings = indexableStrings.toLowerCase();

      return indexableStrings.indexOf(searchString) > -1;
    }).sort((a, b) => {
      switch (sortCategory) {
        case 'title': {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        }

        case 'company': {
          const agentA = users.find(user => user._id === a.userId);
          const agentB = users.find(user => user._id === b.userId);
          const companyA = agentA && agentA.company && agentA.company.name ?
            agentA.company.name.toLowerCase() + a.location.name.toLowerCase() : '';
          const companyB = agentB && agentB.company && agentB.company.name ?
            agentB.company.name.toLowerCase() + b.location.name.toLowerCase() : '';
          if (companyA < companyB) return -1;
          if (companyA > companyB) return 1;
          return 0;
        }

        case 'type': {
          if (a.eventType < b.eventType) return -1;
          if (a.eventType > b.eventType) return 1;
          return 0;
        }

        default:
        case 'date': {
          const isUniqueTypeA = a.eventType === 'unique';
          const isUniqueTypeB = b.eventType === 'unique';
          const startA = isUniqueTypeA ? a.startTime : a.startDate;
          const startB = isUniqueTypeB ? b.startTime : b.startDate;
          if (startA < startB) return -1;
          if (startA > startB) return 1;
          return 0;
        }
      }
    });
    if (!sortAscending) filteredEvents.reverse();

    return (
      <section className="publicEventsList sectionPadding">
        <FancyTabs
          containerClass="cell large-10 medium-10 small-12"
          contentClass="table"
          tabs={filters}
          index={tabIndex}
          onChange={tabIndex => this.setState({ tabIndex })}
        >
          <div className="grid-x grid-padding-x align-right">
            <div
              className="cell large-3 medium-3 small-12"
              style={{ paddingLeft: '0', paddingRight: '0' }}
            >
              <TextField
                input={{
                  value: search,
                  onChange: event => this.setState({
                    search: event.target.value,
                  }),
                }}
                placeholder="search for an event by name, company, or venue"
              />
            </div>
          </div>
          <div className="grid-x grid-padding-x heading">
            <div
              className={classNames({
                cell: true,
                'large-2': true,
                'medium-2': true,
                sortable: true,
                asc: sortCategory === 'title' && sortAscending,
                desc: sortCategory === 'title' && !sortAscending,
              })}
              onClick={() => {
                const newState = { sortCategory: 'title' };
                if (sortCategory === 'title') newState.sortAscending = !sortAscending;
                this.setState(newState);
              }}
            >
              Event Name
            </div>
            <div
              className={classNames({
                cell: true,
                'large-2': true,
                'medium-2': true,
                sortable: true,
                asc: sortCategory === 'company' && sortAscending,
                desc: sortCategory === 'company' && !sortAscending,
              })}
              onClick={() => {
                const newState = { sortCategory: 'company' };
                if (sortCategory === 'company') newState.sortAscending = !sortAscending;
                this.setState(newState);
              }}
            >
              Company & Venue
            </div>
            <div
              className={classNames({
                cell: true,
                'large-1': true,
                'medium-1': true,
                sortable: true,
                asc: sortCategory === 'type' && sortAscending,
                desc: sortCategory === 'type' && !sortAscending,
              })}
              onClick={() => {
                const newState = { sortCategory: 'type' };
                if (sortCategory === 'type') newState.sortAscending = !sortAscending;
                this.setState(newState);
              }}
            >
              Type
            </div>
            <div
              className={classNames({
                cell: true,
                'large-2': true,
                'medium-2': true,
                sortable: true,
                asc: sortCategory === 'date' && sortAscending,
                desc: sortCategory === 'date' && !sortAscending,
              })}
              onClick={() => {
                const newState = { sortCategory: 'date' };
                if (sortCategory === 'date') newState.sortAscending = !sortAscending;
                this.setState(newState);
              }}
            >
              Date
            </div>
            <div className="cell large-1 medium-1">
              Revisions
            </div>
            <div className="cell large-1 medium-1">
              Status
            </div>
            <div className="cell large-3 medium-3" />
          </div>
          {filteredEvents.map((agentEvent) => {
            const eventLink = `/sfbw/event/${agentEvent._id}`;
            const isUniqueType = agentEvent.eventType === 'unique';
            const status = getEventStatus(agentEvent);
            const agent = users.find(user => user._id === agentEvent.userId);
            const eventVersion = agent && eventVersions.find(v => v.userId === agent._id);
            const refId = agentEvent.masterId ? agentEvent.masterId : agentEvent._id;
            const numRevisions = eventVersion && Array.isArray(eventVersion.revisions[refId]) ?
              eventVersion.revisions[refId].length : 0;

            // probably a draft so don't render
            if (status === 'unknown') return null;

            return (
              <div
                key={agentEvent._id}
                className="grid-x grid-padding-x agentEventContainer"
              >
                <div
                  className="cell large-2 medium-2 agentEvent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  <span className="agentEvent-title">
                    {agentEvent.title}
                  </span>
                </div>
                <div
                  className="cell large-2 medium-2 agentEvent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  <div className="grid-x">
                    <div className="cell">
                      <span className="agentEvent-company-name">
                        {agent && agent.company && agent.company.name}
                      </span>
                    </div>
                    <div className="cell">
                      <span className="agentEvent-location-name">
                        {agentEvent.location.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="cell large-1 medium-1 agentEvent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  {isUniqueType ? 'Unique' : 'Week-Long'}
                </div>
                <div
                  className="cell large-2 medium-2 agentEvent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  <div className="grid-x">
                    {
                      isUniqueType &&
                      <React.Fragment>
                        <div className="cell">
                          {moment(agentEvent.startTime).format('MMMM D, Y')}
                        </div>
                        <div className="cell">
                          {moment(agentEvent.startTime).format('h:mm A [— ]')}
                          {moment(agentEvent.endTime).format('h:mm A')}
                        </div>
                      </React.Fragment>
                    }
                    {
                      !isUniqueType &&
                      <React.Fragment>
                        <div className="cell">
                          {moment(agentEvent.startDate).format('MMMM D, Y [—]')}
                        </div>
                        <div className="cell">
                          {moment(agentEvent.endDate).format('MMMM D, Y')}
                        </div>
                      </React.Fragment>
                    }
                  </div>
                </div>
                <div
                  className="cell large-1 medium-1 agentEvent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  {numRevisions}
                </div>
                <div
                  className={classNames({
                    cell: true,
                    'large-1': true,
                    'medium-1': true,
                    agentEvent: true,
                    status: true,
                    [status]: true,
                  })}
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(eventLink)}
                >
                  {status}
                </div>
                <div className="cell large-3 medium-3 agentEvent">
                  {
                    pendingIds.includes(agentEvent._id) &&
                    <React.Fragment>
                      <button
                        className="button success eventApprovalButton"
                        type="button"
                        onClick={async () => {
                          const confirmation = await swal({
                            title: `Approve ${agentEvent.title}?`,
                            text: `You are about to approve the event ${agentEvent.title} ` +
                              `(rev. ${numRevisions}). Continue?`,
                            buttons: true,
                            dangerMode: true,
                          });
                          if (!confirmation) return;
                          asyncAction('approvePublicEvent', {
                            _id: agentEvent._id,
                            adminId: admin._id,
                          }, null, (err, response) => {
                            if (err || !response) {
                              error({ title: 'Error Occured Approving Event' });
                            } else {
                              success({ title: 'Successfully Approved Event' });
                            }
                          });
                        }}
                      >
                        <Icon icon="thumbs-up" />
                        {/* Approve */}
                      </button>
                      <button
                        className="button warning eventApprovalButton"
                        type="button"
                        onClick={async () => {
                          const confirmation = await swal({
                            title: `Soft-Reject ${agentEvent.title}?`,
                            text: `You are about to soft-reject the event ${agentEvent.title} ` +
                              `(rev. ${numRevisions}).\n\n` +
                              'Another revision will be created that the user can edit. This event ' +
                              'will be shown as "Rejected" until they submit their event again. ' +
                              'The user will NOT be refunded for their submission. Continue?',
                            buttons: true,
                            dangerMode: true,
                          });
                          if (!confirmation) return;
                          asyncAction('rejectPublicEvent', {
                            _id: agentEvent._id,
                            adminId: admin._id,
                            type: 'soft',
                          }, null, (err, response) => {
                            if (err || !response) {
                              error({ title: 'Error Occured Rejecting Event' });
                            } else {
                              success({ title: 'Successfully Soft-Rejected Event' });
                            }
                          });
                        }}
                      >
                        <Icon icon="exclamation-triangle" />
                      </button>
                      <button
                        className="button alert eventApprovalButton"
                        type="button"
                        onClick={async () => {
                          const confirmation = await swal({
                            title: `Hard-Reject ${agentEvent.title}?`,
                            text: `You are about to hard-reject the event ${agentEvent.title}.\n\n` +
                              'The user will be refunded in full for the submission fee they paid. ' +
                              'They will not be able to make any further changes to this event, which ' +
                              'will remain permanently rejected. Continue?',
                            buttons: true,
                            dangerMode: true,
                          });
                          if (!confirmation) return;
                          asyncAction('rejectPublicEvent', {
                            _id: agentEvent._id,
                            adminId: admin._id,
                            type: 'hard',
                          }, null, (err, response) => {
                            if (err || !response) {
                              error({ title: 'Error Occured Rejecting Event' });
                            } else {
                              success({ title: 'Successfully Hard-Rejected Event' });
                            }
                          });
                        }}
                      >
                        {/* Reject */}
                        <Icon icon="thumbs-down" />
                      </button>
                    </React.Fragment>
                  }
                </div>
              </div>
            );
          })}
        </FancyTabs>
      </section>
    );
  }
}

AgentEventsList.propTypes = {
  admin: PropTypes.shape({}).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  eventVersions: PropTypes.arrayOf(PropTypes.shape({})),
  asyncAction: PropTypes.func,
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

AgentEventsList.defaultProps = {
  users: [],
  events: [],
  eventVersions: [],
  asyncAction: () => {},
};

export default withRouter(AgentEventsList);
