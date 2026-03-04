import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCrosshairs, FaRoute } from 'react-icons/fa';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Container = styled.div`
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e7ef;
`;

const MapWrapper = styled.div`
  height: 250px;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background: #FF7F6F;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: 0.2s;

  &:hover {
    background: #e56758;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function EditableMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onLocationChange }) {
  const [mapCenter, setMapCenter] = useState([55.7558, 37.6176]); 
  const [markerPos, setMarkerPos] = useState(null);
  const [route, setRoute] = useState(null);

  const handleLocationSelect = (latlng) => {
    setMarkerPos(latlng);
    onLocationChange({ lat: latlng.lat, lng: latlng.lng });
    setRoute(null); 
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setMapCenter([latitude, longitude]); 
          handleLocationSelect(newPos); 
        },
        (error) => {
          console.error('Ошибка геолокации:', error);
          alert('Не удалось получить местоположение');
        }
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  };

  const buildRoute = async () => {
    if (!markerPos) {
      alert('Сначала выберите точку на карте');
      return;
    }

    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const start = [pos.coords.longitude, pos.coords.latitude];
      const end = [markerPos.lng, markerPos.lat];
      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/foot/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
        );
        const geometry = response.data.routes[0].geometry;
        const latlngs = geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(latlngs);
      } catch (err) {
        console.error('Ошибка построения маршрута', err);
        alert('Не удалось построить маршрут');
      }
    }, (error) => {
      console.error('Ошибка геолокации при построении маршрута:', error);
      alert('Не удалось определить ваше местоположение');
    });
  };

  return (
    <Container>
      <MapWrapper>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={mapCenter} />
          <EditableMarker
            position={markerPos}
            setPosition={setMarkerPos}
            onLocationSelect={handleLocationSelect}
          />
          {route && (
            <Polyline positions={route} color="#2C6E63" weight={5} />
          )}
        </MapContainer>
      </MapWrapper>
      <Controls>
        <Button type="button" onClick={getUserLocation}>
          <FaCrosshairs /> Моё местоположение
        </Button>
        <Button type="button" onClick={buildRoute} disabled={!markerPos}>
          <FaRoute /> Построить маршрут
        </Button>
        <Button type="button" onClick={() => alert('Кликните по карте, чтобы поставить метку')}>
          <FaMapMarkerAlt /> Как использовать
        </Button>
      </Controls>
    </Container>
  );
}