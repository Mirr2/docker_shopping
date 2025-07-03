import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
`;

const AdminCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const CardTitle = styled.h2`
  color: #00ff00;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  background: rgba(0, 255, 0, 0.1);
  color: #00ff00;
  padding: 12px;
  text-align: left;
  border: 1px solid rgba(0, 255, 0, 0.3);
`;

const TableCell = styled.td`
  color: #ffffff;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #cccccc;
  font-size: 1.1rem;
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff0040;
  font-size: 1.1rem;
  margin: 20px 0;
`;

const SecurityWarning = styled.div`
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid rgba(255, 0, 64, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: center;
`;

const WarningTitle = styled.h3`
  color: #ff0040;
  margin-bottom: 10px;
`;

const WarningText = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

const RefreshButton = styled.button`
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background: linear-gradient(45deg, #00ccff, #00ff00);
    transform: translateY(-1px);
  }
`;

const StatsCard = styled.div`
  background: rgba(0, 255, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 255, 0, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #00ff00;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cccccc;
`;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [usersResponse, ordersResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/orders')
      ]);
      
      setUsers(usersResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('관리자 데이터 가져오기 실패:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  const getAdminCount = () => {
    return users.filter(user => user.role === 'admin').length;
  };

  const getRecentOrders = () => {
    return orders.slice(-5).reverse();
  };

  if (loading) {
    return (
      <AdminContainer>
        <AdminTitle>🔧 관리자 패널</AdminTitle>
        <LoadingMessage>관리자 데이터를 불러오는 중...</LoadingMessage>
      </AdminContainer>
    );
  }

  if (error) {
    return (
      <AdminContainer>
        <AdminTitle>🔧 관리자 패널</AdminTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <div style={{ textAlign: 'center' }}>
          <RefreshButton onClick={fetchAdminData}>다시 시도</RefreshButton>
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminTitle>🔧 관리자 패널</AdminTitle>
      
      <SecurityWarning>
        <WarningTitle>⚠️ 보안 취약점 경고</WarningTitle>
        <WarningText>
          이 관리자 페이지는 권한 검증 없이 접근 가능합니다. (권한 우회 취약점)<br/>
          실제 서비스에서는 반드시 적절한 권한 검증이 필요합니다.
        </WarningText>
      </SecurityWarning>

      <StatsCard>
        <CardTitle>📊 통계 정보</CardTitle>
        <StatsGrid>
          <StatItem>
            <StatNumber>{users.length}</StatNumber>
            <StatLabel>총 사용자</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{getAdminCount()}</StatNumber>
            <StatLabel>관리자</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{orders.length}</StatNumber>
            <StatLabel>총 주문</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{formatPrice(getTotalRevenue())}</StatNumber>
            <StatLabel>총 매출 (원)</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <AdminGrid>
        <AdminCard>
          <CardTitle>👥 사용자 관리</CardTitle>
          <RefreshButton onClick={fetchAdminData}>새로고침</RefreshButton>
          <DataTable>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>사용자명</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>권한</TableHeader>
                <TableHeader>가입일</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span style={{ 
                      color: user.role === 'admin' ? '#ff0040' : '#00ff00',
                      fontWeight: 'bold'
                    }}>
                      {user.role === 'admin' ? '관리자' : '일반사용자'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        </AdminCard>

        <AdminCard>
          <CardTitle>📦 주문 관리</CardTitle>
          <RefreshButton onClick={fetchAdminData}>새로고침</RefreshButton>
          <DataTable>
            <thead>
              <tr>
                <TableHeader>주문 ID</TableHeader>
                <TableHeader>상품명</TableHeader>
                <TableHeader>수량</TableHeader>
                <TableHeader>총액</TableHeader>
                <TableHeader>주문일</TableHeader>
              </tr>
            </thead>
            <tbody>
              {getRecentOrders().map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{formatPrice(order.totalPrice)}원</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
          {orders.length > 5 && (
            <p style={{ color: '#cccccc', fontSize: '0.9rem', textAlign: 'center' }}>
              최근 5개 주문만 표시됩니다. (전체 {orders.length}개)
            </p>
          )}
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
};

export default Admin;
