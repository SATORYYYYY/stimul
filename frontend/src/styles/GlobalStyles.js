import { createGlobalStyle, keyframes } from 'styled-components'

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #191F11 0%, #1a2213 100%);
    min-height: 100vh;
    color: #FFFFFF;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #191F11;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #7FD60E 0%, #6BC00C 100%);
    border-radius: 10px;
    border: 2px solid #191F11;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #8FE71E 0%, #7FD60E 100%);
  }

  ::selection {
    background: #7FD60E;
    color: #191F11;
  }

  ::-moz-selection {
    background: #7FD60E;
    color: #191F11;
  }
`;