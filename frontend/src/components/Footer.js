import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 255, 0, 0.3);
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  width: 100%;
`;

const FooterText = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const WarningText = styled(FooterText)`
  color: #ffc107; /* Amber color for warning */
  font-size: 12px;
  margin-top: 10px;
`;

const CreatorName = styled.span`
  color: #00ff00;
  font-weight: bold;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>
        Made by <CreatorName>mirr</CreatorName>
      </FooterText>
      <WarningText>
        이 사이트에서 얻은 지식을 악의적인 목적으로 사용하는 것을 금지합니다. 모든 책임은 사용자에게 있습니다.
      </WarningText>
    </FooterContainer>
  );
};

export default Footer;
