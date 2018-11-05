import React from 'react';
import PropTypes from 'prop-types';

export default class DefaultField extends React.Component {
  componentDidMount() {
    const { defaultValue, input } = this.props;
    if (!defaultValue) {
      return null;
    }
    input.onChange(defaultValue);
    return null;
  }
  render() {
    const { input } = this.props;

    return <input type="hidden" onChange={input.onChange} value={input.value} />;
  }
}

DefaultField.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
};
