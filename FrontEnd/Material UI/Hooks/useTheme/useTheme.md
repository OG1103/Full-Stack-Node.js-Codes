# useTheme Hook in Material-UI

## Introduction
The `useTheme` hook in Material-UI provides access to the theme object, enabling dynamic styling and responsive design.

## Importing `useTheme`
```jsx
import { useTheme } from '@mui/material/styles';
```

## Basic Usage
```jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const MyComponent = () => {
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.primary.main }}>
      Primary color from theme
    </Typography>
  );
};

export default MyComponent;
```

## Theme Attributes & Options

### 1. `palette` (Color Scheme)
Controls colors across the app.

```jsx
const primaryColor = theme.palette.primary.main;
const secondaryColor = theme.palette.secondary.main;
const textColor = theme.palette.text.primary;
```

### 2. `typography`
Controls font styles.

```jsx
const fontSize = theme.typography.h6.fontSize;
const fontFamily = theme.typography.fontFamily;
```

### 3. `spacing`
Defines spacing scale.

```jsx
const padding = theme.spacing(2); // Equivalent to 16px
```

### 4. `breakpoints`
Enables responsive styling.

```jsx
const isMobile = theme.breakpoints.down('sm');
```

## Example: Custom Styles Using `useTheme`
```jsx
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = () => {
  const theme = useTheme();
  return (
    <Button sx={{ backgroundColor: theme.palette.primary.main }}>
      Themed Button
    </Button>
  );
};
```

## Conclusion
The `useTheme` hook provides full access to theme properties for creating consistent, customizable, and responsive Material-UI designs.
