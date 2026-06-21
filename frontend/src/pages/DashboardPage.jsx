import { useEffect, useState } from 'react'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styled from 'styled-components'
import { FaCheckCircle, FaClock, FaFire, FaTrophy, FaChartLine } from 'react-icons/fa'
import { fadeInUp, scaleIn, shimmer } from '../styles/GlobalStyles'

const PageContainer = styled.div`
  padding: 2rem 0;
  animation: fadeInUp 0.6s ease-out;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #7FD60E;
  margin-bottom: 2rem;
  text-shadow: 0 0 30px rgba(127, 214, 14, 0.3);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${scaleIn} 0.6s ease-out;
  border: 1px solid rgba(127, 214, 14, 0.2);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    border-color: rgba(127, 214, 14, 0.4);
  }
`

const ChartTitle = styled.h2`
  font-size: 1.5rem;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;

  svg {
    color: #7FD60E;
  }
`

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.3s both;
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-left: 5px solid ${props => props.$completed ? '#7FD60E' : '#ffa000'};
  border: 1px solid rgba(127, 214, 14, 0.2);
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    border-color: rgba(127, 214, 14, 0.5);
  }
`;

const GoalTitle = styled.h3`
  font-size: 1.3rem;
  color: #FFFFFF;
  margin-bottom: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 1rem 0;
  overflow: hidden;
  position: relative;
`

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min((props.value / props.target) * 100, 100)}%;
  background: linear-gradient(90deg, #7FD60E, #a0e83c);
  border-radius: 6px;
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
`

const GoalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-top: 0.8rem;
  font-weight: 500;
`

const EmptyMessage = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.3rem;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 2px dashed rgba(127, 214, 14, 0.3);
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
      <Title>
        <FaChartLine />
        Мой прогресс здоровья
      </Title>

      <ChartCard>
        <ChartTitle><FaClock /> Динамика активности</ChartTitle>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.7)" />
              <YAxis stroke="rgba(255, 255, 255, 0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(25, 31, 17, 0.95)',
                  border: '1px solid rgba(127, 214, 14, 0.3)',
                  borderRadius: '10px',
                  color: '#FFFFFF'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalDuration"
                stroke="#7FD60E"
                strokeWidth={3}
                dot={{ fill: '#7FD60E', r: 6, strokeWidth: 2 }}
                activeDot={{ fill: '#FFFFFF', r: 10, strokeWidth: 3 }}
                name="Минуты"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyMessage>Нет данных. Добавьте первую активность!</EmptyMessage>
        )}
      </ChartCard>
      <ChartTitle><FaTrophy /> Мои цели</ChartTitle>
      {goals.length > 0 ? (
        <GoalsGrid>
          {goals.map((goal, index) => {
            const completed = goal.current_value >= goal.target_value
            return (
              <GoalCard key={goal.id} $completed={completed} index={index}>
                <GoalTitle>
                  {goal.title}
                  {completed && <FaCheckCircle color="#7FD60E" size={24} />}
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