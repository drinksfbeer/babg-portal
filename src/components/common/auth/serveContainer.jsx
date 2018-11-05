import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../../../redux/actions/';

class ServeContainer extends React.Component {
  componentDidMount() {
    const { user, crudAction, asyncAction } = this.props;
    // const isMaster = user.role === 'master';
    // const isChapter = user.role === 'chapter';
    // const isMember = user.role === 'member';
    // const isAgent = user.role === 'agent';

    switch (user.role) {
      case 'master': {
        crudAction({ resource: 'chapters' });
        crudAction({ resource: 'settings' });
        crudAction({ resource: 'members' });
        crudAction({
          resource: 'users',
          query: `id=${user._id}`,
        });
        crudAction({ resource: 'events' });
        crudAction({ resource: 'pages' });
        crudAction({ resource: 'forms' });
        crudAction({ resource: 'locations' });
        crudAction({ resource: 'SFBWsponsors' });
        asyncAction('getAllPublicEvents');
        asyncAction('getAllPublicEventVersions');
        // crudAction({ resource: 'notifications' });
        // check if master has a member attached.
        // The master has a general SF Brewers Guild member to create events through
        /*
        const { member } = user;
        if (member) {
          crudAction({
            resource: 'locations',
            query: `memberUuid=${member.uuid}`,
          });
        }
        */
        break;
      }

      case 'chapter': {
        const { chapterUuid } = user;

        crudAction({
          resource: 'chapters',
          query: `uuid=${chapterUuid}`,
        });
        crudAction({
          resource: 'members',
          query: `chapterUuid=${chapterUuid}`,
        });
        crudAction({ resource: 'events' });
        crudAction({
          resource: 'users',
          query: `id=${user._id}`,
        });
        crudAction({ resource: 'pages' });
        crudAction({ resource: 'forms' });
        crudAction({ resource: 'locations' });
        // crudAction({
        //   resource: 'notifications',
        //   query: `chapterUuid=${chapterUuid}`,
        // });
        break;
      }

      case 'member': {
        const { member } = user;

        if (member) {
          crudAction({
            resource: 'users',
            query: `id=${user._id}`,
          });
          crudAction({
            resource: 'chapters',
            query: `uuid=${member.chapterUuid}`,
          });
          crudAction({ resource: 'pages' });
          crudAction({
            resource: 'locations',
            query: `memberUuid=${member.uuid}`,
          });
          crudAction({
            resource: 'events',
            query: `chapterUuid=${member.chapterUuid}&startDate=new`,
          });
          crudAction({
            resource: 'members',
            query: `chapterUuid=${member.chapterUuid}`,
          });
          // crudAction({
          //   resource: 'notifications',
          //   query: `chapterUuid=${member.chapterUuid}`,
          // });
        } else {
          console.warn('missing member, check populate for user auth'); // eslint-disable-line
        }
        break;
      }

      case 'agent': {
        crudAction({ resource: 'chapters' });
        crudAction({ resource: 'settings' });
        crudAction({
          resource: 'publicEvents',
          query: `userId=${user._id}`,
        });
        asyncAction('getPublicEventVersion', null, `userId=${user._id}`);
        break;
      }

      default: break;
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

ServeContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  user: PropTypes.shape({}),
  crudAction: PropTypes.func.isRequired,
  asyncAction: PropTypes.func.isRequired,
};

ServeContainer.defaultProps = {
  user: null,
};

export default connect(
  state => state.users.auth,
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
  }),
  null,
  { pure: false },
)(ServeContainer);
