import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import GoalForm from '../components/GoalForm';
import styled from 'styled-components';
import { FaTrash, FaFire, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fadeInUp } from '../styles/GlobalStyles';

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1E3A5F;
  margin-bottom: 2rem;
`;

const CreateButton = styled.button`
  background: #FF7F6F;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  transition: 0.2s;

  &:hover {
    background: #e56758;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255,127,111,0.3);
  }
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const GoalCard = styled.div`
  background: linear-gradient(135deg, #A7D7C5, #6BB39B);
  border-radius: 25px;
  padding: 1.5rem;
  color: #1E3A5F;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s, opacity 0.2s;
  opacity: ${props => props.$completed ? 0.7 : 1};

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GoalIcon = styled.span`
  font-size: 2rem;
  background: rgba(255,255,255,0.3);
  padding: 0.5rem;
  border-radius: 15px;
`;

const StreakBadge = styled.span`
  background: #FF7F6F;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const GoalTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressWrapper = styled.div`
  width: 70px;
  height: 70px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuickAddButton = styled.button`
  background: #FF7F6F;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(255,127,111,0.4);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompleteButton = styled.button`
  background: ${props => props.$completed ? '#4caf50' : 'white'};
  color: ${props => props.$completed ? 'white' : '#1E3A5F'};
  border: 2px solid #4caf50;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #4caf50;
    color: white;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: rgba(0,0,0,0.3);
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;

  &:hover {
    color: #d45b4a;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #1E3A5F;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const getIcon = (type) => {
  switch(type) {
    case 'steps': return '👣';
    case 'duration': return '⏱️';
    case 'calories': return '🔥';
    case 'water': return '💧';
    default: return '🎯';
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
      <Title>Мои цели</Title>
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
                  {completed && <FaCheckCircle color="#4caf50" size={18} />}
                </GoalTitle>
                <ProgressContainer>
                  <ProgressWrapper>
                    <CircularProgressbar
                      value={progressPercent}
                      text={`${goal.current_value}/${goal.target_value}`}
                      styles={buildStyles({
                        textSize: '20px',
                        pathColor: completed ? '#4caf50' : '#FF7F6F',
                        textColor: '#1E3A5F',
                        trailColor: 'rgba(255,255,255,0.3)',
                      })}
                    />
                  </ProgressWrapper>
                  <div>
                    <div>{goal.current_value} / {goal.target_value} {goal.unit}</div>
                    {!completed && (
                      <div style={{ fontSize: '0.9rem', color: '#1E3A5F', marginTop: '0.2rem' }}>
                        Осталось: {goal.target_value - goal.current_value} {goal.unit}
                      </div>
                    )}
                  </div>
                </ProgressContainer>
                <ButtonGroup>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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