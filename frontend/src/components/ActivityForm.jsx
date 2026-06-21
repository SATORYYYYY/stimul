import { useState } from 'react';
import api from '../services/api';
import styled from 'styled-components';
import { FaPlus, FaWalking, FaRunning as FaRunningIcon, FaDumbbell, FaOm, FaCogs } from 'react-icons/fa';
import LocationPicker from './LocationPicker';

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.4s ease;
  border: 1px solid rgba(127, 214, 14, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const Field = styled.div`
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #7FD60E;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
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

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid rgba(127, 214, 14, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  color: #FFFFFF;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #7FD60E;
    box-shadow: 0 0 0 3px rgba(127, 214, 14, 0.2);
  }

  option {
    background: #191F11;
    color: #FFFFFF;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid rgba(127, 214, 14, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #7FD60E;
    box-shadow: 0 0 0 3px rgba(127, 214, 14, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%);
  color: #191F11;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(127, 214, 14, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(127, 214, 14, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function ActivityForm({ onActivityAdded }) {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [formData, setFormData] = useState({
    activity_type: 'walk',
    duration: '',
    date: '',
    notes: ''
  });

  const handleLocationChange = (latlng) => {
    setLocation(latlng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: location.lat,
      longitude: location.lng,
    };
    try {
      await api.post('/activities/', payload);
      onActivityAdded();
      setFormData({ activity_type: 'walk', duration: '', date: '', notes: '' });
      setLocation({ lat: null, lng: null });
    } catch (err) {
      console.error('Ошибка при добавлении активности', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label>Тип активности</Label>
        <Select
          value={formData.activity_type}
          onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
          required
        >
          <option value="walk">Ходьба</option>
          <option value="run">Бег</option>
          <option value="gym">Тренажерный зал</option>
          <option value="yoga">Йога</option>
          <option value="other">Другое</option>
        </Select>
      </Field>

      <Field>
        <Label>Длительность (мин)</Label>
        <Input
          type="number"
          placeholder="30"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          required
        />
      </Field>

      <Field>
        <Label>Дата</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </Field>

      <Field>
        <Label>Заметки</Label>
        <TextArea
          placeholder="что-то ещё..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </Field>

      <Field style={{ flex: '1 1 100%' }}>
        <Label>Местоположение (кликните на карте)</Label>
        <LocationPicker onLocationChange={handleLocationChange} />
      </Field>

      <Button type="submit">
        <FaPlus /> Добавить
      </Button>
    </Form>
  );
}