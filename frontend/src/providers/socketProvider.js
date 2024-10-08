import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SocketContext } from '../contexts/index.js';
import { addMessage } from '../slices/messagesSlice.js';
import { addChannel, setDeleteChannel, setNewChannelName } from '../slices/channelsSlice.js';

const SocketProvider = ({ children, newSocket }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (payload) => {
        dispatch(addMessage(payload));
      });

      socket.on('newChannel', (payload) => {
        dispatch(addChannel(payload));
      });

      socket.on('removeChannel', (payload) => {
        dispatch(setDeleteChannel(payload));
      });

      socket.on('renameChannel', (payload) => {
        dispatch(setNewChannelName(payload));
      });
    }
  });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
