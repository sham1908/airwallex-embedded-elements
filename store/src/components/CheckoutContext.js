import React, { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [checkoutData, setCheckoutData] = useState({
        clientSecret: '',
        intentId: ''
    });

    return (
        <CheckoutContext.Provider value={{ checkoutData, setCheckoutData }}>
            {children}
        </CheckoutContext.Provider>
    );
};