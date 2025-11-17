import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useQuery } from "@tanstack/react-query";
import { fetchQuotes, mergeQuotesIntoText } from "../../api/quotes";
import { useTypewriter } from "../../hooks/useTypewriter";
import { getProductSummary, saveProductSummary } from "../../utils/storage";

interface AISummaryProps {
  productId: number;
}

export const AISummary: React.FC<AISummaryProps> = ({ productId }) => {
  const [summaryText, setSummaryText] = useState<string>("");
  const [shouldGenerate, setShouldGenerate] = useState<boolean>(false);

  const { displayedText, isComplete, isTyping, start } = useTypewriter(
    summaryText,
    { speed: 30, punctuationDelay: 150 }
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getProductSummary(productId);
    if (saved) {
      setSummaryText(saved);
    }
  }, [productId]);

  // Fetch quotes
  const { refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    enabled: false, // Don't fetch automatically
    staleTime: Infinity, // Cache forever
  });

  const handleGenerate = async () => {
    setShouldGenerate(true);
    const result = await refetch();
    if (result.data) {
      const text = mergeQuotesIntoText(result.data.quotes);
      setSummaryText(text);
      saveProductSummary(productId, text);
      start();
    }
  };

  if (summaryText && !isTyping && !shouldGenerate) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoFixHighIcon /> AI Summary
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {summaryText}
          </Typography>
        </Paper>
        <Button
          variant="outlined"
          onClick={handleGenerate}
          startIcon={<AutoFixHighIcon />}
          sx={{ mt: 2 }}
        >
          Regenerate Summary
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoFixHighIcon /> AI Summary
      </Typography>
      
      {!isTyping && !displayedText && (
        <Button
          variant="contained"
          onClick={handleGenerate}
          startIcon={<AutoFixHighIcon />}
          fullWidth
        >
          Generate Summary
        </Button>
      )}
      
      {(isTyping || displayedText) && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", position: "relative" }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {displayedText}
            {!isComplete && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "2px",
                  height: "1em",
                  bgcolor: "primary.main",
                  ml: 0.5,
                  animation: "blink 1s infinite",
                  "@keyframes blink": {
                    "0%, 50%": { opacity: 1 },
                    "51%, 100%": { opacity: 0 },
                  },
                }}
              >
                |
              </Box>
            )}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

