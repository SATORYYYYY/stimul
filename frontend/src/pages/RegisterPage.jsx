import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { fadeInUp, scaleIn, pulse } from '../styles/GlobalStyles';

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
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: ${scaleIn} 0.6s ease-out;
  border: 1px solid rgba(127, 214, 14, 0.2);
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
  gap: 1.2rem;
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
  z-index: 1;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(127, 214, 14, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(127, 214, 14, 0.6);
    animation: ${pulse} 1.5s infinite;
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

const schema = yup.object().shape({
  username: yup.string()
    .required('Имя пользователя обязательно')
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя должно содержать максимум 20 символов')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы'),
  email: yup.string()
    .nullable()
    .email('Некорректный формат email'),
  password: yup.string()
    .required('Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(128, 'Пароль должен содержать максимум 128 символов'),
  password2: yup.string()
    .oneOf([yup.ref('password'), null], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
  first_name: yup.string()
    .nullable()
    .max(30, 'Имя должно содержать максимум 30 символов'),
  last_name: yup.string()
    .nullable()
    .max(30, 'Фамилия должна содержать максимум 30 символов'),
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
      console.error('Ошибка регистрации:', error);

      let errorMessage = 'Ошибка регистрации. Попробуйте снова.';

      if (error.response) {
        // Ошибка от сервера
        const { data, status } = error.response;

        if (status === 400) {
          // Ошибка валидации
          if (data.username) {
            errorMessage = data.username[0];
          } else if (data.email) {
            errorMessage = data.email[0];
          } else if (data.password) {
            errorMessage = data.password[0];
          } else if (data.non_field_errors) {
            errorMessage = data.non_field_errors[0];
          } else if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.detail) {
            errorMessage = data.detail;
          }
        } else if (status === 404) {
          errorMessage = 'API endpoint не найден. Проверьте подключение к серверу.';
        } else if (status === 409) {
          errorMessage = 'Пользователь с такими данными уже существует.';
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