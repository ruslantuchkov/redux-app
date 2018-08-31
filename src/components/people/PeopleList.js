import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import { peopleSelector, fetchAllPeople } from '../../ducks/people';

function mapStateToProps(state) {
  return {
    people: peopleSelector(state)
  };
}

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchAllPeople();
  }

  componentDidUpdate({ people }) {
    if (people.length && this.props.people.length > people.length) {
      setTimeout(() => {
        this.list.scrollToRow(this.props.people.length);
      }, 0);
    }
  }

  rowRenderer = ({ index, key, style }) => {
    const person = this.props.people[index];
    return (
      <div key={key} style={style}>
        <h3>{person.email}</h3>
        <h4>{person.firstName}</h4>
        <h4>{person.lastName}</h4>
      </div>
    );
  };

  render() {
    return (
      <List
        rowRenderer={this.rowRenderer}
        rowCount={this.props.people.length}
        rowHeight={150}
        height={300}
        width={400}
        ref={ref => (this.list = ref)}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  { fetchAllPeople }
)(PeopleList);
