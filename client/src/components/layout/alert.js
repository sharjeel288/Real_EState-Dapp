import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const alert = props =>
  props.alerts !== null &&
  props.alerts.length > 0 &&
  props.alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertTypes}`}>
      {alert.msg}
    </div>
  ));

alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(alert);
