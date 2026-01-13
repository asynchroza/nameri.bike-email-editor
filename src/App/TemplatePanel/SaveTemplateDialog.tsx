import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

type SaveTemplateDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
};

export default function SaveTemplateDialog({
  open,
  onClose,
  onSubmit,
  initialName = '',
  initialDescription = '',
}: SaveTemplateDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    if (value.trim().length === 0) {
      setNameError('Name is required');
    } else if (value.length > 255) {
      setNameError('Name is too long (max 255 characters)');
    } else {
      setNameError(null);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length === 0) {
      setNameError('Name is required');
      return;
    }
    if (name.length > 255) {
      setNameError('Name is too long (max 255 characters)');
      return;
    }
    onSubmit(name.trim(), description.trim() || '');
  };

  const handleClose = () => {
    setName(initialName);
    setDescription(initialDescription);
    setNameError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Save Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            error={nameError !== null}
            helperText={nameError}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
            helperText="Optional description for this template"
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={nameError !== null || name.trim().length === 0}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
