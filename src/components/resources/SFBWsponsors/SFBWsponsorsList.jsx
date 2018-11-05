import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import AdminFormHeaderItem from '../forms/header/adminFormHeaderItem';

const SponsorsList = ({ sponsors, history }) => (
  <div className="SFBWsponsorList sectionPadding">

    <div className="grid-container">

      <div className="grid-x grid-margin-y">

        <AdminFormHeaderItem
          title="SFBW Sponsors"
          materialIcon="attach_money"
        />
      </div>

      <div className="grid-x grid-margin-y grid-margin-x large-up-3">

        {
          sponsors.map(sponsor => (
            <div className="cell">
              <div
                className="SFBWsponsorListItem app-item"
                onClick={() => history.push(`/sfbw/sponsors/edit/${sponsor._id}`)}
              >
                <div className="grid-x grid-padding-x align-center">
                  <div className="cell justify-center large-6">
                    <img src={sponsor.imageUrl} alt={sponsor.name} />
                  </div>
                </div>
                <div className="grid-x align-center text-center">
                  <div className="cell large-9">
                    <h5 className="SFBWsponsorName">{sponsor.name}</h5>
                    <div className="SFBWsponsorLevel">
                      <h6>{`${sponsor.level.slice(0, 1).toUpperCase()}${sponsor.level.slice(1, sponsor.level.length)}`}</h6>
                    </div>
                    <div className="SFBWsponsorDescription">
                      {/* <h6>Description:</h6> */}
                      {/* <p>{sponsor.description}</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  </div>
);

SponsorsList.propTypes = {
  sponsors: PropTypes.arrayOf(PropTypes.shape({})),
  history: PropTypes.shape({}),
};

SponsorsList.defaultProps = {
  sponsors: [],
  history: {},
};

export default connect(state => ({
  sponsors: state.SFBWsponsors.list._list,
}))(withRouter(SponsorsList));
