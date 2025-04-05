import React, { useState } from "react";
import "./index.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);
  const remaining = THRESHOLD - subtotal;

  React.useEffect(() => {
    if (subtotal >= THRESHOLD && !cart.some((item) => item.id === FREE_GIFT.id)) {
      setCart((prevCart) => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
    } else if (subtotal < THRESHOLD) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal]);

  return (
    <div className="container">
      <h1 className="main-title">Shopping Cart</h1>

      {/* Products Section */}
      <div className="card full-width">
        <h2 className="products-heading">Products</h2>
        <div className="product-list">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="cart-summary full-width">
        <h2>Cart Summary</h2>
        <div className="subtotal">
          <span>Subtotal:</span>
          <span className="amount">₹{subtotal}</span>
        </div>
         <hr/>
       
          {subtotal >= THRESHOLD ? (
            <p className="progress-text success"> You got a free Wireless Mouse!</p>
          ) : (
            <>
            <div className="progress-card">
              <p className="progress-text">
                Spend ₹{remaining} more to get a free gift!
              </p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              </div>
            </>
          )}
        
      </div>
      {/* Cart Items */}
      
      <div className="cart-items full-width">
        <h2>Cart Items</h2>
        {cart.length === 0 ? (
          <p className="empty-cart"> Your cart is empty</p>
        ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item-card">
            <div className="cart-item">
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className='cart-price'>
                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
              </div>
              {item.id !== FREE_GIFT.id ? (
                <div className="quantity-controls">
                  <button className="minus" onClick={() => updateQuantity(item.id, -1)}>
                    -
                  </button>
                  <span className="count">{item.quantity}</span>
                  <button className="plus" onClick={() => updateQuantity(item.id, 1)}>
                    +
                  </button>
                  
                </div>
              ) : (
                <span className="free-gift">FREE GIFT</span>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </div>
      
  );
};

export default App;
