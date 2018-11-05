import React from 'react';
import PropTypes from 'prop-types';
import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';

const GuildSubscriptionsManagement = ({
  role,
  chapters,
  members,
  history,
}) => {
  if (role !== 'master') return null;

  const numMembers = members.length;
  const numSubscribed = members.reduce((sum, member) => {
    if (member.stripePlanId) sum++; // eslint-disable-line
    return sum;
  }, 0);
  const numNonSubscribed = Math.max(numMembers - numSubscribed, 0);

  return (
    <div className="grid-container fluid subscriptionsManagement">
      <div className="grid-x grid-margin-x grid-margin-y grid-padding-y align-center">
        <AdminFormHeaderItem
          title="Guild Chapters"
          materialIcon="account_balance"
        />
        <div className="cell large-3 medium-4 small-12 stat">
          <h6>Members</h6>
          <h2>{numMembers ? numMembers.toLocaleString() : '--'}</h2>
        </div>
        <div className="cell large-3 medium-4 small-12 stat">
          <h6>Subscribed</h6>
          <h2>{numSubscribed ? numSubscribed.toLocaleString() : '--'}</h2>
        </div>
        <div className="cell large-3 medium-4 small-12 stat">
          <h6>Non-Subscribed</h6>
          <h2 style={{ color: numNonSubscribed > 0 ? '#C62828' : 'inherit' }}>
            {numNonSubscribed ? numNonSubscribed.toLocaleString() : '--'}
          </h2>
        </div>
        <div className="cell large-10 medium-10 small-12">
          <div className="grid-x grid-padding-x grid-padding-y">
            {chapters.map((chapter) => {
              // const chapterMembers = Array.isArray(chapter.members) ? chapter.members : [];
              const chapterMembers = members.filter(member => member.chapterUuid === chapter.uuid);
              const numChapterMembers = chapterMembers.length;
              const numChapterSubscribed = chapterMembers.reduce((sum, member) => {
                if (member.stripePlanId) sum++; // eslint-disable-line
                return sum;
              }, 0);
              const numChapterNonSubscribed = Math.max(
                numChapterMembers - numChapterSubscribed,
                0,
              );

              return (
                <div
                  key={chapter.uuid}
                  className="cell app-item chapterItem"
                  onClick={() => history.push(`/subscriptions/${chapter._id}`)}
                >
                  <div className="grid-x align-middle">
                    <div className="cell large-6 medium-6 name">
                      {chapter.name}
                    </div>
                    <div className="cell large-2 medium-2 memberCount">
                      <div className="amount">
                        {numChapterSubscribed.toLocaleString()}
                      </div>
                      <div className="property">Sub</div>
                    </div>
                    <div className="cell large-2 medium-2 memberCount">
                      <div
                        className="amount"
                        style={{ color: numChapterNonSubscribed > 0 ? '#C62828' : 'inherit' }}
                      >
                        {numChapterNonSubscribed.toLocaleString()}
                      </div>
                      <div className="property">Non-Sub</div>
                    </div>
                    <div className="cell large-2 medium-2 memberCount">
                      <div className="amount">
                        {numChapterMembers.toLocaleString()}
                      </div>
                      <div className="property">Total</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

GuildSubscriptionsManagement.propTypes = {
  role: PropTypes.string.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  members: PropTypes.arrayOf(PropTypes.shape({})),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

GuildSubscriptionsManagement.defaultProps = {
  chapters: [],
  members: [],
  history: {
    push: () => {},
  },
};

export default GuildSubscriptionsManagement;
