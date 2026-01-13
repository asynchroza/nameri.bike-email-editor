import React, { useState } from 'react';

import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip } from '@mui/material';

import { useCurrentTemplateId, useDocument } from '../../documents/editor/EditorContext';
import { useEmailTemplates, useUpdateEmailTemplate } from '../../api/hooks';

export default function UpdateTemplateButton() {
  const currentTemplateId = useCurrentTemplateId();
  const document = useDocument();
  const { data: templates } = useEmailTemplates();
  const updateTemplate = useUpdateEmailTemplate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!currentTemplateId || !templates) {
      return;
    }

    // Find the current template to get its name and description
    const currentTemplate = templates.find((t) => t.id === currentTemplateId);
    if (!currentTemplate) {
      setError('Template not found');
      return;
    }

    try {
      await updateTemplate.mutateAsync({
        id: currentTemplateId,
        name: currentTemplate.name,
        description: currentTemplate.description || undefined,
        configuration: document,
      });
      setMessage('Template updated successfully');
      setError(null);
    } catch (err) {
      setError('Failed to update template');
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
      <Tooltip title="Update template">
        <span>
          <IconButton onClick={handleClick} disabled={!currentTemplateId || updateTemplate.isPending}>
            <SaveOutlined fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
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
