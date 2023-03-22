const ThemeContext = createContext({
  mode: defaultMode,
  setMode: (mode) => ,
});

export const useTheme = () => React.useContext(ThemeContext);
