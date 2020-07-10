import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSingleProperty } from '../../actions/property';
import Spinner from '../layout/Spinner';
import OfferFoam from './offerForm';
import PropertyItem from './PropertyItem';
import { BuyProperty } from '../../actions/property';

const singleProperty = ({
  BuyProperty,
  match,
  property: { property, loading },
  auth,
  getSingleProperty,
  history,
}) => {
  useEffect(() => {
    getSingleProperty(match.params.id);
  }, []);

  const sellProp = () => {
    let offerVal = {};
    property.offers.map(offer => {
      if (offer.user === auth.user._id) {
        offerVal = offer;
      }
      return offerVal;
    });
    console.log(offerVal);

    BuyProperty(property._id, property.tokenId, offerVal, history);
  };

  return (
    <Fragment>
      {property === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <main className='centered'>
            <h1>{property.location}</h1>
            <hr />
            <div className='image'>
              <img
                src={`${process.env.REACT_APP_URL}/${property.image}`}
                alt={property.image}
              />
            </div>
            <h2>Owner:: {property.user.name}</h2>
            <h2>{property.price}ETH</h2>
            <p>{property.description}</p>
            <div className='card__actions'>
              {!auth.isLoading && property.user._id === auth.user._id && (
                <Link to={`/editProperty/${property._id}`} className='btn'>
                  Edit
                </Link>
              )}
              {property.offers.map(offer =>
                property.user._id !== auth.user._id && offer.accept ? (
                  <button
                    key={offer._id}
                    type='button'
                    className='btn btn-success'
                    onClick={e => sellProp()}
                  >
                    Buy
                  </button>
                ) : null
              )}
              <Link to='/propertyList' className='btn'>
                Go Back
              </Link>
            </div>
            <br />
            {!auth.isLoading && property.user._id !== auth.user._id && (
              <OfferFoam property={property} />
            )}
            <br />

            <PropertyItem property={property} />
          </main>
        </Fragment>
      )}
    </Fragment>
  );
};

singleProperty.propTypes = {
  auth: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  getSingleProperty: PropTypes.func.isRequired,
  BuyProperty: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  property: state.property,
});

export default connect(mapStateToProps, { getSingleProperty, BuyProperty })(
  withRouter(singleProperty)
);
