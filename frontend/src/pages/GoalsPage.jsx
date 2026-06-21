import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import GoalForm from '../components/GoalForm';
import styled from 'styled-components';
import { FaTrash, FaFire, FaCheckCircle, FaPlus, FaShoePrints, FaStopwatch, FaTint, FaBullseye } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fadeInUp, scaleIn, shimmer } from '../styles/GlobalStyles';

const PageContainer = styled.div`
  padding: 1rem 0;
  animation: fadeInUp 0.6s ease-out;
  width: 100%;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: #7FD60E;
  margin-bottom: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 0 30px rgba(127, 214, 14, 0.3);
  flex-wrap: wrap;
  justify-content: center;
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
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(127, 214, 14, 0.4);
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.9rem 1.5rem;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(127, 214, 14, 0.6);
  }
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.3s both;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 1.8rem;
  color: #FFFFFF;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: ${props => props.$completed ? 0.7 : 1};
  border: 1px solid rgba(127, 214, 14, 0.2);
  position: relative;
  overflow: hidden;

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
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const GoalIcon = styled.span`
  font-size: 2rem;
  background: rgba(127, 214, 14, 0.2);
  padding: 0.8rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7FD60E;
`;

const StreakBadge = styled.span`
  background: rgba(127, 214, 14, 0.3);
  color: #7FD60E;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(127, 214, 14, 0.4);
`;

const GoalTitle = styled.h3`
  font-size: 1.3rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  color: #FFFFFF;
  position: relative;
  z-index: 1;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  position: relative;
  z-index: 1;
`;

const ProgressWrapper = styled.div`
  width: 80px;
  height: 80px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  position: relative;
  z-index: 1;
`;

const QuickAddButton = styled.button`
  background: linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%);
  border: none;
  color: #191F11;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(127, 214, 14, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 18px rgba(127, 214, 14, 0.6);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompleteButton = styled.button`
  background: ${props => props.$completed ? 'rgba(127, 214, 14, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$completed ? '#7FD60E' : '#FFFFFF'};
  border: 2px solid ${props => props.$completed ? '#7FD60E' : 'rgba(127, 214, 14, 0.3)'};
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(127, 214, 14, 0.3);
    color: #7FD60E;
    border-color: #7FD60E;
    transform: scale(1.1);
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  padding: 0.5rem;

  &:hover {
    color: #ff6b6b;
    transform: scale(1.1);
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.3rem;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 2px dashed rgba(127, 214, 14, 0.3);
`;

const getIcon = (type) => {
  switch(type) {
    case 'steps': return <FaShoePrints />;
    case 'duration': return <FaStopwatch />;
    case 'calories': return <FaFire />;
    case 'water': return <FaTint />;
    default: return <FaBullseye />;
  }
};

const getIncrement = (type) => {
  switch(type) {
    case 'steps': return 10;
    case 'water': return 1;
    case 'duration': return 5;
    case 'calories': return 50;
    default: return 1;
  }
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await api.get('/goals/');
      setGoals(res.data);
    } catch (err) {
      console.error('Ошибка загрузки целей', err);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Удалить цель?')) {
      await api.delete(`/goals/${id}/`);
      fetchGoals();
    }
  }, [fetchGoals]);

  const handleQuickAdd = useCallback(async (goal) => {
    const increment = getIncrement(goal.goal_type);
    let newValue = goal.current_value + increment;
    if (newValue > goal.target_value) newValue = goal.target_value;
    const updated = { ...goal, current_value: newValue };
    await api.put(`/goals/${goal.id}/`, updated);
    fetchGoals();
  }, [fetchGoals]);

  const handleComplete = useCallback(async (goal) => {
    const updated = { ...goal, is_active: false, current_value: goal.target_value };
    await api.put(`/goals/${goal.id}/`, updated);
    fetchGoals();
  }, [fetchGoals]);

  const handleGoalAdded = () => {
    setShowForm(false);
    fetchGoals();
  };

  return (
    <PageContainer>
      <Title><FaBullseye /> Мои цели</Title>
      <CreateButton onClick={() => setShowForm(true)}>
        <FaPlus /> Создать цель
      </CreateButton>

      {showForm && (
        <GoalForm onGoalAdded={handleGoalAdded} onClose={() => setShowForm(false)} />
      )}

      {goals.length > 0 ? (
        <GoalsGrid>
          {goals.map((goal) => {
            const progressPercent = (goal.current_value / goal.target_value) * 100;
            const streak = goal.streak || 0; 
            const icon = getIcon(goal.goal_type);
            const completed = goal.current_value >= goal.target_value || !goal.is_active;

            return (
              <GoalCard key={goal.id} $completed={completed}>
                <CardHeader>
                  <GoalIcon>{icon}</GoalIcon>
                  {streak > 0 && <StreakBadge><FaFire /> {streak}</StreakBadge>}
                </CardHeader>
                <GoalTitle>
                  {goal.title}
                  {completed && <FaCheckCircle color="#7FD60E" size={20} />}
                </GoalTitle>
                <ProgressContainer>
                  <ProgressWrapper>
                    <CircularProgressbar
                      value={progressPercent}
                      text={`${Math.round(progressPercent)}%`}
                      styles={buildStyles({
                        textSize: '18px',
                        pathColor: completed ? '#7FD60E' : '#7FD60E',
                        textColor: '#FFFFFF',
                        trailColor: 'rgba(255,255,255,0.1)',
                      })}
                    />
                  </ProgressWrapper>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{goal.current_value} / {goal.target_value} {goal.unit}</div>
                    {!completed && (
                      <div style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.3rem' }}>
                        Осталось: {goal.target_value - goal.current_value} {goal.unit}
                      </div>
                    )}
                  </div>
                </ProgressContainer>
                <ButtonGroup>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {!completed && (
                      <QuickAddButton onClick={() => handleQuickAdd(goal)}>
                        +
                      </QuickAddButton>
                    )}
                    {!completed && (
                      <CompleteButton onClick={() => handleComplete(goal)} title="Завершить цель">
                        <FaCheckCircle />
                      </CompleteButton>
                    )}
                  </div>
                  <DeleteButton onClick={() => handleDelete(goal.id)}>
                    <FaTrash />
                  </DeleteButton>
                </ButtonGroup>
              </GoalCard>
            );
          })}
        </GoalsGrid>
      ) : (
        <EmptyMessage>Целей пока нет. Создайте первую цель!</EmptyMessage>
      )}
    </PageContainer>
  );
}