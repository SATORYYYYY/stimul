import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoePrints, FaTint, FaStopwatch, FaFire, FaPlus, FaCheck, FaTimes, FaPlay, FaTrophy, FaBell, FaSmile, FaDumbbell, FaGem } from 'react-icons/fa';
import api from '../services/api';
import { fadeInUp, scaleIn, shimmer } from '../styles/GlobalStyles';

const PageContainer = styled.div`
  padding: 1rem 0;
  animation: fadeInUp 0.6s ease-out;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: #7FD60E;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 0 30px rgba(127, 214, 14, 0.3);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: center;
  }

  svg {
    flex-shrink: 0;
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%);
  color: #191F11;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 40px;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(127, 214, 14, 0.4);
  white-space: nowrap;
  justify-content: center;
  min-width: max-content;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.9rem 1.5rem;
  }

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(127, 214, 14, 0.6);
  }
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.3s both;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const ChallengeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: clamp(1.5rem, 3vw, 2rem);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(127, 214, 14, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: auto;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 320px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(127, 214, 14, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    border-color: rgba(127, 214, 14, 0.4);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
`;

const DifficultyBadge = styled.span`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (max-width: 768px) {
    top: 0.8rem;
    right: 0.8rem;
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }

  ${({ difficulty }) => {
    const colors = {
      easy: 'rgba(76, 175, 80, 0.3)',
      medium: 'rgba(255, 193, 7, 0.3)',
      hard: 'rgba(244, 67, 54, 0.3)',
      extreme: 'rgba(156, 39, 176, 0.3)'
    };
    const textColors = {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#F44336',
      extreme: '#9C27B0'
    };
    return `
      background: ${colors[difficulty]};
      color: ${textColors[difficulty]};
      border: 1px solid ${textColors[difficulty]};
    `;
  }}
`;

const ChallengeIcon = styled.div`
  width: clamp(50px, 8vw, 70px);
  height: clamp(50px, 8vw, 70px);
  border-radius: 50%;
  background: rgba(127, 214, 14, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #7FD60E;
  margin-bottom: 1.2rem;
  border: 2px solid rgba(127, 214, 14, 0.3);
  flex-shrink: 0;

  svg {
    font-size: inherit;
  }
`;

const ChallengeTitle = styled.h3`
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  color: #FFFFFF;
  margin-bottom: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
`;

const ChallengeValue = styled.div`
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  color: #7FD60E;
  margin: 1.2rem 0;
  text-shadow: 0 0 20px rgba(127, 214, 14, 0.3);
  line-height: 1;
  word-break: break-word;
`;

const ChallengeUnit = styled.span`
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  margin-left: 0.3rem;

  @media (max-width: 480px) {
    display: block;
    margin-left: 0;
    margin-top: 0.2rem;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: clamp(10px, 2vw, 14px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: clamp(5px, 1vw, 7px);
  margin: 1.2rem 0;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min(props.value, 100)}%;
  background: linear-gradient(90deg, #7FD60E, #a0e83c);
  border-radius: clamp(5px, 1vw, 7px);
  transition: width 0.6s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const ChallengeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  margin-top: 0.8rem;
  font-weight: 500;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: auto;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: clamp(60px, 15vw, 80px);
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $primary }) => $primary ? '#191F11' : '#FFFFFF'};
  border: 1px solid ${({ $primary }) => $primary ? 'transparent' : 'rgba(127, 214, 14, 0.3)'};
  padding: clamp(0.7rem, 1.5vw, 0.9rem) 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-weight: 600;
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 0.8rem;
    min-width: auto;
  }

  svg {
    font-size: 1em;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #8FE71E 0%, #7FD60E 100%)' : 'rgba(127, 214, 14, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(127, 214, 14, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInUp 0.3s ease-out;
  padding: 1rem;

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const ModalContent = styled.div`
  background: rgba(25, 31, 17, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: clamp(2rem, 5vw, 2.5rem);
  width: 100%;
  max-width: 480px;
  border: 1px solid rgba(127, 214, 14, 0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: scaleIn 0.3s ease-out;

  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  color: #7FD60E;
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 20px rgba(127, 214, 14, 0.3);
  line-height: 1.3;
`;

const DifficultyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.8rem, 2vw, 1.2rem);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);

  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
`;

const DifficultyCard = styled.button`
  background: ${({ selected }) => selected ? 'rgba(127, 214, 14, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${({ selected }) => selected ? '#7FD60E' : 'rgba(127, 214, 14, 0.2)'};
  border-radius: 16px;
  padding: clamp(1.2rem, 3vw, 1.8rem) clamp(1rem, 2vw, 1.5rem);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 0.8rem);
  width: 100%;

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
    gap: 0.5rem;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    border-color: #7FD60E;
  }

  svg {
    font-size: clamp(1.5rem, 4vw, 2rem);
    flex-shrink: 0;
    ${({ difficulty }) => {
      const colors = {
        easy: '#4CAF50',
        medium: '#FFC107',
        hard: '#F44336',
        extreme: '#9C27B0'
      };
      return `color: ${colors[difficulty]};`;
    }}
  }

  div:last-child {
    color: #FFFFFF;
    font-weight: 600;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    line-height: 1.2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: clamp(3rem, 8vw, 5rem) clamp(2rem, 5vw, 3rem);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 2px dashed rgba(127, 214, 14, 0.3);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
    border-radius: 20px;
  }

  svg {
    font-size: clamp(3rem, 8vw, 5rem);
    color: rgba(127, 214, 14, 0.3);
    margin-bottom: clamp(1.5rem, 3vw, 2rem);
  }

  h3 {
    color: rgba(255, 255, 255, 0.8);
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    line-height: 1.6;
    margin-bottom: clamp(1.5rem, 3vw, 2rem);
  }
`;

const getIcon = (type) => {
  const icons = {
    steps: FaShoePrints,
    water: FaTint,
    duration: FaStopwatch,
    calories: FaFire
  };
  return icons[type] || FaTrophy;
};

const getDifficultyIcon = (difficulty) => {
  const icons = {
    easy: FaSmile,
    medium: FaDumbbell,
    hard: FaFire,
    extreme: FaGem
  };
  return icons[difficulty] || FaTrophy;
};

const getUnitForType = (type) => {
  const units = {
    steps: 'шагов',
    water: 'стаканов',
    duration: 'минут',
    calories: 'ккал'
  };
  return units[type] || '';
};

export default function DailyChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const navigate = useNavigate();

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await api.get('/daily-challenges/today/');
      setChallenges(res.data);
    } catch (err) {
      console.error('Ошибка загрузки заданий:', err);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const generateChallenge = async () => {
    try {
      await api.post('/daily-challenges/generate/');
      fetchChallenges();
      setShowModal(false);
      showNotification('Новое задание создано!', 'success');
    } catch (err) {
      console.error('Ошибка создания задания:', err);
      alert('Ошибка создания задания');
    }
  };

  const updateProgress = async (id, increment = 1) => {
    try {
      await api.post(`/daily-challenges/${id}/progress/`, { increment });
      fetchChallenges();
    } catch (err) {
      console.error('Ошибка обновления прогресса:', err);
    }
  };

  const completeChallenge = async (id) => {
    try {
      await api.post(`/daily-challenges/${id}/complete/`);
      fetchChallenges();
      showNotification('Задание выполнено!', 'success');
    } catch (err) {
      console.error('Ошибка завершения задания:', err);
    }
  };

  const deleteChallenge = async (id) => {
    if (window.confirm('Удалить задание?')) {
      try {
        await api.delete(`/daily-challenges/${id}/`);
        fetchChallenges();
      } catch (err) {
        console.error('Ошибка удаления задания:', err);
      }
    }
  };

  const showNotification = (message, type = 'info') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Health Tracker', { body: message });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title><FaBell /> Ежедневные задания</Title>
          <CreateButton onClick={() => setShowModal(true)}>
            <FaPlus /> Новое задание
          </CreateButton>
        </Header>

        {challenges.length > 0 ? (
          <ChallengesGrid>
            {challenges.map((challenge) => {
              const Icon = getIcon(challenge.challenge_type);
              const unit = getUnitForType(challenge.challenge_type);
              return (
                <ChallengeCard key={challenge.id}>
                  <DifficultyBadge difficulty={challenge.difficulty}>
                    {challenge.difficulty_display}
                  </DifficultyBadge>
                  <ChallengeIcon>
                    <Icon />
                  </ChallengeIcon>
                  <ChallengeTitle>{challenge.challenge_type_display}</ChallengeTitle>
                <ChallengeValue>
                  {challenge.current_value} {unit && `/ ${challenge.target_value} ${unit}`}
                </ChallengeValue>
                  <ProgressContainer>
                    <ProgressFill value={challenge.progress_percentage} />
                  </ProgressContainer>
                  <ChallengeMeta>
                    <span>Прогресс: {Math.round(challenge.progress_percentage)}%</span>
                    {challenge.is_completed && <span><FaTrophy /> Выполнено!</span>}
                  </ChallengeMeta>
                  <ButtonGroup>
                    {!challenge.is_completed ? (
                      <>
                        <ActionButton onClick={() => updateProgress(challenge.id, 1)}>
                          <FaPlay /> +1
                        </ActionButton>
                        <ActionButton onClick={() => updateProgress(challenge.id, 5)}>
                          <FaPlay /> +5
                        </ActionButton>
                        <ActionButton $primary onClick={() => completeChallenge(challenge.id)}>
                          <FaCheck /> Завершить
                        </ActionButton>
                      </>
                    ) : (
                      <ActionButton onClick={() => deleteChallenge(challenge.id)}>
                        <FaTimes /> Удалить
                      </ActionButton>
                    )}
                  </ButtonGroup>
                </ChallengeCard>
              );
            })}
          </ChallengesGrid>
        ) : (
          <EmptyState>
            <FaTrophy />
            <h3>Нет активных заданий</h3>
            <p>Создайте первое ежедневное задание и начните свой путь к успеху!</p>
            <CreateButton onClick={() => setShowModal(true)}>
              <FaPlus /> Создать задание
            </CreateButton>
          </EmptyState>
        )}
      </Container>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Выберите сложность</ModalTitle>
            <DifficultyGrid>
              {['easy', 'medium', 'hard', 'extreme'].map(diff => {
                const DifficultyIcon = getDifficultyIcon(diff);
                return (
                  <DifficultyCard
                    key={diff}
                    selected={selectedDifficulty === diff}
                    difficulty={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    <DifficultyIcon />
                    <div>{diff === 'easy' ? 'Легкая' : diff === 'medium' ? 'Средняя' : diff === 'hard' ? 'Тяжелая' : 'Экстремальная'}</div>
                  </DifficultyCard>
                );
              })}
            </DifficultyGrid>
            <ButtonGroup>
              <ActionButton onClick={() => setShowModal(false)}>Отмена</ActionButton>
              <ActionButton $primary onClick={generateChallenge}>
                Создать
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
}