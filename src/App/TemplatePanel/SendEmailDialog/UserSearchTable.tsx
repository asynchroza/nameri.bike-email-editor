import React, { useState, useEffect } from 'react';

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { useSearchUsers, type UserSearchResponse } from '../../../api/hooks';

type UserSearchTableProps = {
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[], users: UserSearchResponse[]) => void;
};

export default function UserSearchTable({ selectedUserIds, onSelectionChange }: UserSearchTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: users, isLoading, error } = useSearchUsers({
    q: debouncedQuery,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!users) return;

    if (event.target.checked) {
      const allIds = users.map((user) => user.id);
      const newSelection = [...new Set([...selectedUserIds, ...allIds])];
      onSelectionChange(newSelection, users);
    } else {
      const currentPageIds = users.map((user) => user.id);
      const newSelection = selectedUserIds.filter((id) => !currentPageIds.includes(id));
      // Remove users that are no longer selected
      const remainingUsers = users.filter((user) => newSelection.includes(user.id));
      onSelectionChange(newSelection, remainingUsers);
    }
  };

  const handleSelectRow = (userId: string) => {
    if (!users) return;
    
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (selectedUserIds.includes(userId)) {
      const newSelection = selectedUserIds.filter((id) => id !== userId);
      onSelectionChange(newSelection, []);
    } else {
      const newSelection = [...selectedUserIds, userId];
      onSelectionChange(newSelection, [user]);
    }
  };

  const isAllSelected = users && users.length > 0 && users.every((user) => selectedUserIds.includes(user.id));
  const isIndeterminate = users && users.some((user) => selectedUserIds.includes(user.id)) && !isAllSelected;

  return (
    <Box>
      <TextField
        fullWidth
        label="Search Users"
        placeholder="Enter name or email to search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      {debouncedQuery.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Enter a search query to find users
        </Typography>
      )}

      {debouncedQuery.length > 0 && isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {debouncedQuery.length > 0 && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to search users
        </Alert>
      )}

      {debouncedQuery.length > 0 && users && users.length === 0 && !isLoading && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No users found
        </Typography>
      )}

      {debouncedQuery.length > 0 && users && users.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  selected={selectedUserIds.includes(user.id)}
                  onClick={() => handleSelectRow(user.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedUserIds.includes(user.id)} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.preferredLanguage || '-'}</TableCell>
                  <TableCell>{user.countryCode || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={-1} // Total count not available from API
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            labelDisplayedRows={({ from, to, count }) => {
              if (users && users.length < rowsPerPage) {
                return `${from}-${to} of ${from + users.length - 1}`;
              }
              return `${from}-${to} of ${count !== -1 ? count : 'more than ' + to}`;
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
}
