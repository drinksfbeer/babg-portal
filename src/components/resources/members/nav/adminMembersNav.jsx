import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AdminMembersNav = ({
  search,
  changeMemberDirectoryState,
  chapter,
}) => {
  const newMemberLink = chapter ? (
    `/chapters/${chapter.slug}/activity/members/new`
  ) : (
    '/guild/members/new'
  );

  return (
    <div className="grid-container fluid">
      <nav>
        <div className="grid-x ">
          <div className="cell auto">
            <Link
              to={newMemberLink}
              className="button small"
            >
              New Member
            </Link>
          </div>
          <div className="cell auto">
            <input
              type="text"
              onChange={e => changeMemberDirectoryState({ search: e.target.value })}
              value={search}
              placeholder="search by member name"
            />
          </div>
        </div>
        <div className="cell">
          <div
            className="grid-x grid-padding-y grid-padding-x app-item"
            style={{
              backgroundColor: '#333',
              color: 'white',
              fontWeight: '800',
            }}
          >
            <div className="cell large-3 medium-3">Name</div>
            <div className="cell large-2 medium-2">Status</div>
            <div className="cell large-2 medium-2">Untappd</div>
            <div className="cell large-3 medium-3">Locations</div>
            <div className="cell large-2 medium-2">Created</div>
          </div>
        </div>
      </nav>
    </div>
  );
};
AdminMembersNav.propTypes = {
  changeMemberDirectoryState: PropTypes.func.isRequired,
  search: PropTypes.string,
  chapter: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
};

AdminMembersNav.defaultProps = {
  search: '',
  chapter: null,
};

export default AdminMembersNav;
