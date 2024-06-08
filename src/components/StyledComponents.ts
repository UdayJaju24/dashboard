import styled from 'styled-components';

// Styled component for the main container
export const Container = styled.div`
  display: flex;               // Use flexbox for layout
  flex-direction: column;      // Arrange children in a column
  align-items: center;         // Center children horizontally
  margin: 20px;                // Add a margin around the container
`;

// Styled component for the title
export const Title = styled.h1`
  font-size: 2rem;             // Set the font size of the title
  margin-bottom: 20px;         // Add a margin below the title
`;
