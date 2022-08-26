import LandingLayout from '@layouts/LandingLayout';
import { useAxios } from 'hooks/useAxios';
import Image from 'next/image';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';

const { requester } = useAxios();

const useFetchData = () =>
  useQuery('team', async () => {
    const { data } = await requester.get('/character');
    return data;
  });

const Team = () => {
  const { data, isLoading } = useFetchData();
  return (
    <div>
      <h1>Team</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap">
          {data.results.map((character) => (
            <div className="flex w-1/5 flex-col" key={character.id}>
              <div className="self-center">
                <Image
                  src={character.image}
                  height={300}
                  width={300}
                  alt={character.name}
                />
              </div>
              <p className="text-center">{character.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Team.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default Team;
