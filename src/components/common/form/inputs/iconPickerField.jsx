import PropTypes from 'prop-types';
import React from 'react';
import onClickOutside from 'react-onclickoutside';
import scrollIntoView from 'scroll-into-view';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fontAwesomeIcons } from '../../../../refs/refs';

// import Icon from '../../icon/icon';

class IconPickerField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      focused: false, // whether the input field is focused
      search: props.input.value || '',
      filteredIcons: fontAwesomeIcons,
      selectionIndex: 0,
    };
  }

  componentWillMount() {
    // add event listener to listen for key down events
    document.addEventListener('keydown', event => this.handleKeyPress(event));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', event => this.handleKeyPress(event));
  }

  handleClickOutside() {
    this.setState({ active: false });
  }

  handleKeyPress(event) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown': {
        this.moveSelection(event);
        break;
      }

      case 'Enter': {
        this.confirmSelection(event);
        break;
      }

      case 'Escape': {
        this.handleClickOutside();
        break;
      }

      default: break; // making eslint happy
    }
  }

  moveSelection(event) {
    const {
      active,
      focused,
      filteredIcons,
      selectionIndex,
    } = this.state;
    const moveUp = event.key === 'ArrowUp';

    // don't respond to key presses if input field is not focused
    if (!focused) return;

    // show the suggestions dropdown when the user presses the down arrow key
    // if the dropdown is currently closed
    if (!active && !moveUp) {
      this.setState({ active: true });
      return;
    }

    if (moveUp) {
      if (selectionIndex - 1 > -1) {
        this.setState({ selectionIndex: selectionIndex - 1 });
      }
    } else {
      if (selectionIndex + 1 < filteredIcons.length) { // eslint-disable-line
        this.setState({ selectionIndex: selectionIndex + 1 });
      }
    }

    // scroll to the currently selected icon in the overflowed div
    scrollIntoView(document.querySelector('div.selected'), { time: 500 });
  }

  confirmSelection(event) {
    const { input } = this.props;
    const {
      active,
      filteredIcons,
      selectionIndex,
    } = this.state;

    if (active) {
      const selection = filteredIcons[selectionIndex];

      // prevent the form from submitting when the suggestions dropdown is active
      event.preventDefault();

      // call `onChange()` callback and update `search` state with selection
      input.onChange(selection.trim().split(' ').join('_'));
      this.setState({ search: selection }, () => this.filterIcons());

      // close the suggestions dropdown
      this.handleClickOutside();
    }
  }

  filterIcons() {
    const { search } = this.state;
    const parsedSearch = search.toLowerCase().trim().split(' ').join('_');
    const filteredIcons = fontAwesomeIcons.filter(icon =>
      icon.toLowerCase().includes(parsedSearch) || // eslint-disable-line
        icon.toLowerCase() === search.toLowerCase() // eslint-disable-line
    ); // eslint-disable-line

    this.setState({
      filteredIcons,
      selectionIndex: filteredIcons.indexOf(parsedSearch) || 0,
    });
  }

  render() {
    const {
      input,
      label,
      primaryColor,
      containerClass,
      containerStyle,
      inputClass,
      inputStyle,
      // dropdownHeight,
    } = this.props;
    const {
      search,
      active,
      filteredIcons,
      selectionIndex,
    } = this.state;

    return (
      <div
        className={`icon-picker ${containerClass}`}
        style={{
          position: 'relative',
          ...containerStyle,
        }}
      >
        <label>{label}</label>
        <div className="icon-wrapper">
          {
            (search && fontAwesomeIcons.find(icon => icon === search)) &&
            <span
              className="icon-selected"
            >

              <FontAwesomeIcon icon={search} />
            </span>
          }
          <input
            className={inputClass}
            style={{
                marginBottom: '0px',
              // boxShadow: !active ? 'inset 0 1px 2px rgba(10, 10, 10, 0.06)' : 'none',
              //   border: 'solid rgba(0, 0, 0, 0.1) 1px',
              // borderRadius: active ? '5px 5px 0 0' : '5px',
                // backgroundColor: '#fafafa',
                ...inputStyle,
            }}
            type="text"
            onFocus={() => this.setState({ focused: true, active: true })}
            onBlur={() => this.setState({ focused: false, active: false })}
            value={search}
            onChange={(event) => {
                const iconName = event.target.value;
              input.onChange(iconName.trim().split(' ').join('_'));
              this.setState({
                  active: true,
                  search: iconName,
              }, () => this.filterIcons());
            }}
            placeholder="search"
          />
        </div>
        <div
          className="icon-dropdown"
          style={{
            // height: active ? dropdownHeight : '0',
            display: active ? 'flex' : 'none',
          }}
        >
          {filteredIcons.map((icon, i) => (
            <div
              key={icon}
              className={i === selectionIndex ? 'selected' : ''}
              style={{
                color: i === selectionIndex ? 'white' : '',
                backgroundColor: i === selectionIndex ? primaryColor : '',
              }}
              onClick={() => {
                input.onChange(icon);
                this.setState({
                    search: icon,
                    active: false,
                }, () => this.filterIcons());
              }}
            >
              <FontAwesomeIcon icon={icon} />
              <span>{icon.split('_').join(' ')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

IconPickerField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string,
  primaryColor: PropTypes.string,
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  inputClass: PropTypes.string,
  inputStyle: PropTypes.shape({}),
  // dropdownHeight: PropTypes.string,
};

IconPickerField.defaultProps = {
  label: 'pick an icon',
  primaryColor: 'rgba(0, 0, 0, 0.6)',
  containerClass: '',
  containerStyle: {},
  inputClass: '',
  inputStyle: {},
  // dropdownHeight: '200px',
};

export default onClickOutside(IconPickerField);
