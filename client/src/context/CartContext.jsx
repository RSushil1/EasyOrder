import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './auth';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [auth] = useAuth();

    // Load cart from local storage or user data on mount/auth change
    useEffect(() => {
        const existingCartItem = localStorage.getItem("cart");
        if (existingCartItem) {
            setCartItems(JSON.parse(existingCartItem));
        }

        // If user is logged in, fetch fresh cart from DB to ensure sync
        if (auth?.token) {
            axios.get('http://localhost:8000/api/auth/profile/cart')
                .then(res => {
                    if (res.data?.cart) {
                        setCartItems(res.data.cart);
                        localStorage.setItem("cart", JSON.stringify(res.data.cart));
                    }
                })
                .catch(err => console.log("Error fetching cart", err));
        } else if (auth?.user?.cart?.length > 0) {
            // Fallback to auth context if fetch fails or logic determines otherwise, but usually fetch is better
            setCartItems(auth.user.cart);
        }
    }, [auth?.token]);

    // Sync cart to local storage and DB on change
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        } else {
            // If cart is empty, should we remove it? 
            // Maybe not remove key but set to empty array if explicitly cleared?
            // But if initially empty, we don't want to overwrite if not loaded yet?
            // Actually, if cartItems is empty array (initial state), we might not want to wipe LS if LS has data not yet loaded?
            // But the first useEffect loads LS. So safe to setItem.
            // But let's check if it's the *initial* render.
            // simpler: Just setItem.
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

        // Sync with DB if logged in
        if (auth?.token) {
            const updateCartCheck = async () => {
                try {
                    // Debouncing could be good here, but for simplicity:
                    await axios.put('http://localhost:8000/api/auth/profile/cart', { cart: cartItems });
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
