import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propertyItems = ({
  property: { _id, location, image, price, description },
}) => {
  return (
    <article className='card product-item'>
      <header className='card__header'>
        <h1 className='product__title'>{location}</h1>
      </header>
      <div className='card__image'>
        <img src={`${process.env.REACT_APP_URL}${image}`} alt={image} />
      </div>
      <div className='card__content'>
        <h2 className='product__price'>{price}ETH</h2>
        <p className='product__description'>{description}</p>
      </div>
      <div className='card__actions'>
        <Link to={`/detail/${_id}`} className='btn'>
          Details
        </Link>
      </div>
    </article>
  );
};

propertyItems.propTypes = {
  property: PropTypes.object.isRequired,
};

export default propertyItems;
