import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Linkify from 'react-linkify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Actions from '../../../../redux/actions/';
import UntappdSearch from './untappd/untappdSearch';
import UntappdInfo from './untappd/untappdInfo';
import AdminLocationsList from '../../locations/list/adminLocationsList';
import EventsList from '../../events/list/eventsList';
import { licenseTypes } from '../../../../refs/refs';

class AdminMemberDetails extends React.Component {
  state = {
    searchActive: false,
  }

  render() {
    const {
      user,
      member,
      crudAction,
      events,
    } = this.props;
    const { searchActive } = this.state;
    if (!member) return null;
    const isAdmin = ['master', 'chapter'].includes(user.role);
    const isOwnMember = user.role === 'member' && user.memberUuid === member.uuid;
    const locations = Array.isArray(member.locations) ? member.locations.map(loc => ({
      ...loc,
      member: {
        image: member.image,
        name: member.name,
      },
    })) : [];

    return (
      <div>
        <div className="grid-x grid-padding-x grid-padding-y">
          <div className="cell text-center">
            <h2>{member.name}</h2>
            {
              member.tagline &&
              <h4>
                <em>{member.tagline}</em>
              </h4>
            }
          </div>
          <div className="cell large-4 medium-4 small-8">
            <img
              src={member.image}
              alt="member-logo"
              style={{
                borderRadius: '100%',
              }}
            />
            <div style={{ padding: '20px' }} />
            {member.licenseCode && (() => {
              const licenseType = licenseTypes.find(license =>
                license.value === member.licenseCode);
              return (
                <div style={{ marginBottom: '2em' }}>
                  <div>
                    <strong>License Type</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginTop: '0.5em',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        width: '22px',
                        maxWidth: '22px',
                        marginLeft: '3px',
                        marginRight: '0.8em',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                        lineHeight: '21px',
                        backgroundColor: '#333333',
                        borderRadius: '3px',
                        userSelect: 'none',
                      }}
                    >
                      {licenseType.value}
                    </div>
                    <span style={{ marginTop: '2px' }}>
                      {licenseType.label}
                    </span>
                  </div>
                </div>
              );
            })()}
            <div style={{ marginBottom: '0.75em' }}>
              <strong>Links &amp; Social Media</strong>
            </div>
            {
              member.website &&
              <div style={{ marginBottom: '0.25em' }}>
                <FontAwesomeIcon
                  icon="globe-americas"
                  size="lg"
                  style={{ marginRight: '0.5em' }}
                  fixedWidth
                />
                <Linkify>{member.website}</Linkify>
              </div>
            }
            {
              member.email &&
              <div style={{ marginBottom: '0.25em' }}>
                <FontAwesomeIcon
                  icon="envelope"
                  size="lg"
                  style={{ marginRight: '0.5em' }}
                  fixedWidth
                />
                <Linkify>{member.email}</Linkify>
              </div>
            }
            {
              member.facebook &&
              <div style={{ marginBottom: '0.25em' }}>
                <FontAwesomeIcon
                  icon={['fab', 'facebook']}
                  size="lg"
                  style={{ marginRight: '0.5em' }}
                  fixedWidth
                />
                <Linkify>{member.facebook}</Linkify>
              </div>
            }
            {
              member.twitter &&
              <div style={{ marginBottom: '0.25em' }}>
                <FontAwesomeIcon
                  icon={['fab', 'twitter']}
                  size="lg"
                  style={{ marginRight: '0.5em' }}
                  fixedWidth
                />
                <Linkify>{member.twitter}</Linkify>
              </div>
            }
            {
              member.instagram &&
              <div>
                <FontAwesomeIcon
                  icon={['fab', 'instagram']}
                  size="lg"
                  style={{ marginRight: '0.5em' }}
                  fixedWidth
                />
                <Linkify>{member.instagram}</Linkify>
              </div>
            }
          </div>
          <div
            className="cell large-8 medium-8"
            style={{
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <div
              style={{
                padding: '10px 0px',
              }}
            >
              <strong>{member.chapter ? member.chapter.name : ''} Chapter</strong>
            </div>
            <p
              style={{
                whiteSpace: 'pre-line',
                color: 'dark-grey',
                fontSize: '85%',
              }}
            >
              {member.description || 'Member Description Is Missing'}
            </p>
          </div>
          <div className="cell">
            <div
              style={{
                marginTop: '30px',
                borderBottom: 'solid rgba(0,0,0,0.2) 1px',
                marginBottom: '10px',
              }}
              className="cell"
            >
              <h4>Locations</h4>
            </div>
            {locations.length > 0 ? (
              <AdminLocationsList
                locations={locations}
                isAdmin={isAdmin || isOwnMember}
              />
            ) : (
              'No Locations'
            )}
          </div>
          <div className="cell">
            <div
              style={{
                marginTop: '30px',
                borderBottom: 'solid rgba(0,0,0,0.2) 1px',
                marginBottom: '10px',
              }}
              className="cell"
            >
              <h4>Events</h4>
            </div>
            {events.length > 0 ? (
              <EventsList
                events={events}
                fitToBox
              />
            ) : (
              'No Events'
            )}
          </div>
          <div className="cell">
            {
              ((isAdmin || isOwnMember) && (!member.untappdId || searchActive)) &&
              <UntappdSearch
                member={member}
                onSelection={untappdId => crudAction({
                  type: 'put',
                  resource: 'members',
                }, {
                  _id: member._id,
                  changes: {
                    untappdId,
                  },
                })}
              />
            }
            {
              member.untappdId &&
              <div className="grid-x">
                <div className="cell">
                  <UntappdInfo
                    member={member}
                    changeDetailsState={this.changeDetailsState}
                    isAdmin={isAdmin || isOwnMember}
                    onReset={() => crudAction({
                      type: 'put',
                      resource: 'members',
                    }, {
                      _id: member._id,
                      changes: {
                        untappdId: '',
                      },
                    })}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AdminMemberDetails.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }).isRequired,
  member: PropTypes.shape({
    name: PropTypes.string,
    chapter: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  events: PropTypes.arrayOf(PropTypes.shape({})),
  crudAction: PropTypes.func.isRequired,
};

AdminMemberDetails.defaultProps = {
  member: {
    name: '',
    chapter: {
      name: '',
    },
  },
  events: [],
};

export default connect(
  state => ({ user: state.users.auth.user }),
  dispatch => ({ crudAction: bindActionCreators(Actions.crudAction, dispatch) }),
  null,
  { pure: false },
)(AdminMemberDetails);
