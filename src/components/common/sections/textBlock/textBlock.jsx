import PropTypes from 'prop-types';
import React from 'react';

const TextBlock = ({
  text,
  body,
}) => (
  <section
    style={{
        margin: '20px',
    }}
  >
    <div className="container">
      <div className="gridz text-center">
        <div className="item">
          <h3>{text}</h3>
        </div>
        <div className="item">
          <p>{body}</p>
        </div>
      </div>
    </div>
  </section>
);

TextBlock.propTypes = {
  body: PropTypes.string,
  text: PropTypes.string,
};

TextBlock.defaultProps = {
  text: 'Title',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id maximus risus. Duis euismod mattis dui. Curabitur imperdiet magna lectus, quis volutpat sapien tincidunt eu. Nulla at enim ex. Aliquam pretium urna sed nisl tempor pharetra. Integer pellentesque nibh imperdiet enim cursus aliquet. Integer feugiat fermentum turpis quis dictum. Vestibulum sit amet dictum odio.',
};


export default TextBlock;
