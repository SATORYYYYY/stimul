import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCrosshairs, FaRoute, FaPlay, FaStop, FaWalking } from 'react-icons/fa';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Container = styled.div`
  margin: 1rem 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(127, 214, 14, 0.2);
  background: rgba(255, 255, 255, 0.05);
`;

const MapWrapper = styled.div`
  height: 350px;
  width: 100%;
  position: relative;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #7FD60E 0%, #6BC00C 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $primary }) => $primary ? '#191F11' : '#FFFFFF'};
  border: 1px solid ${({ $primary }) => $primary ? 'transparent' : 'rgba(127, 214, 14, 0.3)'};
  padding: 0.6rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #8FE71E 0%, #7FD60E 100%)' : 'rgba(127, 214, 14, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(127, 214, 14, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TrackingInfo = styled.div`
  padding: 1rem;
  background: rgba(127, 214, 14, 0.1);
  border-top: 1px solid rgba(127, 214, 14, 0.2);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  text-align: center;

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #7FD60E;
  }

  .label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.3rem;
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
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState({
    distance: 0,
    duration: 0,
    speed: 0
  });
  const [currentPosition, setCurrentPosition] = useState(null);
  const trackingRef = useRef(null);
  const positionsRef = useRef([]);

  const handleLocationSelect = (latlng) => {
    setMarkerPos(latlng);
    onLocationChange({ lat: latlng.lat, lng: latlng.lng });
    setRoute(null);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          console.log('Точность:', accuracy, 'метров');

          const newPos = { lat: latitude, lng: longitude };
          setMapCenter([latitude, longitude]);
          setCurrentPosition(newPos);
          handleLocationSelect(newPos);
        },
        (error) => {
          console.error('Ошибка геолокации:', error);
          let errorMessage = 'Не удалось получить местоположение';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Доступ к геолокации отклонен';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Информация о местоположении недоступна';
              break;
            case error.TIMEOUT:
              errorMessage = 'Время ожидания истекло';
              break;
          }

          alert(errorMessage);
        },
        options
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается');
      return;
    }

    setIsTracking(true);
    positionsRef.current = [];

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    trackingRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, accuracy } = pos.coords;
        const newPos = { lat: latitude, lng: longitude };

        setCurrentPosition(newPos);
        setMapCenter([latitude, longitude]);

        // Добавляем новую точку в маршрут
        if (positionsRef.current.length === 0 ||
          calculateDistance(positionsRef.current[positionsRef.current.length - 1], newPos) > 10) {
          positionsRef.current.push(newPos);

          // Рассчитываем дистанцию
          const totalDistance = calculateTotalDistance(positionsRef.current);
          const totalDuration = trackingRef.current ? Math.floor((Date.now() - trackingRef.current.startTime) / 1000) : 0;
          const avgSpeed = totalDuration > 0 ? (totalDistance / totalDuration * 3.6).toFixed(2) : 0;

          setTrackingData({
            distance: totalDistance.toFixed(2),
            duration: formatDuration(totalDuration),
            speed: avgSpeed
          });

          setRoute(positionsRef.current.map(p => [p.lat, p.lng]));
        }
      },
      (error) => {
        console.error('Ошибка отслеживания:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setIsTracking(false);
          alert('Доступ к геолокации отклонен');
        }
      },
      options
    );

    trackingRef.current.startTime = Date.now();
  };

  const stopTracking = () => {
    if (trackingRef.current) {
      navigator.geolocation.clearWatch(trackingRef.current);
      trackingRef.current = null;
    }
    setIsTracking(false);
  };

  const calculateDistance = (pos1, pos2) => {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = pos1.lat * Math.PI / 180;
    const φ2 = pos2.lat * Math.PI / 180;
    const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180;
    const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateTotalDistance = (positions) => {
    if (positions.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < positions.length; i++) {
      total += calculateDistance(positions[i - 1], positions[i]);
    }
    return total;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const buildRoute = async () => {
    if (!markerPos) {
      alert('Сначала выберите точку на карте');
      return;
    }

    if (!currentPosition) {
      alert('Сначала определите ваше местоположение');
      return;
    }

    const start = [currentPosition.lng, currentPosition.lat];
    const end = [markerPos.lng, markerPos.lat];

    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/foot/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
      );
      const geometry = response.data.routes[0].geometry;
      const latlngs = geometry.coordinates.map(coord => [coord[1], coord[0]]);

      // Рассчитываем дистанцию и время
      const distance = (response.data.routes[0].distance / 1000).toFixed(2);
      const duration = Math.ceil(response.data.routes[0].duration / 60);

      setRoute(latlngs);
      alert(`Маршрут построен! Расстояние: ${distance} км, Время: ${duration} мин`);
    } catch (err) {
      console.error('Ошибка построения маршрута', err);
      alert('Не удалось построить маршрут. Попробуйте выбрать точки ближе друг к другу.');
    }
  };

  useEffect(() => {
    return () => {
      if (trackingRef.current) {
        navigator.geolocation.clearWatch(trackingRef.current);
      }
    };
  }, []);

  return (
    <Container>
      <MapWrapper>
        <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={mapCenter} />
          <EditableMarker
            position={markerPos}
            setPosition={setMarkerPos}
            onLocationSelect={handleLocationSelect}
          />
          {currentPosition && (
            <Circle
              center={currentPosition}
              radius={20}
              fillColor="#7FD60E"
              fillOpacity={0.5}
              color="#7FD60E"
              weight={2}
            />
          )}
          {route && route.length > 1 && (
            <Polyline positions={route} color="#7FD60E" weight={5} opacity={0.8} />
          )}
        </MapContainer>
      </MapWrapper>
      <Controls>
        <Button type="button" onClick={getUserLocation}>
          <FaCrosshairs /> Моё местоположение
        </Button>
        <Button type="button" onClick={buildRoute} disabled={!markerPos || !currentPosition}>
          <FaRoute /> Построить маршрут
        </Button>
        {!isTracking ? (
          <Button type="button" onClick={startTracking} $primary>
            <FaPlay /> Отслеживать маршрут
          </Button>
        ) : (
          <Button type="button" onClick={stopTracking}>
            <FaStop /> Остановить
          </Button>
        )}
        <Button type="button" onClick={() => alert('Кликните по карте, чтобы поставить метку\nДля отслеживания нажмите "Отслеживать маршрут"')}>
          <FaMapMarkerAlt /> Как использовать
        </Button>
      </Controls>
      {isTracking && (
        <TrackingInfo>
          <InfoItem>
            <div className="value">{trackingData.distance}</div>
            <div className="label">Метров</div>
          </InfoItem>
          <InfoItem>
            <div className="value">{trackingData.duration}</div>
            <div className="label">Время</div>
          </InfoItem>
          <InfoItem>
            <div className="value">{trackingData.speed}</div>
            <div className="label">Ср. скорость (км/ч)</div>
          </InfoItem>
          <InfoItem>
            <div className="value">{positionsRef.current.length}</div>
            <div className="label">Точек</div>
          </InfoItem>
        </TrackingInfo>
      )}
    </Container>
  );
}