import React from 'react';

import { AddOutlined } from '@mui/icons-material';
import { Alert, Button, CircularProgress, Drawer, Stack, Typography } from '@mui/material';

import { useEmailTemplates } from '../../api/hooks';
import EMPTY_EMAIL_MESSAGE from '../../getConfiguration/sample/empty-email-message';
import { resetDocument, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import TemplateButton from './TemplateButton';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const { data: templates, isLoading, error } = useEmailTemplates();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} sx={{ height: '100%', overflow: 'auto' }}>
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            Nameri.Bike Email Marketing
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => {
              resetDocument(EMPTY_EMAIL_MESSAGE);
              // Remove templateId from URL when starting new email
              const urlParams = new URLSearchParams(window.location.search);
              urlParams.delete('templateId');
              urlParams.delete('template');
              const newSearch = urlParams.toString();
              const newUrl = newSearch
                ? `${window.location.pathname}?${newSearch}${window.location.hash}`
                : `${window.location.pathname}${window.location.hash}`;
              window.history.pushState({}, '', newUrl);
            }}
            sx={{ mb: 1 }}
          >
            New Email
          </Button>

          {isLoading && (
            <Stack alignItems="center" py={2}>
              <CircularProgress size={24} />
            </Stack>
          )}

          {error && (
            <Alert severity="error" sx={{ mx: 0.75 }}>
              Failed to load templates
            </Alert>
          )}

          {templates && templates.length > 0 && (
            <Stack alignItems="flex-start">
              {templates.map((template) => (
                <TemplateButton key={template.id} template={template} />
              ))}
            </Stack>
          )}

          {templates && templates.length === 0 && !isLoading && (
            <Typography variant="body2" color="text.secondary" sx={{ px: 0.75 }}>
              No templates available
            </Typography>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
}
