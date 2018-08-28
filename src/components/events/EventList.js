import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll, selectEvent, eventListSelector } from '../../ducks/events';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

function mapStateToProps(state) {
  return {
    events: eventListSelector(state)
  };
}

class EventList extends Component {
  componentDidMount() {
    this.props.fetchAll();
  }

  handleRowClick = ({ rowData }) => this.props.selectEvent(rowData.uid);

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  render() {
    const { events } = this.props;

    return (
      <div>
        <Table
          rowCount={events.length}
          rowGetter={this.rowGetter}
          width={700}
          height={300}
          rowHeight={40}
          headerHeight={50}
          overscanRowCount={1}
          onRowClick={this.handleRowClick}
        >
          <Column dataKey="title" width={200} label="name" />
          <Column dataKey="where" width={300} label="place" />
          <Column dataKey="url" width={300} label="url" />
        </Table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { fetchAll, selectEvent }
)(EventList);
