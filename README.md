This is an implementation of the following Airwallex Embedded Elements:

- Card (https://github.com/airwallex/airwallex-payment-demo/blob/master/docs/card.md)
- Full Featured Card (https://github.com/airwallex/airwallex-payment-demo/blob/master/docs/fullfeaturedcard.md)

https://www.airwallex.com/docs/payments__embedded-elements__card-element



Steps for the implementation:

1. from the NavBar.js page call the backend and send amount, currency 
2. get back the resposne and exctract `client_secret` and `id`
3. create CheckoutContext (useContext) so you can pass the `client_secret` adn `intent_id` to other components
4. In Navabr navigate the user to the Payment page
5. in the payment page:
    a. loadAirwallex
    b. createElement('card')
    c. mount the elemnt 
    d. then the customer clicks Pay ==> confirmPaymentIntent


How to run it:
1. Open a terminal on home directory and `npm start` (this will start the backend)
(Make sure you have created a new access token and update the .env file)
2. Open a second terminal inside store and `npm start` (this will run the front end)

If you want to implement the Full Card Element then in the App.js:
- comment this //import PaymentPage from './components/PaymentPage';
- uncommnet this: //import PaymentPage from './components/PaymentPageFullCardElement';

Make similar changes if you want to add the Apple Pay button 
(details here: https://www.airwallex.com/docs/payments__global__apple-pay__embedded-elements)
For Apple Pay makes sure you open the localhost in safari