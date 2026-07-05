import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ToastProvider from './components/Toasts';
import { RoutesStrings } from './constant/constant';
import MainLayout from "./layouts/MainLayout";
import ChatLayout from './pages/ChatLayout';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => (
  <React.Fragment>
    <BrowserRouter>
      <Routes>
        <Route path={RoutesStrings.Base} element={<Login />} />
        <Route path={RoutesStrings.SignUp} element={<Register />} />
        <Route path={RoutesStrings.Chat} element={
          <MainLayout>
            <ChatLayout />
          </MainLayout>} />
      </Routes>
    </BrowserRouter>
    <ToastProvider />
  </React.Fragment>
);

export default App;
