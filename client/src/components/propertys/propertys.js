import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import PropertyItems from './propertyItems';
import { connect } from 'react-redux';
import { getAllPropertys } from '../../actions/property';
import Spinner from '../layout/Spinner';

const propertys = ({ getAllPropertys, property: { propertys, loading } }) => {
  useEffect(() => {
    getAllPropertys();
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Real Estate</h1>
          <p className='lead'>
            <i className='fas fa-home'></i> Browse Property
          </p>
          <div className='grid'>
            {propertys.length > 0 ? (
              propertys.map(property => (
                <PropertyItems key={property._id} property={property} />
              ))
            ) : (
              <h4>No Property found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

propertys.propTypes = {
  getAllPropertys: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  property: state.property,
});

export default connect(mapStateToProps, { getAllPropertys })(propertys);
