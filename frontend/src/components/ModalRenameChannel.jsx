/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  getChannels,
  setShowModalRenameChannel,
  setNewChannelName,
  getActiveChannelForRename,
} from '../slices/channelsSlice.js';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { getToken } from '../slices/authorizationSlice.js';
//import { io } from 'socket.io-client';
import * as yup from 'yup';

//const socket = io('http://localhost:3000');

const ModalRenameChannel = () => {
  const dispatch = useDispatch();

  // Вытащить значения из authorizationSlice
  const token = useSelector(getToken);

  const inputRef = useRef(null);

  // При закрытии окна - изменяем в стейте showModalRenameChannel на true или false
  const handleSetShowModalRenameChannel = () => {
    dispatch(setShowModalRenameChannel());
  };

  // Функция для переименования канала по имени и последующей его перезаписи в state
  const handleSetNewChannelName = async (newName, userToken, changingChannelId) => {
    const newEdditedChannelName = { name: newName };
    const pathToRenameChannel = [routes.channelsPath(), changingChannelId].join('/');
    try {
      const response = await axios.patch(pathToRenameChannel, newEdditedChannelName, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        //dispatch(setActiveChannel(response.data.id));
        dispatch(setNewChannelName({ id: response.data.id, newName: response.data.name }));
        handleSetShowModalRenameChannel();
      }
    }
    catch (e) {
      console.log(e);
    }
  };
  /*
  useEffect(() => {
    socket.on('newChannel', (currentNewChannel) => {
      console.log('Current newChannel>>>', currentNewChannel);
      dispatch(addChannel(currentNewChannel));
    });
    return () => {
      socket.off('newChannel');
    };
  }, []);
  */

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);
  }, []);

  const channels = useSelector(getChannels);
  const activeChannelForRename = useSelector(getActiveChannelForRename);

  const isUniqueChannelName = (name) => {
    const checkCannels = channels.filter((channel) => channel.name === name);
    return checkCannels.length > 0 ? false : true;
  };

  const schema = yup.object().shape({
    renameChannelName: yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .test('is-unique', 'Должно быть уникальным', (value) => isUniqueChannelName(value))
  });

  return (
      <Modal show onHide={handleSetShowModalRenameChannel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ renameChannelName: activeChannelForRename.name }}
            validationSchema={schema}
            onSubmit={(values) => {
              handleSetNewChannelName(values.renameChannelName, token, activeChannelForRename.id);
            }}
          >
          {({ handleChange, handleBlur, values }) => (
            <Form noValidate className="mb-2">
              <Field
                type="text"
                name="renameChannelName"
                aria-label="Новое имя канала"
                autoComplete="off"
                placeholder=""
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renameChannelName}
                innerRef={inputRef}
              />
              <ErrorMessage
                component="div"
                name="renameChannelName"
                className="text-danger"
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSetShowModalRenameChannel}>
                  Отменить
                </Button>
                <Button variant="primary" type="submit" disabled="">
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
          )}
          </Formik>
        </Modal.Body>
      </Modal>
  );
};

export default ModalRenameChannel;