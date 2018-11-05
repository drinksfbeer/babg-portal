import React from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import FancyTabs from '../../../common/fancyTabs/fancyTabs';
import Loading from '../../../common/loading/loading';

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

class InvoicesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      invoices: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.fetchInvoiceDetails();
    await this.fetchStripeCustomers();
  }

  async fetchInvoiceDetails() {
    try {
      const response = await axios.get(`${hostname}/api/v1/invoices`);
      const { data } = response;
      this.setState({ invoices: data });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  }

  async fetchStripeCustomers() {
    try {
      const response = await axios.get(`${hostname}/api/v1/customers`);
      const { data } = response;
      this.setState({ customers: data, loading: false });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  }

  render() {
    const filters = [
      { value: 'all', label: 'All' },
      { value: 'sub', label: 'Subscriptions' },
      { value: 'one', label: 'One-Time' },
      { value: 'paid', label: 'Paid' },
      { value: 'unpaid', label: 'Un-paid' },
      { value: 'pastDue', label: 'Past Due' },
    ];
    const { customers } = this.state;
    const filteredInvoices = this.state.invoices.filter((invoice) => {
      if (this.state.tabIndex === 1) {
        return invoice.subscription;
      } else if (this.state.tabIndex === 2) {
        return !invoice.subscription;
      } else if (this.state.tabIndex === 3) {
        return invoice.paid;
      } else if (this.state.tabIndex === 4) {
        return !invoice.paid;
      } else if (this.state.tabIndex === 5) {
        if (!invoice.paid && !invoice.closed &&
            moment(invoice.due_date * 1000).isBefore(moment())) {
          return invoice;
        }
        return null;
      }
      return invoice;
    });
    return (
      <FancyTabs
        containerClass="cell large-10 medium-10 small-12"
        contentClass="table"
        tabs={filters}
        index={this.state.tabIndex}
        onChange={i => this.setState({ tabIndex: i })}
      >
        {this.state.loading ? <Loading /> :
          filteredInvoices.map((invoice) => {
            const matchingCustomer = customers.find(customer => customer.id === invoice.customer);
            return (
              <div key={invoice.id}>
                <div className="grid-x invoiceContainer">
                  <div className="cell large-4 invoice">
                    <h4>{matchingCustomer && matchingCustomer.email ? matchingCustomer.email : 'No Email Provided'}
                    </h4>
                    {
                      !(invoice.billing === 'charge_automatically') ? <h6>Due: {moment(invoice.due_date * 1000).format('MMMM Do YYYY, h:mm:ss a')}</h6> : null
                    }
                    <p className={invoice.paid ? 'paymentStatus paid' : 'paymentStatus unpaid'}><i className="material-icons">attach_money</i><span>{invoice.paid ? 'PAID' : 'UNPAID'}</span></p>
                  </div>
                  <div className="cell large-4 invoice">
                    <h5>Due: {(invoice.amount_due / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h5>
                    <h5>Paid: {(invoice.amount_paid / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h5>
                  </div>
                  <div className="cell large-4 invoice">
                    <h5>{invoice.lines.data[0].description}</h5>
                  </div>
                </div>
                <hr />
              </div>
          );
})}
      </FancyTabs>
    );
  }
}

InvoicesList.propTypes = {
  // members: PropTypes.arrayOf(PropTypes.shape({})),
};

InvoicesList.defaultProps = {
  // members: [],
};

export default InvoicesList;
