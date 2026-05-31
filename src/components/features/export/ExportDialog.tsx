import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildAndDownloadBundle,
  ExportAbortedError,
  Exporter,
  ExportProgress,
} from "services/export";

export interface ExportOption {
  /** Stable key persisted across renders; used as map key for selections. */
  key: string;
  /** Label shown in the checkbox. */
  label: string;
  /** Optional helper text under the label. */
  description?: string;
  /** Defaults to true. */
  defaultChecked?: boolean;
  /** When provided, the option is rendered disabled and unchecked. */
  disabledReason?: string;
}

export interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  /** Dialog heading, e.g. "Export Campaign Data". */
  title: string;
  /** Optional intro paragraph. */
  description?: string;
  /** Filename for the resulting .zip (no extension). */
  filenameStem: string;
  /** App version stamped into manifest.json. */
  appVersion: string;
  /** Source pointer stamped into manifest.json. */
  source: { type: "world" | "campaign" | "character"; id: string };
  /** Available categories. */
  options: ExportOption[];
  /**
   * Build the list of exporters for the selected keys. Called on submit.
   * Order matters — exporters run in array order.
   */
  buildExporters: (selectedKeys: Set<string>) => Exporter[];
  /**
   * When true, the dialog fires the export immediately on open and hides
   * the option checkboxes — used for single-category flows like World.
   */
  autoStart?: boolean;
}

export function ExportDialog(props: ExportDialogProps) {
  const {
    open,
    onClose,
    title,
    description,
    filenameStem,
    appVersion,
    source,
    options,
    buildExporters,
    autoStart,
  } = props;

  const [selected, setSelected] = useState<Set<string>>(() => initialSelection(options));
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset selection state whenever the option set changes (e.g. dialog reopens
  // for a different entity) but only when closed — avoid clobbering mid-run.
  useEffect(() => {
    if (!open && !busy) {
      setSelected(initialSelection(options));
      setProgress(null);
      setError(null);
    }
  }, [open, busy, options]);

  const enabledOptions = useMemo(
    () => options.filter((o) => !o.disabledReason),
    [options]
  );
  const hasSelection = enabledOptions.some((o) => selected.has(o.key));

  const handleToggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCancel = () => {
    if (busy) {
      abortRef.current?.abort();
    } else {
      onClose();
    }
  };

  const handleExport = async () => {
    if (!hasSelection || busy) return;

    setError(null);
    setBusy(true);
    setProgress({ stage: "Starting", current: 0, total: 1 });

    const controller = new AbortController();
    abortRef.current = controller;

    const selectedKeys = new Set(
      enabledOptions.filter((o) => selected.has(o.key)).map((o) => o.key)
    );

    try {
      const exporters = buildExporters(selectedKeys);
      await buildAndDownloadBundle({
        exporters,
        source,
        categories: [...selectedKeys].sort(),
        appVersion,
        filename: `${filenameStem}-${dateStamp()}.zip`,
        signal: controller.signal,
        onProgress: setProgress,
      });
      setBusy(false);
      abortRef.current = null;
      onClose();
    } catch (err) {
      setBusy(false);
      abortRef.current = null;
      if (err instanceof ExportAbortedError) {
        setProgress(null);
        return;
      }
      console.error("Export failed", err);
      setError(err instanceof Error ? err.message : "Export failed");
    }
  };

  // Auto-start on open for single-category flows.
  useEffect(() => {
    if (open && autoStart && !busy && !error && hasSelection) {
      void handleExport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoStart]);

  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.current / progress.total) * 100))
      : 0;

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Stack spacing={1} sx={{ display: autoStart ? "none" : undefined }}>
          {options.map((opt) => {
            const disabled = busy || !!opt.disabledReason;
            return (
              <Stack key={opt.key}>
                <FormControlLabel
                  disabled={disabled}
                  control={
                    <Checkbox
                      checked={!opt.disabledReason && selected.has(opt.key)}
                      onChange={() => handleToggle(opt.key)}
                    />
                  }
                  label={opt.label}
                />
                {(opt.description || opt.disabledReason) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ pl: 4, mt: -0.5 }}
                  >
                    {opt.disabledReason ?? opt.description}
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
        {busy && progress && (
          <Stack sx={{ mt: 3 }} spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {progress.stage} — {progress.current} / {progress.total}
            </Typography>
            <LinearProgress variant="determinate" value={percent} />
          </Stack>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          {busy ? "Cancel" : "Close"}
        </Button>
        {!autoStart && (
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={!hasSelection || busy}
          >
            Export
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function initialSelection(options: ExportOption[]): Set<string> {
  const set = new Set<string>();
  for (const o of options) {
    if (!o.disabledReason && o.defaultChecked !== false) {
      set.add(o.key);
    }
  }
  return set;
}

function dateStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
