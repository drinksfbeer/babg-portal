import React from 'react';
import PropTypes from 'prop-types';

const richText = ({
  input,
}) => (
  <section className="rich-text" >
    <div className="container">
      <div className="gridz">
        <div className="item" >
          {/* eslint-disable-next-line */}
          <div dangerouslySetInnerHTML={{ __html: `${input}` }} />
        </div>
      </div>
    </div>
  </section>

);

richText.propTypes = {
  input: PropTypes.string,
};

richText.defaultProps = {
  input: '',
};


export default richText;
