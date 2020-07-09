import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../Router/PrivateRoute';

import Alert from '../layout/alert';
import login from '../auth/login';
import register from '../auth/register';
import Property from '../propertys/propertys';
import singleProperty from '../property/singleProperty';
import editProperty from '../propertyForm/updateProperty';
import createProperty from '../propertyForm/create-property';
import NotFound from '../layout/NotFound';

const Routes = props => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/login' component={login} />
        <Route exact path='/register' component={register} />
        <PrivateRoute exact path='/PropertyList' component={Property} />
        <PrivateRoute exact path='/editProperty/:id' component={editProperty} />
        <PrivateRoute exact path='/sellProperty' component={createProperty} />
        <PrivateRoute exact path='/detail/:id' component={singleProperty} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
