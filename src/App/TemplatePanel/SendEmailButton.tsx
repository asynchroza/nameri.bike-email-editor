import React, { useState } from 'react';

import { SendOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import SendEmailDialog from './SendEmailDialog';

export default function SendEmailButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Tooltip title="Send Email">
        <IconButton onClick={handleOpen}>
          <SendOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <SendEmailDialog open={dialogOpen} onClose={handleClose} />
    </>
  );
}
