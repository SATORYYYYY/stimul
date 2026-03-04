import { useState } from 'react';
import api from '../services/api';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import LocationPicker from './LocationPicker';

const Form = styled.form`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Field = styled.div`
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #1E3A5F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #F8FAFC;

  &:focus {
    outline: none;
    border-color: #2C6E63;
    box-shadow: 0 0 0 3px rgba(44, 110, 99, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #F8FAFC;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2C6E63;
    box-shadow: 0 0 0 3px rgba(44, 110, 99, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.7rem 1rem;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  background: #F8FAFC;

  &:focus {
    outline: none;
    border-color: #2C6E63;
    box-shadow: 0 0 0 3px rgba(44, 110, 99, 0.1);
  }
`;

const Button = styled.button`
  background: #FF7F6F;
  color: white;
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  height: fit-content;
  box-shadow: 0 4px 8px rgba(255, 127, 111, 0.3);

  &:hover {
    background: #e56758;
    box-shadow: 0 6px 12px rgba(255, 127, 111, 0.4);
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
          <option value="walk">🚶 Ходьба</option>
          <option value="run">🏃 Бег</option>
          <option value="gym">🏋️ Тренажерный зал</option>
          <option value="yoga">🧘 Йога</option>
          <option value="other">🔧 Другое</option>
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