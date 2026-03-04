import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ active, completed }) => 
    completed ? '#2C6E63' : active ? '#FF7F6F' : '#ddd'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const TypeCard = styled.div`
  background: ${({ selected }) => (selected ? '#A7D7C5' : '#f8f8f8')};
  border: 2px solid ${({ selected }) => (selected ? '#2C6E63' : 'transparent')};
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  }
`;

const SliderContainer = styled.div`
  margin: 2rem 0;
`;

const Slider = styled.input`
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${({ $primary }) => ($primary ? '#FF7F6F' : '#ccc')};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#d45b4a' : '#aaa')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const types = [
  { id: 'steps', icon: '👣', label: 'Шаги', unit: 'шаги' },
  { id: 'water', icon: '💧', label: 'Вода', unit: 'стаканы' },
  { id: 'duration', icon: '⏱️', label: 'Минуты', unit: 'мин' },
  { id: 'calories', icon: '🔥', label: 'Калории', unit: 'ккал' },
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
            <h3>Выберите тип цели</h3>
            <TypeGrid>
              {types.map(type => (
                <TypeCard
                  key={type.id}
                  selected={selectedType?.id === type.id}
                  onClick={() => handleTypeSelect(type)}
                >
                  <div style={{ fontSize: '2rem' }}>{type.icon}</div>
                  <div>{type.label}</div>
                </TypeCard>
              ))}
            </TypeGrid>
          </>
        );
      case 2:
        if (!selectedType) return null;
        return (
          <>
            <h3>Установите целевое значение</h3>
            <p>{selectedType.label}: {targetValue} {selectedType.unit}</p>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Новичок</span>
              <span>Оптимально</span>
              <span>Эксперт</span>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3>Название и дата</h3>
            <input
              {...register('title', { required: true })}
              placeholder="Название цели"
              style={{ width: '100%', padding: '0.8rem', margin: '1rem 0', border: '1px solid #ddd', borderRadius: '8px' }}
            />
            <input
              type="date"
              {...register('end_date')}
              style={{ width: '100%', padding: '0.8rem', margin: '1rem 0', border: '1px solid #ddd', borderRadius: '8px' }}
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