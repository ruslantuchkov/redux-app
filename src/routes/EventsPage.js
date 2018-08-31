import React, { Component } from 'react';
import EventsTable from '../components/events/EventsTable';
import SelectedEvents from '../components/events/SelectedEvents';

class EventsPage extends Component {
  render() {
    return (
      <div>
        <h1>Events page</h1>
        <SelectedEvents />
        <EventsTable />
      </div>
    );
  }
}

export default EventsPage;
