import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { editProperty, getSingleProperty } from '../../actions/property';

const updateProperty = ({
  match,
  history,
  editProperty,
  getSingleProperty,
  property: { property, loading },
}) => {
  const [formState, setFormData] = useState({
    price: '',
    location: '',
    description: '',
  });
  useEffect(() => {
    getSingleProperty(match.params.id);
    setFormData({
      price: loading || !property.price ? '' : property.price,
      location: loading || !property.location ? '' : property.location,
      description: loading || !property.description ? '' : property.description,
    });
  }, [loading]);
  const { price, location, description } = formState;

  const onChange = e =>
    setFormData({ ...formState, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    editProperty(formState, history, match.params.id, property.tokenId);
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
            onChange={e => onChange(e)}
          />
          <small className='form-text'>*Porperty Price</small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of your property'
            name='description'
            id='description'
            value={description}
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

updateProperty.propTypes = {
  property: PropTypes.object.isRequired,
  editProperty: PropTypes.func.isRequired,
  getSingleProperty: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  property: state.property,
});

export default connect(mapStateToProps, { editProperty, getSingleProperty })(
  withRouter(updateProperty)
);
