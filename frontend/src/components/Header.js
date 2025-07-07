import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  height: 80px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap; /* 줄바꿈 방지 */

  &:hover {
    color: #00ff00;
    background-color: rgba(0, 255, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 25px;
  padding: 10px 20px;
  color: #ffffff;
  width: 300px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #00ff00;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CartIcon = styled(Link)`
  position: relative;
  color: #ffffff;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00ff00;
    transform: scale(1.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff0040;
  color: #ffffff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00ff00;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: rgba(255, 0, 64, 0.2);
  color: #ff0040;
  border: 1px solid rgba(255, 0, 64, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 64, 0.3);
    border-color: #ff0040;
    transform: translateY(-1px);
  }
`;

const Header = ({ user, cartCount, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">🏴‍☠️ HACKER SHOP</Logo>
        
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="해커 굿즈 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </SearchContainer>
        
        <Nav>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/products">상품</NavLink>
          <NavLink to="/vulnerability-test">보안 테스트</NavLink>
          
          {user && user.role === 'admin' && (
            <NavLink to="/admin">관리자</NavLink>
          )}
          
          <CartIcon to="/cart">
            🛒
            {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
          </CartIcon>
          
          <UserSection>
            {user ? (
              <>
                <UserInfo>
                  <span>👤 {user.username}</span>
                  <NavLink to="/profile">프로필</NavLink>
                </UserInfo>
                <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
              </>
            ) : (
              <>
                <NavLink to="/login">로그인</NavLink>
                <NavLink to="/register">회원가입</NavLink>
              </>
            )}
          </UserSection>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
