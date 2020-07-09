import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { setOffer } from '../../actions/property';
import { connect } from 'react-redux';

const offerForm = ({ setOffer, property, auth }) => {
  const [offerValue, setValue] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    setOffer(property._id, { offerValue }, property.tokenId);
    setValue('');
  };
  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Set Offer...</h3>
      </div>
      <form className='form my-1' onSubmit={e => onSubmit(e)}>
        <input
          type='number'
          name='offerValue'
          placeholder='Made an offer'
          value={offerValue}
          onChange={e => setValue(e.target.value)}
          required
        ></input>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

offerForm.propTypes = {
  setOffer: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setOffer })(offerForm);
