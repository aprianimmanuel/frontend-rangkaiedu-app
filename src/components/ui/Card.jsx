import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography } from '@mui/material';

const Card = ({ 
  title, 
  children, 
  actions, 
  headerProps = {}, 
  contentProps = {}, 
  actionsProps = {},
  ...props 
}) => {
  return (
    <MuiCard {...props}>
      {title && (
        <CardHeader 
          title={title}
          {...headerProps}
        />
      )}
      <CardContent {...contentProps}>
        {children}
      </CardContent>
      {actions && (
        <CardActions {...actionsProps}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;