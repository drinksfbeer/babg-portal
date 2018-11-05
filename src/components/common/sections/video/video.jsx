import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import classNames from 'classnames';

const Video = ({
  videoUrl,
  fullWidth,
  title,
  description,
  background,
}) => (
  <section className={classNames({
    videoSection: true,
    fullWidth,
    background,
  })}
  >
    <div className="container">
      <div className="gridz">
        <div className="span centered size-10">
          <div className="player-wrapper">
            <ReactPlayer
              url={videoUrl}
              // width={fullWidth ? '100%' : '60%'}
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  </section>
);

Video.propTypes = {
  videoUrl: PropTypes.string,
  fullWidth: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  background: PropTypes.bool,
};

Video.defaultProps = {
  videoUrl: 'https://www.youtube.com/watch?v=BI2bQ5YvnD4&t=2s',
  fullWidth: false,
  title: 'Title',
  description: 'Description',
  background: false,
};

export default Video;
