import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll, eventListSelector } from '../../ducks/events';

function mapStateToProps(state) {
  return {
    events: eventListSelector(state)
  };
}

class EventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            {this.props.events.map(event => (
              <tr key={event.uid}>
                <td>{event.title}</td>
                <td>{event.when}</td>
                <td>{event.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { fetchAll }
)(EventList);
