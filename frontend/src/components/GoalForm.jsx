import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaShoePrints, FaTint, FaStopwatch, FaFire } from 'react-icons/fa';
import { fadeInUp, scaleIn } from '../styles/GlobalStyles';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInUp 0.3s ease-out;
  padding: 1rem;

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const ModalContent = styled.div`
  background: rgba(25, 31, 17, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: clamp(2rem, 5vw, 2.5rem);
  width: 90%;
  max-width: clamp(400px, 90vw, 520px);
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(127, 214, 14, 0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: scaleIn 0.3s ease-out;

  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 1.5rem;
    max-height: 90vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  padding: 0.5rem;

  &:hover {
    color: #7FD60E;
    transform: scale(1.1);
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${({ active, completed }) =>
    completed ? '#7FD60E' : active ? 'rgba(127, 214, 14, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ active, completed }) =>
    completed || active ? '#191F11' : 'rgba(255, 255, 255, 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  border: 2px solid ${({ active, completed }) =>
    completed || active ? '#7FD60E' : 'rgba(127, 214, 14, 0.2)'};
  transition: all 0.3s ease;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const TypeCard = styled.div`
  background: ${({ selected }) => (selected ? 'rgba(127, 214, 14, 0.2)' : 'rgba(255, 255, 255, 0.05)')};
  border: 2px solid ${({ selected }) => (selected ? '#7FD60E' : 'rgba(127, 214, 14, 0.2)')};
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    border-color: #7FD60E;
    background: rgba(127, 214, 14, 0.15);
  }

  svg {
    color: ${({ selected }) => (selected ? '#7FD60E' : 'rgba(255, 255, 255, 0.7)')};
    transition: all 0.3s ease;
  }

  div:last-child {
    color: ${({ selected }) => (selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)')};
    font-weight: ${({ selected }) => (selected ? '600' : '400')};
  }
`;

const SliderContainer = styled.div`
  margin: 2rem 0;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #7FD60E;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(127, 214, 14, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #7FD60E;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 10px rgba(127, 214, 14, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${({ $primary, disabled }) =>
    disabled ? 'rgba(255, 255, 255, 0.1)' :
    $primary ? 'linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $primary }) => ($primary ? '#191F11' : 'rgba(255, 255, 255, 0.7)')};
  border: 1px solid ${({ $primary }) => ($primary ? 'transparent' : 'rgba(127, 214, 14, 0.3)')};
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${({ $primary }) =>
      $primary ? 'linear-gradient(135deg, #8FE71E 0%, #7FD60E 100%)' : 'rgba(127, 214, 14, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(127, 214, 14, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const types = [
  { id: 'steps', icon: <FaShoePrints size={32} />, label: 'Шаги', unit: 'шаги' },
  { id: 'water', icon: <FaTint size={32} />, label: 'Вода', unit: 'стаканы' },
  { id: 'duration', icon: <FaStopwatch size={32} />, label: 'Минуты', unit: 'мин' },
  { id: 'calories', icon: <FaFire size={32} />, label: 'Калории', unit: 'ккал' },
];

export default function GoalForm({ onGoalAdded, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [targetValue, setTargetValue] = useState(7000);
  const { register, handleSubmit, setValue } = useForm();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleTypeSelect = (type) => {
     setSelectedType(type);
     setValue('goal_type', type.id);
     setValue('unit', type.unit);
     let defaultVal;
     if (type.id === 'steps') defaultVal = 7000;
     else if (type.id === 'water') defaultVal = 8;
     else if (type.id === 'duration') defaultVal = 30;
     else if (type.id === 'calories') defaultVal = 500;
     setTargetValue(defaultVal);
     setValue('target_value', defaultVal); 
    };

    const onSubmit = async (data) => {
     const payload = {
       ...data,
       end_date: data.end_date || null, 
     };
      try {
       await api.post('/goals/', payload);
       onGoalAdded();
     } catch (err) {
       console.error('Ошибка создания цели', err.response?.data);
       alert('Ошибка: ' + JSON.stringify(err.response?.data));
     }
    };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h3 style={{ color: '#7FD60E', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Выберите тип цели</h3>
            <TypeGrid>
              {types.map(type => (
                <TypeCard
                  key={type.id}
                  selected={selectedType?.id === type.id}
                  onClick={() => handleTypeSelect(type)}
                >
                  <div style={{ marginBottom: '0.8rem' }}>{type.icon}</div>
                  <div style={{ fontSize: '1rem' }}>{type.label}</div>
                </TypeCard>
              ))}
            </TypeGrid>
          </>
        );
      case 2:
        if (!selectedType) return null;
        return (
          <>
            <h3 style={{ color: '#7FD60E', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Установите целевое значение</h3>
            <p style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: '500', marginBottom: '1.5rem' }}>
              {selectedType.label}: <span style={{ color: '#7FD60E', fontWeight: '700' }}>{targetValue} {selectedType.unit}</span>
            </p>
            <SliderContainer>
              <Slider
                type="range"
                min={selectedType.id === 'steps' ? 1000 : 1}
                max={selectedType.id === 'steps' ? 20000 : selectedType.id === 'water' ? 15 : 300}
                value={targetValue}
                onChange={(e) => {
                  setTargetValue(Number(e.target.value));
                  setValue('target_value', Number(e.target.value));
                }}
              />
            </SliderContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              <span>Новичок</span>
              <span style={{ color: '#7FD60E', fontWeight: '600' }}>Оптимально</span>
              <span>Эксперт</span>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 style={{ color: '#7FD60E', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Название и дата</h3>
            <input
              {...register('title', { required: true })}
              placeholder="Название цели"
              style={{
                width: '100%',
                padding: '1rem',
                margin: '1rem 0',
                border: '1px solid rgba(127, 214, 14, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <input
              type="date"
              {...register('end_date')}
              style={{
                width: '100%',
                padding: '1rem',
                margin: '1rem 0',
                border: '1px solid rgba(127, 214, 14, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </>
        );
      default: return null;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <StepIndicator>
          {[1,2,3].map(i => (
            <Step key={i} active={step === i} completed={step > i}>
              {step > i ? <FaCheck /> : i}
            </Step>
          ))}
        </StepIndicator>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <ButtonGroup>
            {step > 1 && (
              <Button type="button" onClick={prevStep}>
                <FaChevronLeft /> Назад
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" $primary onClick={nextStep} disabled={step === 1 && !selectedType}>
                Далее <FaChevronRight />
              </Button>
            ) : (
              <Button type="submit" $primary>
                Создать цель <FaCheck />
              </Button>
            )}
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}