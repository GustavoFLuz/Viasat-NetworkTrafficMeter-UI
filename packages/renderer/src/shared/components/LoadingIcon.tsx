import {Box, CircularProgress} from '@mui/material';
import React from 'react';

type LoadingIconProps = {
  size: string;
};

export const LoadingIcon: React.FC<LoadingIconProps> = ({size}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'absolute',
        top: '45%',
        left: '50%',
        translate: '-50% -50%',
      }}
    >
      <CircularProgress
        size="100%"
        sx={{color: 'neutral.gray'}}
      />
    </Box>
  );
};
