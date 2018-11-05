import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
// import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

const _Modal = props => (
  <div className="modal">
    <ModalContent {...props}>
      {props.children}
    </ModalContent>
  </div>
);

_Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

_Modal.defaultProps = {
  children: null,
};

class _ModalContent extends React.Component {
  handleClickOutside(evt) {
    // const { noexit, history } = this.props;
    const { noexit, close } = this.props;
    if (!noexit) {
      if (evt.target.className === 'modal') {
        // history.goBack();
        close();
      }
    }
  }

  render() {
    const { noexit, flex } = this.props;
    const { large, med, sml } = this.props;
    // const { children, history } = this.props;
    const { children, close } = this.props;
    const style = {
      display: flex ? 'flex' : '',
      justifyContent: flex ? 'center' : '',
      alignItems: flex ? 'center' : '',
    };

    return (
      <div
        className={classNames({
          'modal-content': true,
          sml,
          med,
          large,
        })}
        style={style}
        // onKeyDown={e => e.keyCode === 27 && history.goBack()}
        onKeyDown={e => e.keyCode === 27 && close()}
      >
        {
          !noexit &&
          <span
            className="close"
            // onClick={() => history.goBack()}
            onClick={() => close()}
          >
            &times;
          </span>
        }
        {children}
      </div>
    );
  }
}

_ModalContent.propTypes = {
  noexit: PropTypes.bool,
  flex: PropTypes.bool,
  large: PropTypes.bool,
  med: PropTypes.bool,
  sml: PropTypes.bool,
  children: PropTypes.node,
  close: PropTypes.func,
};

_ModalContent.defaultProps = {
  noexit: false,
  flex: false,
  large: false,
  med: true,
  sml: false,
  children: null,
  close: () => {},
};

const ModalContent = onClickOutside(_ModalContent);
// const Modal = withRouter(_Modal);

export default _Modal;
