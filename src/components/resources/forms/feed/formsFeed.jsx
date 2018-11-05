import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Link } from 'react-router-dom';

import FormsList from '../list/adminFormsList';
import FormsNav from '../nav/adminFormsNav';
import FormsForm from '../form/formsForm';

class FormDirectory extends React.Component {
  state = {
    search: '',
  }

  componentDidMount() {
    const { forms, crudAction } = this.props;
    if (forms.length === 0) {
      crudAction({
        resource: 'forms',
      });
    }
  }

  changeFormDirectoryState = newState => this.setState(newState)

  render() {
    const { forms, chapter } = this.props;
    const { search } = this.state;
    const filteredForms = forms
      .filter(form => !search || form.name.toLowerCase().includes(search.toLowerCase()));

    const newFormLink = chapter ? (
      '/chapters/:slug/activity/forms/new'
    ) : (
      '/guild/forms/new'
    );
    const formDirectoryLink = chapter ? (
      `/chapters/${chapter.slug}/activity/forms`
    ) : (
      '/guild/forms'
    );

    return (
      <Switch>
        <Route
          path={newFormLink}
          render={() => (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Link
                  to={formDirectoryLink}
                >
                  <span style={{ fontSize: '200%', marginRight: '5px' }}>&#8249;</span>
                  <em>Back to Forms Directory</em>
                </Link>
                <h2>Create New Form</h2>
                <div />
              </div>
              <FormsForm
                chapter={chapter}
              />
            </div>
          )}
        />
        <Route
          path={formDirectoryLink}
          render={() => [
            <FormsNav
              key="formsNav"
              changeFormDirectoryState={this.changeFormDirectoryState}
              chapter={chapter}
              {...this.state}
            />,
            <FormsList
              forms={filteredForms}
              key="formsList"
            />,
          ]}
        />
      </Switch>
    );
  }
}

FormDirectory.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })),
  chapter: PropTypes.shape({}),
  crudAction: PropTypes.func.isRequired,
};

FormDirectory.defaultProps = {
  forms: [],
  chapter: null,
};

export default FormDirectory;
