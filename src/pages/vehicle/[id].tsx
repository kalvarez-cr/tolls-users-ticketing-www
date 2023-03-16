import LandingLayout from '@layouts/LandingLayout';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const VehicleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  return <p className="mb-28">{id}</p>;
};

VehicleDetail.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default VehicleDetail;
