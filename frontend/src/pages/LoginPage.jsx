import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { fadeInUp, scaleIn } from '../styles/GlobalStyles';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border: 1px solid rgba(127, 214, 14, 0.2);
  animation: ${scaleIn} 0.6s ease-out;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #7FD60E;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(127, 214, 14, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #7FD60E;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid rgba(127, 214, 14, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;

  &:focus {
    outline: none;
    border-color: #7FD60E;
    box-shadow: 0 0 0 3px rgba(127, 214, 14, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.4rem;
  margin-left: 0.5rem;
  font-weight: 500;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%);
  color: #191F11;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(127, 214, 14, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(127, 214, 14, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;

  a {
    color: #7FD60E;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
      text-shadow: 0 0 10px rgba(127, 214, 14, 0.5);
    }
  }
`;


const schema = yup.object({
  username: yup.string()
    .required('Имя пользователя обязательно')
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя должно содержать максимум 20 символов'),
  password: yup.string()
    .required('Пароль обязателен')
    .min(1, 'Введите пароль'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error);

      let errorMessage = 'Ошибка входа. Проверьте данные.';

      if (error.response) {
        const { data, status } = error.response;

        if (status === 401) {
          errorMessage = 'Неверное имя пользователя или пароль';
        } else if (status === 400) {
          if (data.detail) {
            errorMessage = data.detail;
          } else if (data.non_field_errors) {
            errorMessage = data.non_field_errors[0];
          } else if (typeof data === 'string') {
            errorMessage = data;
          }
        } else if (status === 500) {
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title><FaUser /> Вход</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Icon><FaEnvelope /></Icon>
            <Input {...register('username')} placeholder="Имя пользователя" />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Icon><FaLock /></Icon>
            <Input {...register('password')} type="password" placeholder="Пароль" />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </InputGroup>
          <Button type="submit">Войти</Button>
        </Form>
        <LinkText>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
}