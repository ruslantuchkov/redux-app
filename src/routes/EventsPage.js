import React, { Component } from 'react';
import EventsTable from '../components/events/EventsTable';

class EventsPage extends Component {
  render() {
    return (
      <div>
        <h1>Events page</h1>
        <EventsTable />
      </div>
    );
  }
}

export default EventsPage;
