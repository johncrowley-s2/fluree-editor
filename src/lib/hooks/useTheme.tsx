import {
    ChangeEvent,
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";
import {
    altDarkTheme,
    altLightTheme,
    darkTheme,
    lightTheme,
    Theme
} from "../../themes";

interface Props {
  children?: ReactNode;
}

const ThemeContext = createContext({
  theme: lightTheme,
  handleChangeTheme: (e: ChangeEvent<HTMLSelectElement>) => {},
});

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  function handleChangeTheme(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "light1") setTheme(lightTheme);
    if (e.target.value === "light2") setTheme(altLightTheme);
    if (e.target.value === "dark1") setTheme(darkTheme);
    if (e.target.value === "dark2") setTheme(altDarkTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  return useContext(ThemeContext);
}
