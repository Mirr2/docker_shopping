import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 60px auto;
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const RegisterTitle = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const RegisterForm = styled.form`
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

const RegisterButton = styled.button`
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

const RegisterFooter = styled.div`
  text-align: center;
  margin-top: 30px;
  color: #cccccc;
`;

const LoginLink = styled(Link)`
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

const SecurityWarning = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  color: #ffaa00;
`;

const WarningTitle = styled.h4`
  color: #ffaa00;
  margin-bottom: 10px;
`;

const WarningText = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.success) {
        setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>📝 회원가입</RegisterTitle>
        
        <SecurityWarning>
          <WarningTitle>⚠️ 보안 경고</WarningTitle>
          <WarningText>
            이 사이트는 교육용으로 실제 개인정보를 입력하지 마세요.
            테스트용 데이터만 사용하시기 바랍니다.
          </WarningText>
        </SecurityWarning>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormField>
            <FormLabel>사용자명</FormLabel>
            <FormInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="사용자명을 입력하세요"
              required
            />
          </FormField>
          
          <FormField>
            <FormLabel>이메일</FormLabel>
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </FormField>
          
          <FormField>
            <FormLabel>비밀번호</FormLabel>
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              required
            />
          </FormField>
          
          <FormField>
            <FormLabel>비밀번호 확인</FormLabel>
            <FormInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </FormField>
          
          <RegisterButton type="submit" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입'}
          </RegisterButton>
        </RegisterForm>
        
        <RegisterFooter>
          이미 계정이 있으신가요? <LoginLink to="/login">로그인</LoginLink>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
