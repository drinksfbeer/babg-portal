import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import actions from '../../../../redux/actions/index';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import InvoicesList from '../../../resources/invoices/list/invoicesList';
import InvoiceForm from '../../../resources/invoices/form/invoicesForm';


const SubscriptionsContainer = ({ user }) => {
  const isMaster = user.role && user.role === 'master';
  const sections = [
    {
      title: 'Invoices',
      icon: 'attach_money',
      to: '/invoices',
    },
    {
      title: 'Create New Invoice',
      icon: 'note_add',
      to: '/invoices/new',
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Guild Member Invoices"
        icon="attach_money"
        replaceHistory
        sections={sections}
      />
      {
        isMaster &&
        <Route
          exact
          path="/invoices"
          render={() => (
            <div className="sectionPadding">
              <InvoicesList />
            </div>
          )}
        />
      }
      {
        isMaster &&
        <Route
          exact
          path="/invoices/new"
          render={() => (
            <div className="sectionPadding">
              <InvoiceForm />
            </div>
          )}
        />
      }
    </div>
  );
};

SubscriptionsContainer.propTypes = {
  user: PropTypes.shape({}),
};

SubscriptionsContainer.defaultProps = {
  user: {},
};

export default connect(
  state => ({
    user: state.users.auth.user,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(actions.asyncAction, dispatch),
  }),
  null,
  { pure: false },
)(SubscriptionsContainer);
