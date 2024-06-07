import React from 'react';
import ActivityChart from './components/ActivityChart';
import { Container, Title } from './components/StyledComponents';

const App: React.FC = () => {
  return (
    <Container>
      <Title>Developer Activity Dashboard</Title>
      <ActivityChart />
    </Container>
  );
};

export default App;
