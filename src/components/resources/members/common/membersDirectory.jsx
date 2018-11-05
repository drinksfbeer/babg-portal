import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Link } from 'react-router-dom';

import MembersList from '../list/adminMembersList';
import MembersNav from '../nav/adminMembersNav';
import MembersForm from '../form/membersForm';

class MemberDirectory extends React.Component {
  state = {
    search: '',
  }

  changeMemberDirectoryState = newState => this.setState(newState)

  render() {
    const { members, chapter } = this.props;
    const { search } = this.state;
    const filteredMembers = members
      .filter(member => !search || member.name.toLowerCase().includes(search.toLowerCase()));

    const newMemberLink = chapter ? (
      '/chapters/:slug/activity/members/new'
    ) : (
      '/guild/members/new'
    );
    const memberDirectoryLink = chapter ? (
      `/chapters/${chapter.slug}/activity/members`
    ) : (
      '/guild/members'
    );

    return (
      <Switch>
        <Route
          path={newMemberLink}
          render={() => (
            <div className="grid-container fluid">
              <div className="grid-x grid-padding-x grid-padding-y align-center">
                <div className="cell large-8 medium-10 small-11">
                  <Link
                    to={memberDirectoryLink}
                  >
                    <span style={{ fontSize: '200%', marginRight: '5px' }}>&#8249;</span>
                    <em>Back to Members Directory</em>
                  </Link>
                  <h2>Create New Member</h2>
                  <MembersForm
                    chapter={chapter}
                    isAdmin
                  />
                </div>
              </div>
            </div>
          )}
        />
        <Route
          path={memberDirectoryLink}
          render={() => [
            <MembersNav
              key="membersNav"
              changeMemberDirectoryState={this.changeMemberDirectoryState}
              chapter={chapter}
              {...this.state}
            />,
            <MembersList
              members={filteredMembers}
              key="membersList"
            />,
          ]}
        />
      </Switch>
    );
  }
}

MemberDirectory.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })),
  chapter: PropTypes.shape({}),
};

MemberDirectory.defaultProps = {
  members: [],
  chapter: null,
};

export default MemberDirectory;
