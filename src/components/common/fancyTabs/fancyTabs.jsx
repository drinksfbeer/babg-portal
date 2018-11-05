import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FancyTabs = ({
  containerClass,
  containerStyle,
  contentClass,
  contentStyle,
  tabStyle,
  tabs,
  index,
  onChange,
  children,
}) => (
  <div
    className={`fancyTabs${containerClass ? ` ${containerClass}` : ''}`}
    style={containerStyle}
  >
    <div className="grid-x">
      {tabs.map(({ value, label, sublabel }, i) => (
        <div
          key={value}
          className={classNames({
            cell: true,
            'large-auto': true,
            'medium-auto': true,
            'small-auto': true,
            'app-item': true,
            tab: true,
            active: i === index,
          })}
          style={tabStyle}
          onClick={() => onChange(i)}
        >
          {label}
          {
            typeof sublabel !== 'undefined' &&
            <span className="sublabel">
              {sublabel}
            </span>
          }
        </div>
      ))}
    </div>
    {
      children &&
      <div className="grid-x">
        <div
          className={classNames({
            cell: true,
            'large-12': true,
            'app-item': true,
            content: true,
            [contentClass]: !!contentClass,
          })}
          style={contentStyle}
        >
          {children}
        </div>
      </div>
    }
  </div>
);

FancyTabs.propTypes = {
  containerClass: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  contentClass: PropTypes.string,
  contentStyle: PropTypes.shape({}),
  tabStyle: PropTypes.shape({}),
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    sublabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

FancyTabs.defaultProps = {
  containerClass: '',
  containerStyle: {},
  contentClass: '',
  contentStyle: {},
  tabStyle: {},
  children: null,
};

export default FancyTabs;
