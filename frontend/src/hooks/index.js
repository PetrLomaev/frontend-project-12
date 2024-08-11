import { useContext } from 'react';
import { SocketContext, ProfanityContext } from '../contexts/index.js';

const useSocket = () => useContext(SocketContext);
const useProfanity = () => useContext(ProfanityContext);

export { useSocket, useProfanity };
