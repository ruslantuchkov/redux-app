import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import { selectedEventsSelector } from '../../ducks/events';

function mapStateToProps(state) {
  return {
    events: selectedEventsSelector(state)
  };
}

class SelectedEvents extends Component {
  rowRenderer = ({ index, key, style }) => {
    const event = this.props.events[index];
    return (
      <div key={key} style={style}>
        <h3>{event.title}</h3>
        {event.where}
      </div>
    );
  };

  render() {
    return (
      <List
        rowCount={this.props.events.length}
        width={500}
        height={300}
        rowHeight={80}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

export default connect(mapStateToProps)(SelectedEvents);
