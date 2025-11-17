import antfu from "@antfu/eslint-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = antfu(
  {
    stylistic: false,
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
            ["parent-type", "sibling-type", "index-type", "internal-type"],

            ["builtin", "external"],
            ["internal"],
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
            reserved: ["key", "ref"],
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
    },
  },
);

export default eslintConfig;
