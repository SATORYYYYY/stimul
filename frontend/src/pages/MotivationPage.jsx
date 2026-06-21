import React from 'react';
import styled from 'styled-components';
import MotivationBook from '../components/MotivationBook';
import { fadeInUp, scaleIn } from '../styles/GlobalStyles';
import { FaBook, FaLightbulb } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
  animation: fadeInUp 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #7FD60E;
  margin-bottom: 1rem;
  animation: fadeInUp 0.5s ease-out;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 0 30px rgba(127, 214, 14, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  animation: fadeInUp 0.5s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const BookWrapper = styled.div`
  animation: scaleIn 0.6s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

export default function MotivationPage() {
  return (
    <PageContainer>
      <Title><FaBook /> Твой стимул</Title>
      <Subtitle>
        <FaLightbulb /> Листай книгу с полезными советами и вдохновением для здорового образа жизни
      </Subtitle>
      <BookWrapper>
        <MotivationBook />
      </BookWrapper>
    </PageContainer>
  );
}