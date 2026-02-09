import React, { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Stack, useTheme } from '@mui/material';

import { useEmailTemplates } from '../api/hooks';
import { seedTemplates } from '../api/seedTemplates';
import { resetDocument, setCurrentTemplateId, useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';
import type { TEditorConfiguration } from '../documents/editor/core';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

export default function App() {
  const queryClient = useQueryClient();
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const { data: templates } = useEmailTemplates();
  const templateLoadedRef = useRef(false);
  const seedAttemptedRef = useRef(false);

  // Seed sample templates into the database when none exist
  useEffect(() => {
    if (templates === undefined || templates.length > 0 || seedAttemptedRef.current) return;
    seedAttemptedRef.current = true;
    seedTemplates().then(() => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    });
  }, [templates, queryClient]);

  // Load template from query parameter on initial load
  useEffect(() => {
    if (templates && !templateLoadedRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const templateIdParam = urlParams.get('template') || urlParams.get('templateId');
      
      if (templateIdParam) {
        const templateId = parseInt(templateIdParam, 10);
        if (!isNaN(templateId)) {
          const template = templates.find((t) => t.id === templateId);
          if (template) {
            resetDocument(template.configuration as TEditorConfiguration);
            setCurrentTemplateId(template.id);
            templateLoadedRef.current = true;
            
            // Update URL to use templateId (normalize to templateId)
            urlParams.delete('template');
            urlParams.set('templateId', templateId.toString());
            const newSearch = urlParams.toString();
            const newUrl = `${window.location.pathname}?${newSearch}${window.location.hash}`;
            window.history.replaceState({}, '', newUrl);
          }
        }
      } else {
        // Mark as loaded even if no template param to prevent re-checking
        templateLoadedRef.current = true;
      }
    }
  }, [templates]);

  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  return (
    <>
      <InspectorDrawer />
      <SamplesDrawer />

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel />
      </Stack>
    </>
  );
}
