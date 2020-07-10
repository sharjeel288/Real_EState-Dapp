import {
  GET_PROPERTY,
  GET_PROPERTYS,
  PROPERTY_ERRORS,
  UPDATE_PROPERTY,
  CLEAR_PROPERTY,
  SET_OFFER,
  SELL_PROPERTY,
  ACCEPT_OFFER,
} from '../actions/types';

const initialState = {
  property: null,
  propertys: [],
  loading: true,
  error: {},
  offer: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROPERTY:
    case SELL_PROPERTY:
    case UPDATE_PROPERTY:
      return {
        ...state,
        property: payload,
        loading: false,
      };
    case GET_PROPERTYS:
      return {
        ...state,
        propertys: payload,
        loading: false,
      };
    case SET_OFFER:
    case ACCEPT_OFFER:
      return {
        ...state,
        property: { ...state.property, offers: payload },
        loading: false,
      };
    case PROPERTY_ERRORS:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROPERTY:
      return {
        ...state,
        property: null,
        loading: true,
      };

    default:
      return state;
  }
}
