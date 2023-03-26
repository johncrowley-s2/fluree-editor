import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";
import { darkTheme1 } from "../themes/darkTheme1";
import { darkTheme2 } from "../themes/darkTheme2";
import { flureeDarkTheme, flureeLightTheme } from "../themes/fluree";
import { lightTheme1 } from "../themes/lightTheme1";
import { lightTheme2 } from "../themes/lightTheme2";
import { Theme } from "../themes/types";

interface Props {
  children?: ReactNode;
}

const ThemeContext = createContext({
  theme: lightTheme1,
  handleChangeTheme: (e: ChangeEvent<HTMLSelectElement>) => {},
});

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>(flureeLightTheme);

  function handleChangeTheme(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "flureeLight") setTheme(flureeLightTheme);
    if (e.target.value === "flureeDark") setTheme(flureeDarkTheme);
    if (e.target.value === "light1") setTheme(lightTheme1);
    if (e.target.value === "light2") setTheme(lightTheme2);
    if (e.target.value === "dark1") setTheme(darkTheme1);
    if (e.target.value === "dark2") setTheme(darkTheme2);
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
