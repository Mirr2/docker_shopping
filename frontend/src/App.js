import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import VulnerabilityTest from './pages/VulnerabilityTest';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at 20% 80%, rgba(0,255,0,0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(0,255,255,0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 40% 40%, rgba(255,0,255,0.1) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite alternate;
    z-index: -1;
  }
  
  @keyframes pulse {
    0% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
`;

const MainContent = styled.main`
  min-height: calc(100vh - 80px);
  padding-top: 80px;
`;

const GlobalStyle = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  input, textarea {
    outline: none;
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // 쿠키에서 사용자 정보 가져오기
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='));
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
      }
    }
    
    // 로컬 스토리지에서 장바구니 정보 가져오기
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('장바구니 정보 파싱 오류:', error);
      }
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header 
          user={user} 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={logout}
        />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={
              <Cart 
                cart={cart}
                updateQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            } />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/vulnerability-test" element={<VulnerabilityTest />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
