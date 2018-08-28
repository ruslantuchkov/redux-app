import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLazy, selectEvent, eventListSelector } from '../../ducks/events';
import { Table, Column, InfiniteLoader } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Loader from '../common/Loader';

function mapStateToProps(state) {
  return {
    events: eventListSelector(state),
    loading: state.events.loading,
    loaded: state.events.loaded
  };
}

class EventList extends Component {
  componentDidMount() {
    this.props.fetchLazy();
  }

  handleRowClick = ({ rowData }) => this.props.selectEvent(rowData.uid);

  isRowLoaded = ({ index }) => index < this.props.events.length;

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  loadMoreRows = () => {
    this.props.fetchLazy();
  };

  render() {
    const { events, loading, loaded } = this.props;
    if (loading) return <Loader />;
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        rowCount={loaded ? events.length : events.length + 1} //firebase не дает узнать длину всего списка
        loadMoreRows={this.loadMoreRows}
      >
        {({ onRowsRendered, registerChild }) => (
          <Table
            ref={registerChild}
            rowCount={events.length}
            rowGetter={this.rowGetter}
            rowHeight={40}
            headerHeight={50}
            overscanRowCount={1}
            width={700}
            height={300}
            onRowClick={this.handleRowClick}
            onRowsRendered={onRowsRendered}
          >
            <Column dataKey="title" width={200} label="name" />
            <Column dataKey="where" width={300} label="place" />
            <Column dataKey="url" width={300} label="url" />
          </Table>
        )}
      </InfiniteLoader>
    );
  }
}

export default connect(
  mapStateToProps,
  { fetchLazy, selectEvent }
)(EventList);
