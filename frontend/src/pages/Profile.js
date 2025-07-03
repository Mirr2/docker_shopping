import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const InfoTitle = styled.h3`
  color: #00ff00;
  font-size: 1.3rem;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoLabel = styled.span`
  color: #cccccc;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #ffffff;
`;

const XSSDemo = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const XSSTitle = styled.h3`
  color: #ffaa00;
  font-size: 1.3rem;
  margin-bottom: 15px;
`;

const XSSForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const XSSInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 16px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const XSSButton = styled.button`
  background: rgba(255, 165, 0, 0.3);
  color: #ffaa00;
  border: 1px solid rgba(255, 165, 0, 0.5);
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 165, 0, 0.4);
    border-color: #ffaa00;
  }
`;

const XSSResult = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 8px;
  color: #ffffff;
  
  iframe {
    width: 100%;
    height: 200px;
    border: none;
    border-radius: 5px;
    background: white;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const LoginPromptTitle = styled.h2`
  color: #00ff00;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const LoginPromptText = styled.p`
  color: #cccccc;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const LoginButton = styled.button`
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

const Profile = ({ user }) => {
  const [xssInput, setXssInput] = useState('');
  const [xssResult, setXssResult] = useState('');

  const handleXSSTest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get(`/api/profile?name=${encodeURIComponent(xssInput)}`);
      setXssResult(response.data);
    } catch (error) {
      setXssResult(`오류: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <ProfileContainer>
        <LoginPrompt>
          <LoginPromptTitle>로그인이 필요합니다</LoginPromptTitle>
          <LoginPromptText>
            프로필을 보려면 먼저 로그인해주세요.
          </LoginPromptText>
          <LoginButton onClick={handleLogin}>
            로그인하기
          </LoginButton>
        </LoginPrompt>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileTitle>👤 사용자 프로필</ProfileTitle>
      
      <ProfileInfo>
        <InfoSection>
          <InfoTitle>계정 정보</InfoTitle>
          <InfoItem>
            <InfoLabel>사용자명:</InfoLabel>
            <InfoValue>{user.username}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이메일:</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>권한:</InfoLabel>
            <InfoValue>{user.role === 'admin' ? '관리자' : '일반사용자'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>가입일:</InfoLabel>
            <InfoValue>{new Date(user.created_at).toLocaleDateString('ko-KR')}</InfoValue>
          </InfoItem>
        </InfoSection>
        
        <InfoSection>
          <InfoTitle>보안 정보</InfoTitle>
          <InfoItem>
            <InfoLabel>사용자 ID:</InfoLabel>
            <InfoValue>{user.id}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>세션 상태:</InfoLabel>
            <InfoValue>활성</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>마지막 로그인:</InfoLabel>
            <InfoValue>{new Date().toLocaleDateString('ko-KR')}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>보안 레벨:</InfoLabel>
            <InfoValue>{user.role === 'admin' ? '높음' : '보통'}</InfoValue>
          </InfoItem>
        </InfoSection>
      </ProfileInfo>

      <XSSDemo>
        <XSSTitle>🔓 XSS 취약점 테스트</XSSTitle>
        <p style={{ color: '#cccccc', marginBottom: '20px' }}>
          프로필 페이지에서 XSS 취약점을 테스트해보세요. 
          사용자 입력이 HTML에 직접 삽입되는 취약점입니다.
        </p>
        
        <XSSForm onSubmit={handleXSSTest}>
          <XSSInput
            type="text"
            value={xssInput}
            onChange={(e) => setXssInput(e.target.value)}
            placeholder="이름을 입력하세요 (예: <script>alert('XSS')</script>)"
          />
          <XSSButton type="submit">
            XSS 테스트 실행
          </XSSButton>
        </XSSForm>
        
        {xssResult && (
          <XSSResult>
            <h4 style={{ color: '#ffaa00', marginBottom: '10px' }}>서버 응답:</h4>
            <iframe 
              srcDoc={xssResult}
              sandbox="allow-scripts"
              title="XSS Test Result"
            />
          </XSSResult>
        )}
      </XSSDemo>
    </ProfileContainer>
  );
};

export default Profile;
