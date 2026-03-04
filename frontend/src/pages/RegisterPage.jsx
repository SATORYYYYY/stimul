import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  margin-left: 0.5rem;
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102,126,234,0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102,126,234,0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102,126,234,0);
  }
`;
const Button = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);  /* изменено */
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);  /* обновлён */
    animation: ${pulse} 1.5s infinite;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #4caf50;          /* изменено */
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = yup.object({
  username: yup.string().required('Имя пользователя обязательно'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Пароль обязателен'),
  password2: yup.string().oneOf([yup.ref('password'), null], 'Пароли должны совпадать').required('Подтвердите пароль'),
  first_name: yup.string(),
  last_name: yup.string(),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      alert('Регистрация успешна! Теперь вы можете войти.');
      navigate('/login');
    } catch (error) {
      alert('Ошибка регистрации. Возможно, пользователь уже существует.');
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Регистрация</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Icon><FaUser /></Icon>
            <Input {...register('username')} placeholder="Имя пользователя*" />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Icon><FaEnvelope /></Icon>
            <Input {...register('email')} placeholder="Email*" />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Icon><FaLock /></Icon>
            <Input {...register('password')} type="password" placeholder="Пароль*" />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Icon><FaLock /></Icon>
            <Input {...register('password2')} type="password" placeholder="Подтверждение пароля*" />
            {errors.password2 && <ErrorText>{errors.password2.message}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Icon><FaUser /></Icon>
            <Input {...register('first_name')} placeholder="Имя" />
          </InputGroup>

          <InputGroup>
            <Icon><FaUser /></Icon>
            <Input {...register('last_name')} placeholder="Фамилия" />
          </InputGroup>

          <Button type="submit">
            <FaUserPlus /> Зарегистрироваться
          </Button>
        </Form>
        <LinkText>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
}