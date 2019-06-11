module.exports = {
  extends: [`stylelint-config-standard`],

  rules: {
    "selector-list-comma-newline-after": null,
    "block-closing-brace-empty-line-before": null,
    "rule-empty-line-before": `always`,
    "declaration-empty-line-before": null,
    "font-family-name-quotes": `always-where-recommended`,
    "color-named": `always-where-possible`,
    "comment-empty-line-before": null,
    "comment-whitespace-inside": null,
    "function-url-quotes": `never`,
    "string-quotes": `single`,
    "declaration-no-important": true,
    "no-duplicate-selectors": true,
    // deprecated 8.0 [selector-no-id]
    "selector-max-id": 0,
    "number-max-precision": 2,
    "shorthand-property-no-redundant-values": true,
    "selector-no-qualifying-type": [true, { ignore: `attribute` }],
    // deprecated 8.0 [selector-no-universal]
    "selector-max-universal": 0,
    "selector-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    // deprecated 7.8.0
    // "root-no-standard-properties": true,
    "media-feature-name-case": `lower`,
    "number-no-trailing-zeros": true,
    "number-leading-zero": `never`,
    "value-keyword-case": `lower`,
    "no-extra-semicolons": true,
    "declaration-block-no-shorthand-property-overrides": true
  }
};
