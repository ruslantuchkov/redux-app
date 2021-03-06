import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPerson } from '../ducks/people';
import NewPersonForm from '../components/people/NewPersonForm';
import Loader from '../components/common/Loader';
import PeopleList from '../components/people/PeopleList';

class PeoplePage extends Component {
  render() {
    const { loading, addPerson } = this.props;

    return (
      <div>
        <h2>Add new person</h2>
        <PeopleList />
        {loading ? <Loader /> : <NewPersonForm onSubmit={addPerson} />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.people.loading
  }),
  { addPerson }
)(PeoplePage);
