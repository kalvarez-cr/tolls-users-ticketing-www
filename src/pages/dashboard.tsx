import MainCard from '@components/MainCard';
import Payments from '@components/Payments';
import LandingLayout from '@layouts/LandingLayout';
import React, { ReactElement } from 'react';

const Dashboard = () => {
  return (
    <MainCard title="Métodos de pago">
      <Payments />
    </MainCard>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Dashboard;
