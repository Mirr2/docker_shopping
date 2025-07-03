import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

const Hero = styled.section`
  text-align: center;
  padding: 80px 0;
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 255, 0.1));
  border-radius: 20px;
  margin-bottom: 60px;
  border: 1px solid rgba(0, 255, 0, 0.3);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite alternate;
  
  @keyframes glow {
    from { text-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
    to { text-shadow: 0 0 30px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.3); }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #cccccc;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    background: transparent;
    color: #00ff00;
    border-color: #00ff00;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3);
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #00ff00;
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 255, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.3));
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #00ff00;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

const ProductsPreview = styled.section`
  margin-bottom: 60px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: #00ff00;
    box-shadow: 0 20px 40px rgba(0, 255, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductName = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  color: #00ff00;
  font-weight: 600;
  font-size: 1.2rem;
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 40px;
  background: transparent;
  color: #00ff00;
  border: 2px solid #00ff00;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    background: #00ff00;
    color: #000000;
    transform: translateY(-2px);
  }
`;

const SecurityWarning = styled.div`
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid rgba(255, 0, 64, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const WarningTitle = styled.h3`
  color: #ff0040;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const WarningText = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('상품 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>🏴‍☠️ HACKER SHOP</HeroTitle>
        <HeroSubtitle>
          진짜 해커들이 사용하는 최고의 굿즈들을 만나보세요.<br/>
          보안 교육을 위한 특별한 쇼핑몰입니다.
        </HeroSubtitle>
        <CTAButton to="/products">상품 둘러보기</CTAButton>
      </Hero>

      <SecurityWarning>
        <WarningTitle>⚠️ 보안 교육 목적 사이트</WarningTitle>
        <WarningText>
          이 사이트는 보안 취약점 학습을 위한 교육용 사이트입니다.<br/>
          실제 결제는 이루어지지 않으며, 의도적으로 보안 취약점이 포함되어 있습니다.
        </WarningText>
      </SecurityWarning>

      <FeaturesSection>
        <SectionTitle>특별한 기능들</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>보안 테스트</FeatureTitle>
            <FeatureDescription>
              다양한 보안 취약점을 실습할 수 있는 환경을 제공합니다.
              XSS, SQL Injection, Command Injection 등을 테스트해보세요.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🛒</FeatureIcon>
            <FeatureTitle>리얼 쇼핑 경험</FeatureTitle>
            <FeatureDescription>
              실제 쇼핑몰과 동일한 사용자 경험을 제공합니다.
              장바구니, 주문, 결제 과정을 모두 체험할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Race Condition</FeatureTitle>
            <FeatureDescription>
              동시성 문제를 테스트할 수 있는 환경을 제공합니다.
              재고 관리 시스템의 경쟁 조건을 실습해보세요.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎭</FeatureIcon>
            <FeatureTitle>해커 굿즈</FeatureTitle>
            <FeatureDescription>
              실제 해커들이 좋아할 만한 다양한 굿즈들을 판매합니다.
              후드티, 키보드, 스티커 등 다양한 아이템들이 준비되어 있습니다.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ProductsPreview>
        <SectionTitle>인기 상품</SectionTitle>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#cccccc' }}>
            상품을 불러오는 중...
          </div>
        ) : (
          <>
            <ProductsGrid>
              {featuredProducts.map(product => (
                <ProductCard key={product.id}>
                  <ProductImage src={product.image} alt={product.name} />
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{formatPrice(product.price)}원</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductsGrid>
            <ViewAllButton to="/products">모든 상품 보기</ViewAllButton>
          </>
        )}
      </ProductsPreview>
    </HomeContainer>
  );
};

export default Home;
