"use client";

import { ChakraProvider as ChakraUIProvider } from "@chakra-ui/react";
import { theme } from "@/theme";

export function ChakraProvider({ children }: { children: React.ReactNode }) {
	return <ChakraUIProvider theme={theme}>{children}</ChakraUIProvider>;
}
