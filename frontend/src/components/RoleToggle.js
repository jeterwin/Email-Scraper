import React from 'react';
import { ToggleButton, ToggleButtonGroup} from "@mui/material";

export default function RoleToggle({ view, setView }) {
    return (
      <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          sx={{mx: 1 }}
          onChange={(_, newView) => {
              if (newView !== null) setView(newView);
              localStorage.setItem('view', newView);
          }}>
          <ToggleButton value="admin">Admin</ToggleButton>
          <ToggleButton value="user">User</ToggleButton>
      </ToggleButtonGroup>
    );
}