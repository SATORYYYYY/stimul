import { useEffect, useState } from 'react'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styled from 'styled-components'
import { FaCheckCircle, FaClock } from 'react-icons/fa'
import { fadeInUp } from '../styles/GlobalStyles'

const PageContainer = styled.div`
  padding: 2rem 0;
`

const Title = styled.h1`
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
`

const ChartCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`

const ChartTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const GoalCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border-left: 5px solid ${props => props.$completed ? '#4caf50' : '#ff9800'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const GoalTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min((props.value / props.target) * 100, 100)}%;
  background: linear-gradient(90deg, #66bb6a, #2e7d32);  
  border-radius: 5px;
  transition: width 0.3s ease;
`

const GoalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`

const EmptyMessage = styled.p`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  margin-top: 2rem;
`

export default function DashboardPage() {
  const [activities, setActivities] = useState([])
  const [goals, setGoals] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [activitiesRes, goalsRes] = await Promise.all([
        api.get('/activities/'),
        api.get('/goals/')
      ])
      setActivities(activitiesRes.data)
      setGoals(goalsRes.data)
    }
    fetchData()
  }, [])

  const chartData = activities.reduce((acc, act) => {
    const date = act.date
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.totalDuration += act.duration
    } else {
      acc.push({ date, totalDuration: act.duration })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <PageContainer>
      <Title>Мой прогресс здоровья</Title>

      <ChartCard>
        <ChartTitle><FaClock /> Динамика активности</ChartTitle>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalDuration" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Минуты" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyMessage>Нет данных. Добавьте первую активность!</EmptyMessage>
        )}
      </ChartCard>
      <ChartTitle>Мои цели</ChartTitle>
      {goals.length > 0 ? (
        <GoalsGrid>
          {goals.map((goal, index) => {
            const completed = goal.current_value >= goal.target_value
            return (
              <GoalCard key={goal.id} $completed={completed} index={index}>
                <GoalTitle>
                  {goal.title}
                  {completed && <FaCheckCircle color="#4caf50" />}
                </GoalTitle>
                <ProgressBar>
                  <ProgressFill value={goal.current_value} target={goal.target_value} />
                </ProgressBar>
                <GoalMeta>
                  <span>Прогресс: {goal.current_value} / {goal.target_value} {goal.unit}</span>
                  <span>{Math.round((goal.current_value / goal.target_value) * 100)}%</span>
                </GoalMeta>
              </GoalCard>
            )
          })}
        </GoalsGrid>
      ) : (
        <EmptyMessage>Целей пока нет. Создайте первую цель!</EmptyMessage>
      )}
    </PageContainer>
  )
}