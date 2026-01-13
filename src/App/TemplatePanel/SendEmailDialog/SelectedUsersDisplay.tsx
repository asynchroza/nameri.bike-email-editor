import React from 'react';

import { Cancel } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';

import type { UserSearchResponse } from '../../../api/hooks';

type SelectedUsersDisplayProps = {
  users: UserSearchResponse[];
  onRemove: (userId: string) => void;
};

export default function SelectedUsersDisplay({ users, onRemove }: SelectedUsersDisplayProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Selected Users ({users.length})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {users.map((user) => (
          <Chip
            key={user.id}
            label={`${user.name} (${user.email})`}
            onDelete={() => onRemove(user.id)}
            deleteIcon={<Cancel />}
            size="small"
          />
        ))}
      </Stack>
    </Box>
  );
}
