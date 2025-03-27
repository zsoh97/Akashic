"use client";

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export function ColorModeToggle() {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FiMoon, FiSun);
  const nextMode = useColorModeValue("dark", "light");
  
  return (
    <IconButton
      aria-label={`Switch to ${nextMode} mode`}
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      size="md"
      rounded="full"
    />
  );
} 