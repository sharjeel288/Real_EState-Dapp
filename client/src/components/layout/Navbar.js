import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, isLoading }, Logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/propertyList'>
          <span className='hide-sm'>Buy</span>
        </Link>
      </li>
      <li>
        <Link to='/sellProperty'>
          <span className='hide-sm'>Sell</span>
        </Link>
      </li>
      <li>
        <Link onClick={Logout} to='/'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>{' '}
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='register'>Register</Link>
      </li>
      <li>
        <Link to='login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-home'></i> Real Estate
        </Link>
      </h1>
      {!isLoading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  Logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  Logout: state.auth,
});

export default connect(mapStateToProps, { Logout })(Navbar);
