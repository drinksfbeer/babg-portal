import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

/*
  This Component will allow you to output
  based on the available options provided through the options prop
*/
class MultiSelectField extends React.Component {
  state = {
    active: false,
    selectedItems: [],
  };

  componentDidMount() {
    this.prepopulateField();
  }

  prepopulateField() {
    const { value } = this.props.input;
    if (value) {
      this.setState({ selectedItems: value });
    }
  }

  handleClickOutside = () => {
    const { input } = this.props;
    const { selectedItems } = this.state;
    this.setState({ active: false });
    input.onChange(selectedItems);
    if (this.dropDown) {
      this.dropDown.scrollTop = 0;
    }
  };

  render() {
    const {
      label,
      labelClass = '',
      options,
      placeholder,
      optionStyle = {},
      lastOptionStyle = {},
      containerClass = '',
      containerStyle = {},
      meta: { touched, error },
    } = this.props;
    const { active, selectedItems } = this.state;
    const numSelected = selectedItems.length;
    const placeholderLabel = numSelected > 0 ?
      `${numSelected} ${numSelected === 1 ? 'item' : 'items'} selected` :
      (placeholder || label);
    return (
      <div
        className={containerClass}
        style={{
          // margin: '20px',
          ...containerStyle,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label className={labelClass}>
            {label}
          </label>
          {
            (touched && error) &&
            <span className="form-error-new">
              {error}
            </span>
          }
        </div>
        <div
          style={{
            position: 'relative',
            height: '40px',
          }}
        >
          <div
            ref={(ref) => { this.dropDown = ref; }}
            style={{
              zIndex: '10',
              borderRadius: '3px',
              padding: '8px',
              height: active ? '200px' : '40px',
              backgroundColor: 'white',
              transition: 'all 0.3s',
              boxShadow: active ?
                '0px 2px 10px rgba(0, 0, 0, 0.08)' :
                '0px 1px 2px rgba(10, 10, 10, 0.1) inset',
              border: 'solid rgba(0,0,0,0.2) 1px',
              position: 'absolute',
              overflowX: 'hidden',
              width: '100%',
              overflowY: active ? 'scroll' : 'hidden',
              userSelect: 'none',
            }}
          >
            <div onClick={() => this.setState({ active: !active })}>
              <div
                style={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  paddingBottom: '25px',
                  cursor: 'pointer',
                  height: '25px',
                }}
              >
                {active ? 'close this dropdown' : placeholderLabel }
              </div>
            </div>
            {options.map((option, i) => {
              const isActive = selectedItems.includes(option.value);

              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '30px',
                    backgroundColor: isActive ? 'rgba(0, 151, 167, 0.75)' : 'white',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? 'white' : '#424242',
                    cursor: 'pointer',
                    padding: '0 10px',
                    borderRadius: '3px',
                    marginTop: i === 0 ? '10px' : '0',
                    marginBottom: i !== options.length - 1 ? '3px' : '0',
                    transition: 'color 0.3s, background-color 0.3s',
                    ...optionStyle,
                    ...(i === options.length - 1 ? lastOptionStyle : {}),
                  }}
                  key={option.value}
                  value={option.value}
                  onClick={() => {
                    const newSelectedItems = isActive ? (
                      selectedItems.filter(item => item !== option.value)
                    ) : (
                      selectedItems.concat(option.value)
                    );
                    this.setState({ selectedItems: newSelectedItems });
                  }}
                >
                  {
                    isActive &&
                    <i
                      className="material-icons"
                      style={{ marginRight: '0.5em' }}
                    >
                      done
                    </i>
                  }
                  <span style={isActive ? null : { marginLeft: '36px' }}>
                    {option.title || options.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

MultiSelectField.defaultProps = {
  labelClass: '',
  placeholder: '',
  optionStyle: {},
  lastOptionStyle: {},
  containerClass: '',
  containerStyle: {},
  meta: {
    touched: false,
    error: '',
  },
};


MultiSelectField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  placeholder: PropTypes.string,
  optionStyle: PropTypes.shape({}),
  lastOptionStyle: PropTypes.shape({}),
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};
export default onClickOutside(MultiSelectField);
