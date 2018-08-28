import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll, selectEvent, eventListSelector } from '../../ducks/events';

function mapStateToProps(state) {
  return {
    events: eventListSelector(state)
  };
}

class EventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  handleRowClick = uid => () => {
    this.props.selectEvent(uid);
  };

  render() {
    return (
      <div>
        <table>
          <tbody>
            {this.props.events.map(event => (
              <tr key={event.uid} onClick={this.handleRowClick(event.uid)}>
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
  { fetchAll, selectEvent }
)(EventList);
