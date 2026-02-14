import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './auth';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const existingCartItem = localStorage.getItem("cart");
        return existingCartItem ? JSON.parse(existingCartItem) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [auth] = useAuth();

    // Fetch cart from DB when user logs in
    useEffect(() => {
        if (auth?.token) {
            axios.get('/api/auth/profile/cart')
                .then(res => {
                    if (res.data?.cart) {
                        setCartItems(res.data.cart);
                        try {
                            localStorage.setItem("cart", JSON.stringify(res.data.cart));
                        } catch (e) {
                            console.error("LS Error", e);
                        }
                    }
                })
                .catch(err => console.log("Error fetching cart", err));
        }
    }, [auth?.token]);

    // Sync cart to local storage and DB on change
    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error saving cart to localStorage", error);
            // Optionally clear cart or alert user if quota exceeded
        }

        // Sync with DB if logged in
        if (auth?.token) {
            const updateCartCheck = async () => {
                try {
                    // Debouncing could be good here, but for simplicity:
                    await axios.put('/api/auth/profile/cart', { cart: cartItems });
                } catch (error) {
                    console.log("Error syncing cart", error);
                }
            }
            // We can use a timeout to debounce
            const timeoutId = setTimeout(() => {
                updateCartCheck();
            }, 500); // 500ms debounce

            return () => clearTimeout(timeoutId);
        }
    }, [cartItems, auth?.token]);

    const addToCart = (item) => {
        setCartItems(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems, // Added setCartItems
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
