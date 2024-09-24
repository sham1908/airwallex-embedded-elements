This is an implementation of [Airwallex Embedded Elements](https://www.airwallex.com/docs/payments__embedded-elements):

- Card (https://github.com/airwallex/airwallex-payment-demo/blob/master/docs/card.md)
- Full Featured Card (https://github.com/airwallex/airwallex-payment-demo/blob/master/docs/fullfeaturedcard.md)

https://www.airwallex.com/docs/payments__embedded-elements__card-element

**How to run the app:**

(It's a React app so we have both client-side and server-side)

1. Update the `.env` with a valid `AIRWALLEX_BEARER_TOKEN`
2. Open a terminal on home directory run `npm install`
3. Still on the home directory run `npm start` (this will start the server)
4. Open a second terminal and navigate to the `store` directory
5. `npm install` and then `npm start` (this will start the client)
6. Add items to the cart clinc on the `Purchase items`
7. User is redirected to to Checkout page

If you want to implement the Full Card Element then in the App.js:
- comment this `import PaymentPage from './components/PaymentPage';`
- uncommnet this: `//import PaymentPage from './components/PaymentPageFullCardElement';`


**Technical details about the implementation:**


1. From the NavBar.js page we call the backend and send amount, currency 
2. We back the resposne and exctract `client_secret` and `id`
3. create CheckoutContext (useContext) so you can pass the `client_secret` adn `intent_id` to other components
4. In Navabr navigate the user to the Payment page
5. in the payment page:
    a. loadAirwallex
    b. createElement('card')
    c. mount the elemnt 
    d. then the customer clicks Pay ==> confirmPaymentIntent




Make similar changes if you want to add the Apple Pay button 
(details here: https://www.airwallex.com/docs/payments__global__apple-pay__embedded-elements)
For Apple Pay makes sure you open the localhost in safari
