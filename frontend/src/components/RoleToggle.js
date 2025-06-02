import React from 'react';
import { ToggleButton, ToggleButtonGroup} from "@mui/material";

export default function RoleToggle({ role, setRole }) {
    return (
      <ToggleButtonGroup
          value={role}
          exclusive
          size="small"
          sx={{mb: 2 }}
          onChange={(_, newRole) => {
              if (newRole !== null) setRole(newRole);
          }}>
          <ToggleButton value="admin">Admin</ToggleButton>
          <ToggleButton value="user">User</ToggleButton>
      </ToggleButtonGroup>
    );
}