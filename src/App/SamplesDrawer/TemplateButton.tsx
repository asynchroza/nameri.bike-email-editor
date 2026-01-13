import React from 'react';

import { Button, CircularProgress } from '@mui/material';

import { resetDocument, setCurrentTemplateId } from '../../documents/editor/EditorContext';
import type { TEditorConfiguration } from '../../documents/editor/core';

type TemplateButtonProps = {
  template: {
    id: number;
    name: string;
    configuration: unknown;
  };
};

export default function TemplateButton({ template }: TemplateButtonProps) {
  const handleClick = () => {
    // Cast configuration to TEditorConfiguration and load it
    resetDocument(template.configuration as TEditorConfiguration);
    // Set current template ID
    setCurrentTemplateId(template.id);
    
    // Update URL with templateId
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('templateId', template.id.toString());
    const newSearch = urlParams.toString();
    const newUrl = `${window.location.pathname}?${newSearch}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <Button size="small" onClick={handleClick}>
      {template.name}
    </Button>
  );
}
