import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { acceptOffer, checkOffer } from '../../actions/property';
import Alert from '../layout/alert';

const PropertyItem = ({ property, auth, acceptOffer, checkOffer }) => {
  const setOffer = offer => {
    acceptOffer(property.tokenId, offer);
  };
  const CheckingOffer = () => {
    checkOffer(property.tokenId);
  };
  return (
    <Fragment>
      <Alert />
      {property.offers.map(offer => (
        <div className='post bg-white p-1 my-1' key={offer._id}>
          <div>
            <p className='my-1'>
              <strong>Price Offer</strong>{' '}
              <strong>{offer.offerValue}ETH</strong>
            </p>
            <p className='post-date'>
              Posted on {<Moment format='YYYY/MM/DD'>{offer.date}</Moment>}
            </p>
            {property.user._id !== auth.user._id &&
              offer.user === auth.user._id &&
              offer.offerValue && (
                <button
                  type='button'
                  className='btn btn-success'
                  onClick={e => CheckingOffer()}
                >
                  Check your offer
                </button>
              )}
            {!auth.isLoading && property.user._id === auth.user._id && (
              <Fragment>
                <button
                  type='button'
                  className='btn btn-success'
                  onClick={e => setOffer(true)}
                >
                  <i className='fas fa-check'></i>
                </button>

                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={e => setOffer(false)}
                >
                  <i className='fas fa-times'></i>
                </button>
              </Fragment>
            )}
          </div>
        </div>
      ))}
    </Fragment>
  );
};

PropertyItem.propTypes = {
  property: PropTypes.object.isRequired,
  acceptOffer: PropTypes.func.isRequired,
  checkOffer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { acceptOffer, checkOffer })(
  PropertyItem
);
