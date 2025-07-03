import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ProductImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const ProductInfoSection = styled.div`
  padding: 20px 0;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const ProductPrice = styled.p`
  font-size: 2rem;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ProductCategory = styled.span`
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  display: inline-block;
`;

const ProductDescription = styled.p`
  color: #cccccc;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const ProductStock = styled.p`
  color: ${props => props.stock > 10 ? '#00ff00' : props.stock > 0 ? '#ffaa00' : '#ff0040'};
  font-size: 1.1rem;
  margin-bottom: 30px;
  font-weight: 500;
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const QuantityLabel = styled.label`
  color: #ffffff;
  font-weight: 500;
`;

const QuantityInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 16px;
  width: 80px;
  text-align: center;
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const AddToCartButton = styled.button`
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
  
  &:disabled {
    background: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #00ff00;
  border: 2px solid #00ff00;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const OrderSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  margin-bottom: 40px;
`;

const OrderTitle = styled.h3`
  color: #00ff00;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const OrderForm = styled.form`
  display: grid;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: 500;
`;

const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 16px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const OrderButton = styled.button`
  background: linear-gradient(45deg, #ff0040, #ff6600);
  color: #ffffff;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff6600, #ff0040);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 0, 64, 0.3);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #cccccc;
  font-size: 1.2rem;
  margin: 60px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff0040;
  font-size: 1.2rem;
  margin: 60px 0;
`;

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('상품 정보 가져오기 실패:', error);
      setError('상품 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다!`);
    }
  };

  const handleOrderInfoChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleDirectOrder = async (e) => {
    e.preventDefault();
    
    if (!orderInfo.name || !orderInfo.email || !orderInfo.phone || !orderInfo.address) {
      alert('모든 주문 정보를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/order', {
        productId: product.id,
        quantity: quantity,
        userInfo: orderInfo
      });

      if (response.data.success) {
        alert('주문이 완료되었습니다!');
        // 재고 업데이트를 위해 상품 정보 새로고침
        fetchProduct();
        setOrderInfo({ name: '', email: '', phone: '', address: '' });
        setQuantity(1);
      }
    } catch (error) {
      console.error('주문 처리 실패:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingMessage>상품 정보를 불러오는 중...</LoadingMessage>
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>{error || '상품을 찾을 수 없습니다.'}</ErrorMessage>
        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => navigate('/products')}>
            상품 목록으로 돌아가기
          </BackButton>
        </div>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductDetailGrid>
        <ProductImageSection>
          <ProductImage src={product.image} alt={product.name} />
        </ProductImageSection>
        
        <ProductInfoSection>
          <ProductName>{product.name}</ProductName>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductPrice>{formatPrice(product.price)}원</ProductPrice>
          <ProductStock stock={product.stock}>
            재고: {product.stock}개
          </ProductStock>
          <ProductDescription>{product.description}</ProductDescription>
          
          <QuantitySection>
            <QuantityLabel>수량:</QuantityLabel>
            <QuantityInput
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </QuantitySection>
          
          <ActionsSection>
            <AddToCartButton
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? '품절' : '장바구니 담기'}
            </AddToCartButton>
            <BackButton onClick={() => navigate('/products')}>
              목록으로
            </BackButton>
          </ActionsSection>
        </ProductInfoSection>
      </ProductDetailGrid>

      <OrderSection>
        <OrderTitle>바로 주문하기</OrderTitle>
        <OrderForm onSubmit={handleDirectOrder}>
          <FormRow>
            <FormField>
              <FormLabel>이름</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={orderInfo.name}
                onChange={handleOrderInfoChange}
                placeholder="이름을 입력하세요"
                required
              />
            </FormField>
            <FormField>
              <FormLabel>이메일</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={orderInfo.email}
                onChange={handleOrderInfoChange}
                placeholder="이메일을 입력하세요"
                required
              />
            </FormField>
          </FormRow>
          
          <FormRow>
            <FormField>
              <FormLabel>전화번호</FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={orderInfo.phone}
                onChange={handleOrderInfoChange}
                placeholder="전화번호를 입력하세요"
                required
              />
            </FormField>
            <FormField>
              <FormLabel>주소</FormLabel>
              <FormInput
                type="text"
                name="address"
                value={orderInfo.address}
                onChange={handleOrderInfoChange}
                placeholder="주소를 입력하세요"
                required
              />
            </FormField>
          </FormRow>
          
          <OrderButton type="submit" disabled={product.stock === 0}>
            총 {formatPrice(product.price * quantity)}원 주문하기
          </OrderButton>
        </OrderForm>
      </OrderSection>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
