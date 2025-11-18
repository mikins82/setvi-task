import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ERROR_MESSAGES, UI_TEXT, LAYOUT } from "../../constants";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = ERROR_MESSAGES.GENERIC,
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: LAYOUT.ERROR_STATE_PADDING,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
          {UI_TEXT.RETRY_BUTTON}
        </Button>
      )}
    </Box>
  );
};

