import React, { useState } from 'react';

import { SaveAsOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip } from '@mui/material';

import { useCreateEmailTemplate } from '../../api/hooks';
import { useDocument } from '../../documents/editor/EditorContext';

import SaveTemplateDialog from './SaveTemplateDialog';

export default function SaveAsNewTemplateButton() {
  const document = useDocument();
  const createTemplate = useCreateEmailTemplate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (name: string, description: string) => {
    try {
      await createTemplate.mutateAsync({
        name,
        description: description || undefined,
        configuration: document,
      });
      setMessage('Template saved successfully');
      setError(null);
      setDialogOpen(false);
    } catch (err) {
      setError('Failed to save template');
      setMessage(null);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Tooltip title="Save as new template">
        <IconButton onClick={handleClick} disabled={createTemplate.isPending}>
          <SaveAsOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <SaveTemplateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message !== null}
        onClose={handleCloseMessage}
        message={message}
        autoHideDuration={3000}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error !== null}
        onClose={handleCloseError}
        message={error}
        autoHideDuration={5000}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'error.main' } }}
      />
    </>
  );
}
