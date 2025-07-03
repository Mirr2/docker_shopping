import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 60px auto;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const LoginTitle = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: #ffffff;
  margin-bottom: 8px;
  font-weight: 500;
`;

const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: #ffffff;
  font-size: 16px;
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

const LoginButton = styled.button`
  background: linear-gradient(45deg, #00ff00, #00ccff);
  color: #000000;
  border: none;
  padding: 15px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 20px;
  
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

const LoginFooter = styled.div`
  text-align: center;
  margin-top: 30px;
  color: #cccccc;
`;

const SignupLink = styled(Link)`
  color: #00ff00;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid rgba(255, 0, 64, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: #ff0040;
  text-align: center;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: #00ff00;
  text-align: center;
  margin-bottom: 20px;
`;

const SecurityTip = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  color: #ffaa00;
`;

const TipTitle = styled.h4`
  color: #ffaa00;
  margin-bottom: 10px;
`;

const TipText = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const ExampleCredentials = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const ExampleTitle = styled.h4`
  color: #00ff00;
  margin-bottom: 10px;
`;

const ExampleList = styled.ul`
  color: #cccccc;
  font-size: 0.9rem;
  margin-left: 20px;
`;

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/login', credentials);
      
      if (response.data.success) {
        setUser(response.data.user);
        setSuccess('로그인 성공!');
        
        // SQL Injection 성공 메시지 처리
        if (response.data.message === 'SQL Injection 성공!') {
          setSuccess('SQL Injection 테스트 성공! 관리자 권한으로 로그인되었습니다.');
        }
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error.response?.data?.error || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>🔐 로그인</LoginTitle>
        
        <SecurityTip>
          <TipTitle>💡 보안 테스트 힌트</TipTitle>
          <TipText>
            SQL Injection 테스트를 해보세요:<br/>
            사용자명: admin' OR '1'='1<br/>
            비밀번호: 아무거나 입력
          </TipText>
          <TipText>
            이 사이트는 교육용으로 의도적으로 보안 취약점이 포함되어 있습니다.
          </TipText>
        </SecurityTip>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <LoginForm onSubmit={handleSubmit}>
          <FormField>
            <FormLabel>사용자명</FormLabel>
            <FormInput
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="사용자명을 입력하세요"
              required
            />
          </FormField>
          
          <FormField>
            <FormLabel>비밀번호</FormLabel>
            <FormInput
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </FormField>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </LoginForm>
        
        <ExampleCredentials>
          <ExampleTitle>테스트 계정</ExampleTitle>
          <ExampleList>
            <li>관리자: admin / admin123</li>
            <li>사용자: hacker1 / password123</li>
            <li>테스트: testuser / test123</li>
          </ExampleList>
        </ExampleCredentials>
        
        <LoginFooter>
          아직 계정이 없으신가요? <SignupLink to="/register">회원가입</SignupLink>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
