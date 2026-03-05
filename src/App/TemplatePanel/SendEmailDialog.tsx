import React, { useState, useMemo } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { useDocument } from '../../documents/editor/EditorContext';
import { useSendEmails, type SendEmailsRequest, type UserSearchResponse } from '../../api/hooks';

import CountryMultiSelect from './SendEmailDialog/CountryMultiSelect';
import LanguageMultiSelect from './SendEmailDialog/LanguageMultiSelect';
import SelectedUsersDisplay from './SendEmailDialog/SelectedUsersDisplay';
import UserSearchTable from './SendEmailDialog/UserSearchTable';

type SendEmailDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SendEmailDialog({ open, onClose }: SendEmailDialogProps) {
  const document = useDocument();
  const sendEmails = useSendEmails();
  const [subject, setSubject] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResponse[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [includeUsersWithoutPreferredLanguage, setIncludeUsersWithoutPreferredLanguage] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate HTML from document
  const htmlContent = useMemo(() => {
    try {
      return renderToStaticMarkup(document, { rootBlockId: 'root' });
    } catch (error) {
      console.error('Failed to generate HTML:', error);
      return '';
    }
  }, [document]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSubject(value);
    if (value.trim().length === 0) {
      setSubjectError('Subject is required');
    } else if (value.length > 255) {
      setSubjectError('Subject is too long (max 255 characters)');
    } else {
      setSubjectError(null);
    }
  };

  const handleUserSelectionChange = (userIds: string[], newUsers: UserSearchResponse[] = []) => {
    setSelectedUserIds(userIds);
    // Add new users to selected users list
    if (newUsers.length > 0) {
      setSelectedUsers((prev) => {
        const existingIds = new Set(prev.map((u) => u.id));
        const toAdd = newUsers.filter((u) => !existingIds.has(u.id));
        return [...prev, ...toAdd];
      });
    }
    // Remove users that are no longer selected
    setSelectedUsers((prev) => prev.filter((u) => userIds.indexOf(u.id) !== -1));
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
  };

  const handleSend = async () => {
    // Validation
    if (subject.trim().length === 0) {
      setSubjectError('Subject is required');
      return;
    }
    if (subject.length > 255) {
      setSubjectError('Subject is too long (max 255 characters)');
      return;
    }
    const hasFilters =
      selectedUserIds.length > 0 ||
      selectedCountries.length > 0 ||
      selectedLanguages.length > 0 ||
      includeUsersWithoutPreferredLanguage;
    if (!hasFilters) {
      setErrorMessage('Please select at least one user or apply filters');
      return;
    }
    if (htmlContent.length === 0) {
      setErrorMessage('Failed to generate email HTML');
      return;
    }

    try {
      const payload: SendEmailsRequest = {
        html: htmlContent,
        subject: subject.trim(),
      };
      if (selectedUserIds.length > 0) {
        payload.userIds = selectedUserIds;
      }
      if (selectedLanguages.length > 0) {
        payload.preferredLanguage = selectedLanguages;
      }
      if (selectedCountries.length > 0) {
        payload.countryCode = selectedCountries;
      }
      if (includeUsersWithoutPreferredLanguage) {
        payload.includeUsersWithoutPreferredLanguage = true;
      }

      const response = await sendEmails.mutateAsync(payload);
      setSuccessMessage(
        `Email sent! Batch ID: ${response.batchId}, Sent: ${response.totalSent}, Failed: ${response.totalFailed}`
      );
      
      // Reset form and close after a delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to send email. Please try again.');
    }
  };

  const handleClose = () => {
    setSubject('');
    setSelectedUserIds([]);
    setSelectedUsers([]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setIncludeUsersWithoutPreferredLanguage(false);
    setSubjectError(null);
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            error={subjectError !== null}
            helperText={subjectError}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Recipients
          </Typography>

          <UserSearchTable
            selectedUserIds={selectedUserIds}
            onSelectionChange={handleUserSelectionChange}
          />

          <SelectedUsersDisplay
            users={selectedUsers.filter((user) => selectedUserIds.indexOf(user.id) !== -1)}
            onRemove={handleRemoveUser}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, mt: 3 }}>
            Filter Options
          </Typography>

          <CountryMultiSelect value={selectedCountries} onChange={setSelectedCountries} />

          <LanguageMultiSelect
            value={selectedLanguages}
            onChange={setSelectedLanguages}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={includeUsersWithoutPreferredLanguage}
                onChange={(e) => setIncludeUsersWithoutPreferredLanguage(e.target.checked)}
              />
            }
            label="Include users who have not set preferred language"
            sx={{ mt: 2, display: 'block' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={sendEmails.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={
              sendEmails.isPending ||
              subjectError !== null ||
              subject.trim().length === 0 ||
              !(
                selectedUserIds.length > 0 ||
                selectedCountries.length > 0 ||
                selectedLanguages.length > 0 ||
                includeUsersWithoutPreferredLanguage
              )
            }
          >
            {sendEmails.isPending ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      />

      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          '& .MuiSnackbarContent-root': { backgroundColor: 'error.main' },
        }}
      />
    </>
  );
}
