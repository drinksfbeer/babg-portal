import React from 'react';

export default class LocationPicker extends React.Component {
  render() {
    const { input, label, locations } = this.props;

    return (
      <div>
        <label>{label}</label>
        <select
          onChange={(e) => {
						if (e.target.value === 'new') {
							console.log('new');
						}	else {
							input.onChange(e);
						}
					}}
        >
          <option value="" />
          {locations.map(loc =>
  (<option
    key={loc._id}
    value={loc.uuid}
    style={{ fontSize: '85%' }}
  >
    {loc.name} - {loc.street}, {loc.city} - {loc.profileLocation ? 'location' : 'events only'}
   </option>))}
          <option
            value="new"
            style={{ color: 'rgba(0,0,0,0.6)', fontSize: '85%' }}
          >
						 + Create New Location
          </option>
        </select>
      </div>
    );
  }
}
