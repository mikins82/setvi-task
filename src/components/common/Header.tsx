import { Typography } from "@mui/material";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
      {title}
    </Typography>
  );
}

