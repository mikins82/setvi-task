import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useQuery } from "@tanstack/react-query";
import { fetchQuotes, mergeQuotesIntoText } from "../../api/quotes";
import { useTypewriter } from "../../hooks/useTypewriter";
import { getProductSummary, saveProductSummary } from "../../utils/storage";
import { UI_TEXT, TIMING, A11Y, QUERY_KEYS, QUERY_CONFIG, SYMBOLS } from "../../constants";

interface AISummaryProps {
  productId: number;
}

export const AISummary: React.FC<AISummaryProps> = ({ productId }) => {
  const [summaryText, setSummaryText] = useState<string>("");
  const [shouldGenerate, setShouldGenerate] = useState<boolean>(false);

  const { displayedText, isComplete, isTyping, start } = useTypewriter(
    summaryText,
    { speed: TIMING.TYPEWRITER_SPEED, punctuationDelay: TIMING.TYPEWRITER_PUNCTUATION_DELAY }
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
    queryKey: [QUERY_KEYS.QUOTES],
    queryFn: fetchQuotes,
    enabled: false, // Don't fetch automatically
    staleTime: QUERY_CONFIG.STALE_TIME_INFINITY,
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
      <Box role={A11Y.ROLE.REGION} aria-label={UI_TEXT.AI_SUMMARY_REGION}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoFixHighIcon aria-hidden="true" /> {UI_TEXT.AI_SUMMARY}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }} role={A11Y.ROLE.ARTICLE}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {summaryText}
          </Typography>
        </Paper>
        <Button
          variant="outlined"
          onClick={handleGenerate}
          startIcon={<AutoFixHighIcon />}
          sx={{ mt: 2 }}
          aria-label={UI_TEXT.REGENERATE_SUMMARY_ARIA}
        >
          {UI_TEXT.REGENERATE_SUMMARY}
        </Button>
      </Box>
    );
  }

  return (
    <Box role={A11Y.ROLE.REGION} aria-label={UI_TEXT.AI_SUMMARY_REGION}>
      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoFixHighIcon aria-hidden="true" /> {UI_TEXT.AI_SUMMARY}
      </Typography>
      
      {!isTyping && !displayedText && (
        <Button
          variant="contained"
          onClick={handleGenerate}
          startIcon={<AutoFixHighIcon />}
          fullWidth
          aria-label={UI_TEXT.GENERATE_SUMMARY_ARIA}
        >
          {UI_TEXT.GENERATE_SUMMARY}
        </Button>
      )}
      
      {(isTyping || displayedText) && (
        <Paper 
          variant="outlined" 
          sx={{ p: 2, bgcolor: "grey.50", position: "relative" }}
          role={A11Y.ROLE.STATUS}
          aria-live={A11Y.ARIA_LIVE.POLITE}
          aria-busy={isTyping}
          aria-label={isTyping ? UI_TEXT.GENERATING_SUMMARY : UI_TEXT.SUMMARY_COMPLETE}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {displayedText}
            {!isComplete && (
              <Box
                component="span"
                aria-hidden="true"
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
                {SYMBOLS.CURSOR}
              </Box>
            )}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

