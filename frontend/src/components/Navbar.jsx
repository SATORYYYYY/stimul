import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styled from 'styled-components'
import { FaHome, FaRunning, FaBullseye, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCircle, FaBook, FaShoePrints, FaTint, FaFire, FaTrophy } from 'react-icons/fa'

const NavContainer = styled.nav`
  background: rgba(25, 31, 17, 0.95);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid #7FD60E;
  animation: fadeInDown 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.8rem;
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
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  position: relative;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  border-radius: 8px;
  transition: all 0.3s ease;
  background: transparent;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #7FD60E, #a0e83c);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #7FD60E;
    background: rgba(127, 214, 14, 0.1);

    &::after {
      width: 80%;
    }
  }

  &.active {
    color: #7FD60E;
    background: rgba(127, 214, 14, 0.15);

    &::after {
      width: 80%;
    }
  }
`

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  color: #7FD60E;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
  text-shadow: 0 0 20px rgba(127, 214, 14, 0.3);
  white-space: nowrap;

  &:hover {
    color: #FFFFFF;
    text-shadow: 0 0 30px rgba(127, 214, 14, 0.5);
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(127, 214, 14, 0.1);
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 30px;
  border: 1px solid rgba(127, 214, 14, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(127, 214, 14, 0.2);
    border-color: rgba(127, 214, 14, 0.5);
  }
`

const Avatar = styled(FaUserCircle)`
  font-size: 2rem;
  color: #7FD60E;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const Greeting = styled.span`
  font-weight: 500;
  color: #FFFFFF;
  border-right: 1px solid rgba(127, 214, 14, 0.3);
  padding-right: 0.8rem;
`

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.9rem;
  transition: all 0.2s;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;

  &:hover {
    color: #7FD60E;
    background: rgba(127, 214, 14, 0.1);
  }
`

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const StatusBar = styled.div`
  width: 100%;
  background: rgba(25, 31, 17, 0.8);
  backdrop-filter: blur(10px);
  color: #FFFFFF;
  padding: 0.8rem 2rem;
  font-size: 0.95rem;
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(127, 214, 14, 0.2);
  animation: fadeInUp 0.5s ease-out;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;

    &:hover {
      color: #7FD60E;
    }

    svg {
      color: #7FD60E;
    }
  }
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
             <FaBook /> Стимул
          </StyledLink>
          <StyledLink to="/daily-challenges" className={location.pathname === '/daily-challenges' ? 'active' : ''}>
             <FaTrophy /> Задания
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
          <span><FaShoePrints /> {dailyStats.steps.toLocaleString()} шагов</span>
          <span><FaTint /> {dailyStats.water}/{dailyStats.waterGoal} стаканов</span>
          <span><FaFire /> цель дня: {dailyStats.goalProgress}%</span>
        </StatusBar>
      )}
    </>
  )
}