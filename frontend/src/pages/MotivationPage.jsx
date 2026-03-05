import React from 'react';
import styled from 'styled-components';
import MotivationBook from '../components/MotivationBook';
import { fadeInUp } from '../styles/GlobalStyles';

const PageContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1E3A5F;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #2C6E63;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
`;

const BookWrapper = styled.div`
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

export default function MotivationPage() {
  return (
    <PageContainer>
      <Title>📖 Твой стимул</Title>
      <Subtitle>
        Листай книгу с полезными советами и вдохновением для здорового образа жизни
      </Subtitle>
      <BookWrapper>
        <MotivationBook />
      </BookWrapper>
    </PageContainer>
  );
}