import React from 'react';
import ActivityChart from './components/ActivityChart';
import { Container, Title } from './components/StyledComponents';

// Main application component
const App: React.FC = () => {
  return (
    // Container for the entire application
    <Container>
      {/* Title of the application */}
      <Title>Developer Activity Dashboard</Title>
      {/* ActivityChart component displaying the chart */}
      <ActivityChart />
    </Container>
  );
};

export default App;
