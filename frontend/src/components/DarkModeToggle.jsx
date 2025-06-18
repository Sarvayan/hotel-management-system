import React from "react";
import { useTheme } from "./ThemeContext"; 
const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); 

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-700"
    >
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
