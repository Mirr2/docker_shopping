import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const ProductsContainer = styled.div`
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

const FiltersSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  color: #ffffff;
  font-weight: 500;
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  
  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  width: 250px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
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

const ProductName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
`;

const ProductPrice = styled.p`
  color: #00ff00;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 15px;
`;

const ProductStock = styled.p`
  color: ${props => props.stock > 10 ? '#00ff00' : props.stock > 0 ? '#ffaa00' : '#ff0040'};
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ViewButton = styled(Link)`
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const AddToCartButton = styled.button`
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #00ccff, #00ff00);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #cccccc;
  font-size: 1.2rem;
  margin: 60px 0;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  color: #cccccc;
  font-size: 1.2rem;
  margin: 60px 0;
`;

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('상품 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      alert(`${product.name}이(가) 장바구니에 추가되었습니다!`);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  };

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingMessage>상품을 불러오는 중...</LoadingMessage>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <PageTitle>해커 굿즈</PageTitle>
      
      <FiltersSection>
        <FilterRow>
          <div>
            <FilterLabel>검색:</FilterLabel>
            <SearchInput
              type="text"
              placeholder="상품명이나 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <FilterLabel>카테고리:</FilterLabel>
            <FilterSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">전체</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel>정렬:</FilterLabel>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">이름순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
            </FilterSelect>
          </div>
        </FilterRow>
      </FiltersSection>

      {filteredProducts.length === 0 ? (
        <NoProductsMessage>
          검색 조건에 맞는 상품이 없습니다.
        </NoProductsMessage>
      ) : (
        <ProductsGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>{formatPrice(product.price)}원</ProductPrice>
                <ProductStock stock={product.stock}>
                  재고: {product.stock}개
                </ProductStock>
                <ProductActions>
                  <ViewButton to={`/products/${product.id}`}>상세보기</ViewButton>
                  <AddToCartButton
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? '품절' : '장바구니'}
                  </AddToCartButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </ProductsContainer>
  );
};

export default Products;
