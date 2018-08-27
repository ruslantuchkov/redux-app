import React, { Component } from 'react';
import { Formik } from 'formik';

class NewPersonForm extends Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: ''
          }}
          validate={values => {
            let errors = {};

            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }

            if (!values.firstName) {
              errors.firstName = 'Required';
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            this.props.onSubmit(values);
            setSubmitting(false);
          }}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
              {touched.firstName &&
                errors.firstName && <div>{errors.firstName}</div>}

              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
              {touched.lastName &&
                errors.lastName && <div>{errors.lastName}</div>}

              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <div>{errors.email}</div>}

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        />
      </div>
    );
  }
}

export default NewPersonForm;
