import React from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import Loading from '../../../common/loading/loading';

const hostname = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

class InvoicesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: '',
      customerId: '',
      chargeAmount: 0,
      invoiceDescription: '',
      daysDue: 0,
      newCustomer: true,
      customers: [],
      completed: false,
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.fetchStripeCustomers();
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
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

  async submit(event) {
    this.setState({ loading: true, completed: false });
    event.preventDefault();
    const {
      email, customerId, chargeAmount, invoiceDescription, daysDue,
    } = this.state;
    try {
      const pkg = {
        email, customerId, chargeAmount, invoiceDescription, daysDue,
      };
      await axios.post(`${hostname}/api/v1/invoices`, pkg);
      this.setState({
        loading: false,
        email: '',
        customerId: '',
        chargeAmount: 0,
        invoiceDescription: '',
        daysDue: 0,
        newCustomer: true,
        customers: [],
        completed: true,
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  }

  render() {
    const { customers, completed } = this.state;
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <form>
        {
          completed ? <h1 className="completed">Invoice Successful</h1> : null
        }
        <label>{this.state.newCustomer ? 'New' : 'Returning'} User:</label>
        <label className="switch" >
          <input type="checkbox" onClick={() => this.setState({ newCustomer: !this.state.newCustomer })} />
          <span className="slider" />
        </label>
        {
          this.state.newCustomer ?
            <div>
              <label>New Email:</label>
              <input type="text" name="email" value={this.state.email} onChange={this.onChange} />
            </div>
          :
            <div>
              <label>Existing Emails:</label>
              <select name="customerId" onChange={this.onChange}>
                <option value="">Select an Email</option>
                {
                  customers.map((customer) => {
                    if (customer.id && customer.email) {
                      return <option value={customer.id}>{customer.email}</option>;
                    }
                      return null;
                  })
                }
              </select>
            </div>
        }
        <label>Charge Amount in Dollars (ex. 10.00):</label>
        <input type="number" name="chargeAmount" value={this.state.chargeAmount} onChange={this.onChange} />
        <label>Invoice Description:</label>
        <input type="text" name="invoiceDescription" value={this.state.invoiceDescription} onChange={this.onChange} />
        <label>Days Until Due:</label>
        <input type="number" name="daysDue" value={this.state.daysDue} onChange={this.onChange} />
        <button className="button" onClick={this.submit}>Submit</button>
      </form>
    );
  }
}

export default InvoicesForm;
