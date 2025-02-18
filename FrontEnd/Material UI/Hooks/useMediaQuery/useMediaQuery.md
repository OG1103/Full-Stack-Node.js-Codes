# useMediaQuery Hook in Material-UI

## Introduction

The `useMediaQuery` hook enables conditional rendering and styling based on screen size.

## Importing `useMediaQuery`

```jsx
import useMediaQuery from "@mui/material/useMediaQuery";
```

## Basic Usage

```jsx
const isSmallScreen = useMediaQuery("(max-width:600px)");
```

## Using `useTheme` with `useMediaQuery`

```jsx
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
```

## `theme.breakpoints` Options

| Method                                  | Description                                  |
| --------------------------------------- | -------------------------------------------- |
| `theme.breakpoints.up('sm')`            | Applies styles for screens larger than `sm`  |
| `theme.breakpoints.down('md')`          | Applies styles for screens smaller than `md` |
| `theme.breakpoints.between('sm', 'md')` | Applies styles between `sm` and `md`         |
| `theme.breakpoints.only('lg')`          | Applies styles only for `lg` screens         |

## Example: Responsive Component

```jsx
import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ResponsiveComponent = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return <div style={{ fontSize: isSmallScreen ? "12px" : "18px" }}>Responsive Text</div>;
};
```

## Conclusion

The `useMediaQuery` hook enables flexible and adaptive designs based on Material-UI’s breakpoints.
