import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from './client';

// Email Template Types
export type EmailTemplateResponse = {
  id: number;
  name: string;
  description: string | null;
  configuration: unknown; // TEditorConfiguration type
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmailTemplateRequest = {
  name: string;
  description?: string;
  configuration: unknown;
};

export type UpdateEmailTemplateRequest = {
  id: number;
  name: string;
  description?: string;
  configuration: unknown;
};

// Hook to fetch all email templates
export function useEmailTemplates() {
  return useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => apiRequest<EmailTemplateResponse[]>('/marketing/emails/templates'),
  });
}

// Hook to create an email template
export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmailTemplateRequest) =>
      apiRequest<EmailTemplateResponse>('/marketing/emails/templates', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      // Invalidate and refetch templates after creation
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });
}

// Hook to update an email template
export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmailTemplateRequest) =>
      apiRequest<EmailTemplateResponse>('/marketing/emails/templates', {
        method: 'PUT',
        body: data,
      }),
    onSuccess: () => {
      // Invalidate and refetch templates after update
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });
}
