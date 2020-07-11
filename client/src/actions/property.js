import {
  GET_PROPERTY,
  GET_PROPERTYS,
  UPDATE_PROPERTY,
  PROPERTY_ERRORS,
  CLEAR_PROPERTY,
  SET_OFFER,
  SELL_PROPERTY,
  ACCEPT_OFFER,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';
import { Contract_ABI, Contract_ADDRESS } from '../Contract-Data/contracData';
import { Account } from '../App';

//Get All Propertys
export const getAllPropertys = () => async dispatch => {
  dispatch({ type: CLEAR_PROPERTY });
  try {
    const res = await axios.get('/api/property');
    dispatch({
      type: GET_PROPERTYS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROPERTY_ERRORS,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Get Single Property
export const getSingleProperty = propId => async dispatch => {
  try {
    const res = await axios.get(`/api/property/${propId}`);
    dispatch({
      type: GET_PROPERTY,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROPERTY_ERRORS,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Create Property only not updating
export const createAndUpdateProperty = (
  formData,
  history,
  price
) => async dispatch => {
  //Creating Property on BlockChain
  let id = '';
  console.log(price);
  const web3 = window.web3;
  const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
  const account = await web3.eth.getAccounts();

  try {
    const res = await axios.post('/api/property', formData);
    id = res.data._id;
    await Contract.methods
      .setPropertyMetaData(
        account[0],
        res.data.tokenId,
        `http://localhost:3000/detail/${res.data._id}`,
        res.data.price
      )
      .send({ from: account[0] })
      .on('transactionHash', receipt => {
        console.log('setPropertyMetaData', receipt);
        dispatch(setAlert('Please wait Transaction is in Proccess', 'dark'));
      })
      .on('receipt', receipt => {
        console.log(receipt);
        dispatch({
          type: GET_PROPERTY,
          payload: res.data,
        });
        dispatch(setAlert('Property Created', 'success'));
        history.push('/propertyList');
      });
  } catch (error) {
    if (error.code === 4001) {
      const response = await axios.delete(`/api/property/delete/${id}`);
      dispatch(setAlert(response.data.msg, 'success'));
      console.log('Tx ERROR', error.message);
      dispatch(setAlert(error.message, 'danger'));
    } else if (error.response.status === 400) {
      console.log(error.response);
      const err = error.response.data.errors;
      console.log(err);
      if (err) {
        err.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROPERTY_ERRORS,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};

//Update Property

export const editProperty = (
  formData,
  history,
  propId,
  tokenId
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify(formData);
  try {
    const web3 = window.web3;
    const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
    const ownerAccount = await Contract.methods.ownerOf(tokenId).call();
    console.log('Owner Acc::', ownerAccount.toString());

    if (Account === ownerAccount.toString()) {
      await Contract.methods
        .setPropertyValue(ownerAccount, tokenId, formData.price)
        .send({ from: ownerAccount })
        .on('transactionHash', hash => {
          dispatch(setAlert('Please wait Transaction is in Proccess', 'dark'));
        })
        .on('receipt', async receipt => {
          console.log(receipt);

          const res = await axios.put(`/api/property/${propId}`, body, config);
          console.log(res.data);
          dispatch({
            type: UPDATE_PROPERTY,
            payload: res.data,
          });

          dispatch(setAlert('Property  Updated', 'success'));

          history.push('/propertyList');
        });
    } else {
      dispatch(setAlert('You are not the onwer of the property', 'dangere'));
    }
  } catch (error) {
    if (error.code === 4001) {
      console.log('Tx ERROR', error.message);
      dispatch(setAlert(error.message, 'danger'));
    } else if (error.code !== 4001) {
      console.log('Tx ERROR', error.message);
      dispatch(setAlert(error.message, 'danger'));
    } else if (error.response.status === 400) {
      console.log(error.response);
      const err = error.response.data.errors;
      console.log(err);
      if (err) {
        err.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROPERTY_ERRORS,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};

// set Offer for property

export const setOffer = (propId, formData, tokenId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify(formData);
  try {
    const web3 = window.web3;
    const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
    const account = await web3.eth.getAccounts();
    const ownerAccount = await Contract.methods.ownerOf(tokenId).call();
    console.log(ownerAccount.toString());

    console.log(formData);

    if (Account !== ownerAccount.toString()) {
      //Creating Property Offer on BlockChain

      await Contract.methods
        ._BuyPropertyOffer(account[0], tokenId, formData.offerValue)
        .send({ from: account[0] })
        .on('transactionHash', hash => {
          dispatch(setAlert('Please wait Transaction is in Proccess', 'dark'));
        })
        .on('receipt', async receipt => {
          console.log(receipt);
          const res = await axios.post(
            `/api/property/offer/${propId}`,
            body,
            config
          );
          dispatch({
            type: SET_OFFER,
            payload: res.data,
          });

          dispatch(setAlert('Offer Created', 'success'));
        });
    } else {
      dispatch(setAlert('Offer not Accepted You Own The Property', 'danger'));
    }
  } catch (error) {
    if (error.code === 4001) {
      console.log('Tx ERROR', error.message);
      dispatch(setAlert(error.message, 'danger'));
    } else if (error.code !== 4001) {
      console.log('Tx ERROR', error.message);
      dispatch(setAlert(error.message, 'danger'));
    } else if (error.response.status === 400) {
      console.log(error.response);
      const err = error.response.data.errors;
      console.log(err);
      if (err) {
        err.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROPERTY_ERRORS,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};

// Accept offer of the Buyer

export const acceptOffer = (
  tokenId,
  offer,
  propId,
  offerId
) => async dispatch => {
  const web3 = window.web3;
  const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
  const ownerAccount = await Contract.methods.ownerOf(tokenId).call();
  console.log(ownerAccount);

  if (Account === ownerAccount.toString()) {
    try {
      await Contract.methods
        .OfferAcceptedOrRejected(ownerAccount, tokenId, offer)
        .send({ from: ownerAccount })
        .on('transactionHash', hash => {
          dispatch(setAlert('Please wait Transaction is in Proccess', 'dark'));
        })
        .on('receipt', async receipt => {
          const res = await axios.get(
            `/api/property/acceptOffer/${propId}/${offerId}/${offer}`
          );
          dispatch({
            type: ACCEPT_OFFER,
            payload: res.data,
          });
          if (offer) {
            dispatch(setAlert('Offer Accepted', 'success'));
          } else {
            dispatch(setAlert('Offer Rejected', 'success'));
          }
        });
    } catch (error) {
      console.log('tx error:', error);

      dispatch(setAlert(error.message, 'danger'));
    }
  } else {
    dispatch(setAlert('YOU ARE NOT THE OWNER OF THE PROPERTY !', 'danger'));
  }
};

//check your Offer

export const checkOffer = tokenId => async dispatch => {
  const web3 = window.web3;
  const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
  const ownerAccount = await Contract.methods.ownerOf(tokenId).call();
  const account = await web3.eth.getAccounts();
  if (Account !== ownerAccount.toString()) {
    const offer = await Contract.methods
      ._CheckYourOfferisAccepted(account[0], tokenId)
      .call();
    console.log(offer);
    if (offer) {
      dispatch(setAlert('Congratulations your offer is Accepted', 'success'));
    } else {
      dispatch(
        setAlert(
          'Sorry your Offer is Rejected or it is still pending',
          'danger'
        )
      );
    }
  } else {
    dispatch(setAlert('YOU ARE NOT THE OWNER OF THE PROPERTY !', 'danger'));
  }
};

//Sell property

export const BuyProperty = (
  propId,
  tokenId,
  offer,
  history
) => async dispatch => {
  const web3 = window.web3;
  const Contract = new web3.eth.Contract(Contract_ABI, Contract_ADDRESS);
  const account = await web3.eth.getAccounts();
  const ownerAccount = await Contract.methods.ownerOf(tokenId).call();
  const value = web3.utils.toWei(offer.offerValue.toString(), 'Ether');
  console.log(value);
  if (Account !== ownerAccount.toString()) {
    try {
      const result = await Contract.methods
        .BuyProperty(account[0], tokenId)
        .send({
          from: account[0],
          value: value,
        })
        .on('transactionHash', hash => {
          dispatch(setAlert('Please wait Transaction is in Proccess', 'dark'));
        })
        .on('receipt', async receipt => {
          console.log(receipt);
          const res = await axios.get(`/api/property/sell/${propId}`);
          dispatch({
            type: SELL_PROPERTY,
            payload: res.data,
          });
          dispatch({
            type: SET_OFFER,
            payload: res.data.offers,
          });
          dispatch(setAlert('Congrats You are the Owner !', 'success'));

          history.push('/propertyList');
        });
      console.log(result);
    } catch (error) {
      if (error.code === 4001) {
        console.log('Tx ERROR', error.message);
        dispatch(setAlert(error.message, 'danger'));
      } else if (error.code !== 4001) {
        console.log('Tx ERROR', error.message);
        dispatch(setAlert(error.message, 'danger'));
      } else if (error.response.status === 400) {
        dispatch({
          type: PROPERTY_ERRORS,
          payload: {
            msg: error.response.statusText,
            status: error.response.status,
          },
        });
      }
    }
  } else {
    dispatch(setAlert('YOU ARE THE OWNER OF THE PROPERTY !', 'danger'));
  }
};
