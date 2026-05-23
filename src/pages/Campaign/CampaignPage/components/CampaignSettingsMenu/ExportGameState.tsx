import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography } from '@mui/material';
import { exportGameState } from '../../../../../api-calls/exportGameState';
import { useStore } from "stores/store";

export function ExportGameState({ open, onClose }: { open: boolean; onClose: () => void }) {
  const campaigns = useStore((store) => Object.values(store.campaigns.campaignMap));
  const characters = useStore((store) =>
    Object.entries(store.characters.characterMap).map(([id, character]) => ({
      ...character,
      id
    }))
  );
  const assetMap = useStore((store) => store.rules.assetMaps.assetMap);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const exportData = {
        campaigns,
        characters,
        assetMap,
        // Add other global state as needed
      };
      const gameState = await exportGameState(exportData);
      const blob = new Blob([JSON.stringify(gameState)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game-state.json';
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      setError('Failed to export game state.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Export Game State</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          This will export your complete game state including all campaigns,
          characters, and associated data into a JSON file for backup purposes.
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleExport} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
