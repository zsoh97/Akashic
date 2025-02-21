"use client";

import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
	styles: {
		global: {
			body: {
				bg: "warmWhite.50",
				color: "warmGray.900",
			},
		},
	},
	colors: {
		warmWhite: {
			50: "#FFFBF5",
			100: "#FFF4E6",
		},
		warmGray: {
			50: "#FAF9F7",
			100: "#F5F3F0",
			200: "#E8E6E1",
			300: "#D3CEC4",
			400: "#B8B2A7",
			500: "#A39E93",
			600: "#857F72",
			700: "#625D52",
			800: "#504A40",
			900: "#423D33",
		},
		sepia: {
			50: "#FCF9F5",
			100: "#F8E8D8",
			200: "#F3D5B5",
			300: "#EBC192",
			400: "#E2AC6F",
			500: "#D99748",
			600: "#B37A3B",
			700: "#8C5D2E",
			800: "#664321",
			900: "#402914",
		},
		sage: {
			50: "#F8FAF7",
			100: "#E9EFE6",
			200: "#D4DFD1",
			300: "#BDCEB9",
			400: "#A5BCA0",
			500: "#8EAB88",
			600: "#718C6B",
			700: "#556D4F",
			800: "#3A4D34",
			900: "#1E2E1A",
		},
	},
	components: {
		Button: {
			defaultProps: {
				colorScheme: "sepia",
			},
			variants: {
				primary: {
					bg: "sepia.500",
					color: "white",
					fontWeight: "600",
					px: "8",
					_hover: {
						bg: "sepia.600",
						transform: "translateY(-1px)",
						boxShadow: "lg",
					},
					_active: {
						bg: "sepia.700",
						transform: "translateY(0)",
					},
				},
				secondary: {
					bg: "transparent",
					color: "sepia.500",
					border: "2px solid",
					borderColor: "sepia.500",
					px: "8",
					_hover: {
						bg: "sepia.50",
						transform: "translateY(-1px)",
					},
					_active: {
						transform: "translateY(0)",
					},
				},
			},
		},
		Heading: {
			baseStyle: {
				color: "warmGray.900",
			},
		},
		Text: {
			baseStyle: {
				color: "warmGray.700",
			},
		},
	},
});
