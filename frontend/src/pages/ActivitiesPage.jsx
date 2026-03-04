import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import api from '../services/api';
import ActivityForm from '../components/ActivityForm';
import styled from 'styled-components';
import { FaTrash, FaMapMarkedAlt } from 'react-icons/fa';
import { fadeInUp } from '../styles/GlobalStyles';

const RouteMap = lazy(() => import('../components/RouteMap'));

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1E3A5F;
  margin-bottom: 2rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const ActivityItemStyled = styled.li`
  background: white;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityType = styled.span`
  font-weight: 600;
  color: #1E3A5F;
  font-size: 1.1rem;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const Notes = styled.div`
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: 0.2s;
  color: #666;

  &:hover {
    background: #f0f0f0;
    color: #ff6b6b;
  }
`;

const MapButton = styled(IconButton)`
  &:hover {
    color: #2C6E63;
  }
`;

const MapPreview = styled.div`
  height: 200px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
  overflow: hidden;
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
          <ActivityType>{act.activity_type}</ActivityType>
          <ActivityMeta>
            <span>{act.duration} мин</span>
            <span>{act.date}</span>
          </ActivityMeta>
          {act.notes && <Notes>📝 {act.notes}</Notes>}
        </ActivityInfo>
        <Actions>
          <MapButton onClick={() => onToggleMap(act.id)} title="Показать маршрут">
            <FaMapMarkedAlt />
          </MapButton>
          <IconButton onClick={() => onDelete(act.id)}><FaTrash /></IconButton>
        </Actions>
      </ActivityItemStyled>
      {isMapOpen && (
        <MapPreview>
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#1E3A5F' }}>Загрузка карты...</div>}>
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
      <Title>Мои активности</Title>
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
        <p style={{ color: '#1E3A5F', textAlign: 'center' }}>Активностей пока нет. Добавьте первую!</p>
      )}
    </PageContainer>
  );
}