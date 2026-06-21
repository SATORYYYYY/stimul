import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import api from '../services/api';
import ActivityForm from '../components/ActivityForm';
import styled from 'styled-components';
import { FaTrash, FaMapMarkedAlt, FaRunning, FaEdit } from 'react-icons/fa';
import { fadeInUp, scaleIn } from '../styles/GlobalStyles';

const RouteMap = lazy(() => import('../components/RouteMap'));

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

const List = styled.ul`
  list-style: none;
  padding: 0;
  animation: fadeInUp 0.6s ease-out 0.3s both;
  width: 100%;
`;

const ActivityItemStyled = styled.li`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: clamp(1.2rem, 3vw, 1.5rem);
  margin: 1rem 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(127, 214, 14, 0.2);
  animation: scaleIn 0.5s ease-out both;
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(127, 214, 14, 0.1), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateX(8px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    border-color: rgba(127, 214, 14, 0.4);

    &::before {
      left: 100%;
    }
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ActivityType = styled.span`
  font-weight: 600;
  color: #7FD60E;
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: clamp(0.8rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  margin-top: 0.5rem;
  font-weight: 500;
  flex-wrap: wrap;
`;

const Notes = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  font-style: italic;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-wrap: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.8rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(1rem, 2vw, 1.1rem);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    transform: scale(1.1);
  }
`;

const MapButton = styled(IconButton)`
  &:hover {
    background: rgba(127, 214, 14, 0.2);
    color: #7FD60E;
  }
`;

const MapPreview = styled.div`
  height: 250px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(127, 214, 14, 0.3);
  animation: scaleIn 0.4s ease-out;

  @media (max-width: 600px) {
    height: 200px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 2px dashed rgba(127, 214, 14, 0.3);
`;

const ActivityItem = React.memo(({ act, onDelete, onToggleMap, isMapOpen }) => {
  const sampleRoute = [
    [55.7558, 37.6176],
    [55.7568, 37.6186],
    [55.7578, 37.6196],
    [55.7588, 37.6206],
  ];

  return (
    <div>
      <ActivityItemStyled>
        <ActivityInfo>
          <ActivityType><FaRunning /> {act.activity_type}</ActivityType>
          <ActivityMeta>
            <span>{act.duration} мин</span>
            <span>{act.date}</span>
          </ActivityMeta>
          {act.notes && <Notes><FaEdit /> {act.notes}</Notes>}
        </ActivityInfo>
        <Actions>
          <MapButton onClick={() => onToggleMap(act.id)} title="Показать маршрут">
            <FaMapMarkedAlt />
          </MapButton>
          <IconButton onClick={() => onDelete(act.id)} title="Удалить"><FaTrash /></IconButton>
        </Actions>
      </ActivityItemStyled>
      {isMapOpen && (
        <MapPreview>
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#7FD60E', padding: '2rem' }}>Загрузка карты...</div>}>
            <RouteMap route={sampleRoute} />
          </Suspense>
        </MapPreview>
      )}
    </div>
  );
});

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [expandedMap, setExpandedMap] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/activities/');
      setActivities(res.data);
    } catch (err) {
      console.error('Ошибка загрузки активностей', err);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Удалить запись?')) {
      await api.delete(`/activities/${id}/`);
      fetchActivities();
    }
  }, [fetchActivities]);

  const toggleMap = useCallback((id) => {
    setExpandedMap(prev => prev === id ? null : id);
  }, []);

  return (
    <PageContainer>
      <Title><FaRunning /> Мои активности</Title>
      <ActivityForm onActivityAdded={fetchActivities} />

      {activities.length > 0 ? (
        <List>
          {activities.map((act) => (
            <ActivityItem
              key={act.id}
              act={act}
              onDelete={handleDelete}
              onToggleMap={toggleMap}
              isMapOpen={expandedMap === act.id}
            />
          ))}
        </List>
      ) : (
        <EmptyMessage>Активностей пока нет. Добавьте первую!</EmptyMessage>
      )}
    </PageContainer>
  );
}