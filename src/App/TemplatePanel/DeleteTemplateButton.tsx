import React, { useState } from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
} from '@mui/material';

import { useCurrentTemplateId } from '../../documents/editor/EditorContext';

export default function DeleteTemplateButton() {
  const currentTemplateId = useCurrentTemplateId();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = () => {
    // No-op for now - endpoint not implemented yet
    setMessage('Delete functionality will be available when the endpoint is implemented');
    setDialogOpen(false);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <>
      <Tooltip title="Delete template">
        <span>
          <IconButton onClick={handleClick} disabled={!currentTemplateId}>
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message !== null}
        onClose={handleCloseMessage}
        message={message}
        autoHideDuration={3000}
      />
    </>
  );
}
