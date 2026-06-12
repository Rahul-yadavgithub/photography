import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load from local storage initially
    try {
      const saved = localStorage.getItem('store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from local storage', error);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Save to local storage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('store_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to local storage', error);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === product._id && JSON.stringify(item.options) === JSON.stringify(options));
      
      if (existingItemIndex >= 0) {
        // Increment quantity if exact same product and options
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          qty: newItems[existingItemIndex].qty + quantity,
          price: product.salePrice || product.basePrice,
          advancePercentage: product.advancePercentage || 0,
          name: product.name,
          image: product.coverImage
        };
        return newItems;
      }

      // Add new item
      return [...prev, {
        id: product._id,
        name: product.name,
        price: product.salePrice || product.basePrice,
        advancePercentage: product.advancePercentage || 0,
        image: product.coverImage,
        qty: quantity,
        options
      }];
    });
    
    // Auto-open drawer when adding items
    setIsDrawerOpen(true);
  };

  const removeFromCart = (id, options = {}) => {
    setItems(prev => prev.filter(item => !(item.id === id && JSON.stringify(item.options) === JSON.stringify(options))));
  };

  const updateQuantity = (id, options, newQty) => {
    if (newQty < 1) return;
    setItems(prev => prev.map(item => {
      if (item.id === id && JSON.stringify(item.options) === JSON.stringify(options)) {
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const getCartAdvanceTotal = () => {
    return items.reduce((total, item) => total + ((item.price * item.qty * (item.advancePercentage || 0)) / 100), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartAdvanceTotal,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
