import React from 'react';
import { Link } from 'react-router-dom';
// import Modal from '../../../common/modal/modal';

const MissingEvent = () => (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '500px',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          flex: '1 1 100',
          fontWeight: '600',
          color: '#07505c',
          fontSize: '2.5rem',
        }}
      >
        This Event Has Past or could Not Be found
      </h3>
      <Link
        style={{
          flex: '1 1 100',
          maxWidth: '225px',
          textAlign: 'center',
        }}
        to="/dashboard"
        className="cell shrink btnBack"
      >
        BACK TO DASHBOARD
      </Link>
    </div>
  </div>
);

export default MissingEvent;
