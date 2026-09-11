# Architecture

The build concatenates an explicit module list: public options, independent dark/light palettes, semantic bridge, base, surfaces, theme-specific layout, client integrations and accessibility. Each repository builds independently. No browser JavaScript is shipped.

The CSS imports no assets. Logo SVG is used only by the README. css-tree is a small development-only parser; Node built-ins assemble the theme. Validation checks CSS parsing and literal declaration grammar (values containing var() require runtime resolution), token references, file size, distribution reproducibility, metadata, URLs, exact hashed selectors and excessive important declarations. Runtime QA remains a separate gate.

## Distribution

The complete dist file works offline and can be fetched by Vencord Online Themes. No Pages deployment or import loader is required. Raw URLs are used for Vencord fetching and downloads, not CSS @import (MIME behavior differs). Local installs are explicitly updated by replacing the file.

## Donation

Set PAYPAL_DONATION_URL in theme.json to a real HTTPS PayPal destination. The build refuses other hosts and regenerates the @donate field and README badge. The default null produces neither a fake link nor CSS-injected UI.
