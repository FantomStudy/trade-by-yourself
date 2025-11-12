import antfu from "@antfu/eslint-config";
import pluginReact from "eslint-plugin-react";
import pluginQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = antfu(
  {
    stylistic: false,
    typescript: true,
    react: true,
    nextjs: true,
    jsx: {
      a11y: true,
    },
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    name: "fantomstudy/rewrite",
    rules: {
      "antfu/top-level-function": "off",
      "no-console": "off",
      "eslint-comments/no-unlimited-disable": "off",
      "node/prefer-global/process": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  {
    name: "fantomstudy/react",
    plugins: {
      "fantomstudy-react": pluginReact,
    },
    rules: {
      ...Object.entries(pluginReact.configs.recommended.rules).reduce(
        (acc, [key, value]) => {
          acc[key.replace("react", "fantomstudy-react")] = value;
          return acc;
        },
        {},
      ),
      "fantomstudy-react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  {
    name: "fantomstudy/perfectionist",
    rules: {
      "perfectionist/sort-array-includes": [
        "error",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "type",
            ["builtin", "external"],
            "internal-type",
            ["internal"],
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "style",
            "side-effect-style",
            "unknown",
          ],
          internalPattern: ["^~/.*", "^@/.*"],
          newlinesBetween: "always",
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          customGroups: [
            {
              groupName: "top",
              selector: "property",
              elementNamePattern: "^(?:id|name)$",
            },
          ],
          groups: ["top", "unknown", "method", "multiline"],
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          customGroups: [
            {
              groupName: "top",
              selector: "property",
              elementNamePattern: "^(?:id|name)$",
            },
          ],
          groups: ["top", "unknown", "method", "multiline"],
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          customGroups: {
            callback: "on*",
            reserved: ["key", "ref", "type"],
          },
          groups: ["shorthand", "reserved", "multiline", "unknown", "callback"],
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          groups: [
            "conditional",
            "function",
            "import",
            "intersection",
            "keyword",
            "literal",
            "named",
            "object",
            "operator",
            "tuple",
            "union",
            "nullish",
          ],
          order: "asc",
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-intersection-types": [
        "error",
        {
          groups: [
            "conditional",
            "function",
            "import",
            "intersection",
            "keyword",
            "literal",
            "named",
            "object",
            "operator",
            "tuple",
            "union",
            "nullish",
          ],
          specialCharacters: "keep",
          order: "asc",
          type: "alphabetical",
        },
      ],
    },
  },
);

export default eslintConfig;
