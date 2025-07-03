import React from 'react';
import styled from 'styled-components';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const ItemPrice = styled.p`
  color: #00ff00;
  font-weight: 600;
  font-size: 1.1rem;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 0, 0.3);
    border-color: #00ff00;
  }
`;

const QuantityDisplay = styled.span`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: rgba(255, 0, 64, 0.2);
  color: #ff0040;
  border: 1px solid rgba(255, 0, 64, 0.3);
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 64, 0.3);
    border-color: #ff0040;
  }
`;

const CartSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  color: #00ff00;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #ffffff;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.3rem;
  font-weight: 600;
  color: #00ff00;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  border: none;
  padding: 15px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #00ccff, #00ff00);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3);
  }
  
  &:disabled {
    background: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  background: transparent;
  color: #ff0040;
  border: 1px solid rgba(255, 0, 64, 0.3);
  padding: 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 64, 0.1);
    border-color: #ff0040;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #cccccc;
`;

const EmptyCartTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const EmptyCartText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const ShopButton = styled.button`
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #00ccff, #00ff00);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3);
  }
`;

const Cart = ({ cart, updateQuantity, removeFromCart, clearCart }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    alert('결제 기능은 교육용 사이트에서 제공되지 않습니다.');
  };

  const handleClearCart = () => {
    if (window.confirm('장바구니를 비우시겠습니까?')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <CartContainer>
        <PageTitle>🛒 장바구니</PageTitle>
        <EmptyCart>
          <EmptyCartTitle>장바구니가 비어있습니다</EmptyCartTitle>
          <EmptyCartText>
            해커 굿즈를 둘러보고 원하는 상품을 장바구니에 담아보세요!
          </EmptyCartText>
          <ShopButton onClick={() => window.location.href = '/products'}>
            쇼핑하러 가기
          </ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <PageTitle>🛒 장바구니</PageTitle>
      
      <CartContent>
        <CartItems>
          {cart.map(item => (
            <CartItem key={item.id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>{formatPrice(item.price)}원</ItemPrice>
              </ItemInfo>
              <ItemControls>
                <QuantityControls>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
                <RemoveButton onClick={() => removeFromCart(item.id)}>
                  삭제
                </RemoveButton>
              </ItemControls>
            </CartItem>
          ))}
        </CartItems>
        
        <CartSummary>
          <SummaryTitle>주문 요약</SummaryTitle>
          
          {cart.map(item => (
            <SummaryRow key={item.id}>
              <span>{item.name} x {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}원</span>
            </SummaryRow>
          ))}
          
          <SummaryTotal>
            <span>총 결제금액</span>
            <span>{formatPrice(calculateTotal())}원</span>
          </SummaryTotal>
          
          <CheckoutButton onClick={handleCheckout}>
            결제하기
          </CheckoutButton>
          
          <ClearCartButton onClick={handleClearCart}>
            장바구니 비우기
          </ClearCartButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
