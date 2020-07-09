import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { createAndUpdateProperty } from '../../actions/property';

const createProperty = ({ createAndUpdateProperty, history }) => {
  const [formState, setFormData] = useState({
    price: '',
    location: '',
    description: '',
    image: null,
  });
  const { price, location, description } = formState;

  const onChange = e =>
    setFormData({ ...formState, [e.target.name]: e.target.value });

  const filePicker = e => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      console.log(pickedFile);
      setFormData({ ...formState, image: pickedFile });
      return;
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('location', formState.location);
    formData.append('price', formState.price);
    formData.append('description', formState.description);
    formData.append('image', formState.image);

    createAndUpdateProperty(formData, history, formState.price);
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Property Info</h1>
      <p className='lead'>
        <i className='fas fa-home'></i> Let's get some information about your
        Property
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='*Location'
            id='location'
            name='location'
            value={location}
            required
            onChange={e => onChange(e)}
          />
          <small className='form-text'>*Property Location</small>
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='*price'
            id='price'
            name='price'
            value={price}
            required
            onChange={e => onChange(e)}
          />
          <small className='form-text'>*Porperty Price</small>
        </div>
        <div className='form-control'>
          <input
            type='file'
            accept='.jpg,.png,.jpeg'
            id='image'
            name='image'
            required
            onChange={filePicker}
          />
          <small className='form-text'>Property Image</small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of your property'
            name='description'
            id='description'
            value={description}
            required
            onChange={e => onChange(e)}
          ></textarea>
          <small className='form-text'>
            Tell us a little about your property
          </small>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/propertyList'>
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

createProperty.propTypes = {
  createAndUpdateProperty: PropTypes.func.isRequired,
};

export default connect(null, { createAndUpdateProperty })(
  withRouter(createProperty)
);
