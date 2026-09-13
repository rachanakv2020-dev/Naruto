import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("naruto_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("naruto_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === food.id);
      if (existing) {
        return current.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (foodId, change) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === foodId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setCart((current) => current.filter((item) => item.id !== foodId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const value = useMemo(
    () => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal }),
    [cart, totalItems, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
