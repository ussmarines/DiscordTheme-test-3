# Compatibility

Test date: 2026-09-11. Discord Desktop 1.0.9257, Electron 42.11.1 / Chromium 148.0.7778.280 on Windows, hardware acceleration disabled.

- BetterDiscord 1.14.1: installed and tested on its own; all three themes recognized, enabled and rendered in light/dark.
- Vencord: installed local client; theme manager, plugins, online-theme screen, live remote loading and core Discord checked. The installed Vencord build identifier was not recorded; the Discord/Electron versions above were recorded.
- BetterDiscord and Vencord were tested sequentially. Vencord's bootstrap was backed up, replaced temporarily by the original Discord bootstrap for BD installation, and restored byte-for-byte. Credentials were not read or modified.
- CSS requires a current Discord Chromium build supporting relative HSL colors. The inspected client supports the syntax. Saturation uses Discord's saturation factor.
- Light and dark are supported. Nitro gradients, high-contrast OS combinations, every role palette and older clients are not certified.

## Boundaries

Themes cannot guarantee selectors across Discord updates. Class prefixes remain implementation details; see SELECTOR-MAP.md. Semantic variables provide the fallback palette if a component selector stops matching.

Official catalogue acceptance is not claimed. These are independent GitHub distributions. No BetterDiscord listing was submitted.
