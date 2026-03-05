import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styled from 'styled-components'
import { FaHome, FaRunning, FaBullseye, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  color: #1E3A5F;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.5px;

  &:hover {
    color: #2C6E63;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const StyledLink = styled(Link)`
  color: #1E3A5F;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0;
  position: relative;
  font-weight: ${({ active }) => (active ? '600' : '400')};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #A7D7C5, #FF7F6F);
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  &:hover::after, &.active::after {
    transform: scaleX(1);
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255,255,255,0.5);
  padding: 0.3rem 1rem 0.3rem 0.5rem;
  border-radius: 30px;
`

const Avatar = styled(FaUserCircle)`
  font-size: 2rem;
  color: #2C6E63;
`

const Greeting = styled.span`
  font-weight: 500;
  color: #1E3A5F;
  border-right: 1px solid #ccc;
  padding-right: 0.8rem;
`

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #FF7F6F;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: #d45b4a;
  }
`

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const StatusBar = styled.div`
  width: 100%;
  background: #A7D7C5;
  color: #1E3A5F;
  padding: 0.3rem 2rem;
  font-size: 0.9rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() 

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dailyStats = {
    steps: 6342,
    water: 4,
    waterGoal: 8,
    goalProgress: 70
  }

  return (
    <>
      <NavContainer>
        <Logo to="/">
          <FaHome /> СбЗ
        </Logo>
        <NavLinks>
          <StyledLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            <FaHome /> Главная
          </StyledLink>
          <StyledLink to="/activities" className={location.pathname === '/activities' ? 'active' : ''}>
            <FaRunning /> Активности
          </StyledLink>
          <StyledLink to="/goals" className={location.pathname === '/goals' ? 'active' : ''}>
            <FaBullseye /> Цели
          </StyledLink>
          <StyledLink to="/motivation" className={location.pathname === '/motivation' ? 'active' : ''}>
             📖 Стимул
          </StyledLink>
          {user ? (
            <UserInfo>
              <Avatar />
              <Greeting>Привет, {user.username}</Greeting>
              <LogoutButton onClick={handleLogout}><FaSignOutAlt /> Выйти</LogoutButton>
            </UserInfo>
          ) : (
            <AuthLinks>
              <StyledLink to="/login"><FaSignInAlt /> Вход</StyledLink>
              <StyledLink to="/register"><FaUserPlus /> Регистрация</StyledLink>
            </AuthLinks>
          )}
        </NavLinks>
      </NavContainer>
      {user && (
        <StatusBar>
          <span>👣 {dailyStats.steps.toLocaleString()} шагов</span>
          <span>💧 {dailyStats.water}/{dailyStats.waterGoal} стаканов</span>
          <span>🔥 цель дня: {dailyStats.goalProgress}%</span>
        </StatusBar>
      )}
    </>
  )
}