import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock } from 'react-icons/fa';

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
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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
  gap: 1.5rem;
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
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.2s;

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

const Button = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); 
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);  
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #4caf50;          
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const schema = yup.object({
  username: yup.string().required('Имя пользователя обязательно'),
  password: yup.string().required('Пароль обязателен'),
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
      alert('Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Вход</Title>
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