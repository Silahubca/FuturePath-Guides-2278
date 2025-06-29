import React from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import questConfig from '../../config/questConfig';
import { useAuth } from '../../hooks/useAuth.jsx';

const GetStartedComponent = () => {
  const { user } = useAuth();

  // Get user ID from localStorage or use authenticated user ID or fallback to config
  const userId = localStorage.getItem('userId') || user?.id || questConfig.USER_ID;

  return (
    <GetStarted
      questId={questConfig.GET_STARTED_QUESTID}
      uniqueUserId={userId}
      accent={questConfig.PRIMARY_COLOR}
      autoHide={false}
    >
      <GetStarted.Header />
      <GetStarted.Progress />
      <GetStarted.Content />
      <GetStarted.Footer />
    </GetStarted>
  );
};

export default GetStartedComponent;