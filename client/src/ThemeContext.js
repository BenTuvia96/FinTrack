import { createContext } from "react";

const ThemeContext = createContext({
  theme: "light", // default value
  toggleTheme: () => {}, // default function, will be overridden
});

export default ThemeContext;
