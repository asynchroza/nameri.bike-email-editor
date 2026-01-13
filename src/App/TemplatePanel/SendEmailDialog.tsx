import React, { useState, useMemo } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { useDocument } from '../../documents/editor/EditorContext';
import { useSendEmails, type UserSearchResponse } from '../../api/hooks';
import { LANGUAGE_OPTIONS } from '../../utils/countryMapping';

import CountryMultiSelect from './SendEmailDialog/CountryMultiSelect';
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
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
    setSelectedUsers((prev) => prev.filter((u) => userIds.includes(u.id)));
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
    if (selectedUserIds.length === 0 && selectedCountries.length === 0 && !selectedLanguage) {
      setErrorMessage('Please select at least one user or apply filters');
      return;
    }
    if (htmlContent.length === 0) {
      setErrorMessage('Failed to generate email HTML');
      return;
    }

    try {
      // Build request payload
      const payload: {
        html: string;
        subject: string;
        userIds: string[];
        preferredLanguage?: string;
        countryCode?: string;
      } = {
        html: htmlContent,
        subject: subject.trim(),
        userIds: selectedUserIds,
      };

      // Add filters if selected
      if (selectedLanguage) {
        payload.preferredLanguage = selectedLanguage;
      }
      // Note: Schema shows countryCode as single string, but we have multiple
      // Sending first selected country for now
      if (selectedCountries.length > 0) {
        payload.countryCode = selectedCountries[0];
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
    setSelectedLanguage('');
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
            users={selectedUsers.filter((user) => selectedUserIds.includes(user.id))}
            onRemove={handleRemoveUser}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, mt: 3 }}>
            Filter Options
          </Typography>

          <CountryMultiSelect value={selectedCountries} onChange={setSelectedCountries} />

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Preferred Language (Optional)</InputLabel>
            <Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              label="Preferred Language (Optional)"
            >
              <MenuItem value="">None</MenuItem>
              {LANGUAGE_OPTIONS.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCountries.length > 1 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Note: Only the first selected country will be sent to the backend. Multiple country support may require backend changes.
            </Alert>
          )}
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
              (selectedUserIds.length === 0 && selectedCountries.length === 0 && !selectedLanguage)
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
      />

      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'error.main' } }}
      />
    </>
  );
}
