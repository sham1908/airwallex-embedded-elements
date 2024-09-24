import React, { useEffect, useState } from 'react';
import { createElement, loadAirwallex, confirmPaymentIntent, getElement } from 'airwallex-payment-elements';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CheckoutContext } from './CheckoutContext';
import { CartContext } from "../CartContext";

/*
This is for adding Apple Pay to Embedded
Details:
https://www.airwallex.com/docs/payments__global__apple-pay__embedded-elements


*/

const PaymentPage = () => {
  const [elementShow, setElementShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrorMessage, setInputErrorMessage] = useState('');
  const location = useLocation();
  const { checkoutData } = useContext(CheckoutContext);
  const cart = useContext(CartContext);
    

  useEffect(() => {
    const { clientSecret, intentId } = checkoutData;
    if (!clientSecret || !intentId) {
      console.error('Missing intent_id or client_secret');
      setErrorMessage('Payment initialization failed. Please try again.');
      return;
    }

    loadAirwallex({
      env: 'demo',
      origin: window.location.origin,
    }).then(() => {
      const card = createElement('applePayButton', {

        // Required, Apple Pay uses intent Id and client_secret to prepare checkout
        intent_id: intentId,
        client_secret: clientSecret,
        amount: {
            value: cart.getTotalCost,
            currency: 'USD',
        },
        //requiredBillingContactFields: ["postalAddress"], // optional field
        //requiredShippingContactFields: ["email", "name", "phoneticName", "phone"], // optional field
        totalPriceLabel: 'COMPANY, INC.', // Provide a business name for the label field.
        buttonType: 'buy', // Indicate the type of button you want displayed on your payments form. Like 'buy'
        buttonColor: 'white-with-line', // Indicate the color of the button. Default value is 'black' 
        origin: window.location.origin,
        countryCode: 'replace-with-your-country-code', // merchant country code
    
    });
      card.mount('applePayButton');
      console.log('Airwallex card element mounted');
    }).catch((error) => {
      console.error('Error initializing Airwallex:', error);
      setErrorMessage('Error initializing payment. Please try again.');
    });

    const onReady = (event) => {
      setElementShow(true);
      getElement('applePayButton').focus();
      console.log(`The Card element is ready, ${JSON.stringify(event.detail)}`);
    };

    const onError = (event) => {
      const { error } = event.detail;
      setIsSubmitting(false);
      setErrorMessage(error.message);
      console.error('There was an error', error);
    };

    const onSuccess = (event) => {
      console.log('Payment successful', event.detail);
      // Handle successful payment event, like updating UI or redirecting
    };

    const onFocus = (_event) => {
      setInputErrorMessage('');
    };

    const onBlur = (event) => {
      const { error } = event.detail;
      setInputErrorMessage(error?.message ?? JSON.stringify(error));
    };

    const domElement = document.getElementById('applePayButton');
    if (domElement) {
      domElement.addEventListener('onReady', onReady);
      domElement.addEventListener('onError', onError);
      domElement.addEventListener('onBlur', onBlur);
      domElement.addEventListener('onFocus', onFocus);
      domElement.addEventListener('onSuccess', onSuccess);
    } else {
      console.error('Card container not found');
      setErrorMessage('Error loading payment form. Please try again.');
    }

    return () => {
      if (domElement) {
        domElement.removeEventListener('onReady', onReady);
        domElement.removeEventListener('onError', onError);
        domElement.removeEventListener('onFocus', onFocus);
        domElement.removeEventListener('onBlur', onBlur);
        domElement.removeEventListener('onSuccess', onSuccess);
      }
    };
  }, [checkoutData]);

  const onTriggerConfirm = () => {
    const { clientSecret, intentId } = checkoutData;
    setIsSubmitting(true);
    setErrorMessage('');
    const card = getElement('applePayButton');
    confirmPaymentIntent({
      element: card,
      intent_id: intentId,
      client_secret: clientSecret,
    })
      .then((response) => {
        setIsSubmitting(false);
        window.alert(`Payment Intent confirmation was successful: ${JSON.stringify(response)}`);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setErrorMessage(error.message ?? JSON.stringify(error));
        console.error('There was an error', error);
      });
  };

  const inputStyle = {
    border: '1px solid',
    borderRadius: '5px',
    padding: '5px 10px',
    marginTop: '8px',
    height: '28px',
  };

  return (
    <div>
      <h2>Apple Pay</h2>
      {!elementShow && <p>Loading...</p>}
      {errorMessage.length > 0 && <p id="error">{errorMessage}</p>}
      <div
        className="field-container"
        style={{ display: elementShow ? 'block' : 'none' }}
      >
        <div
          id="applePayButton"
          style={inputStyle}
        />
        <p style={{ color: 'red' }}>{inputErrorMessage}</p>
        <button
          onClick={onTriggerConfirm}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;


