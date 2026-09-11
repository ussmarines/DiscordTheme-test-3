# QA — Tally

Tested 2026-09-11 in real Discord Desktop, with BetterDiscord and Vencord loaded separately. This matrix describes the named scope, not every possible state of a component.

| Area | Dark | Light | Evidence / limits |
|---|---|---|---|
| Guild list | PASS | PASS | Native rail visible; selection retained. No forced unread/mention campaign. |
| Channels | PASS | PASS | Test server text and voice navigation rows. Threads/forum not exercised. |
| Chat | PASS | PASS | Six authorized demo messages: text, quote, code, link, embed, spoiler, reply and reaction. |
| Composer | PASS | PASS | Text entry/send on test server, focus ring, 1000×760 viewport. |
| Member list | PASS | PASS | Single-member test server; role-heavy lists not exercised. |
| Profiles | PARTIAL | PARTIAL | Own mini-profile opened; full profile and all premium variants not certified. |
| Context menus | PASS | PASS | Demo-message menu opened and dismissed; destructive actions not run. |
| Search | PASS | PASS | Server-scoped demo query and native result panel. |
| Inbox | PASS | PASS | Opens and renders. Private content excluded from screenshots. |
| Modals | PASS | PASS | Appearance and theme settings; upload/delete/permissions flows not executed. |
| Discord settings | PASS | PASS | Native Appearance controls and palette switch. |
| Vencord | PASS | PASS | Local theme recognition, plugin cards/switches, Online Themes form. External QuickCSS editor not tested. |
| BetterDiscord | PASS | PASS | Standalone 1.14.1, theme manager, switches, real client rendering. |
| Voice | NOT TESTED | NOT TESTED | Voice rows styled; calls, camera and screen-share not started. |
| Reduced motion | PASS | PASS | Browser media emulation resolves authored duration to 0ms. |
| Keyboard focus | PASS | PASS | Visible 2px outline after native Slate reset override. Not a full keyboard-navigation audit. |

## Validation

`npm test` parses CSS, checks supported literal declarations, enforces internal token definitions and budgets, rejects remote resources and exact hashed class selectors, validates metadata and compares dist against deterministic assembly. Palette text pairs exceed 4.5:1 and control boundaries 3:1. These are base-token tests, not a blanket WCAG certification.

No authored animation loops or remote asset requests. No measured FPS/RAM improvement is claimed. Glass is untested on accelerated hardware (the inspected machine has acceleration disabled).

## Corrections discovered during testing

- Discord's native Slate reset suppressed focus outlines; one documented important declaration restores them.
- Current settings and inbox DOM differ from older theming references; selectors were updated against the live client.
- Reply previews reuse message content IDs; the conversation treatment now explicitly excludes those previews.
- Clayloom's bubble padding initially conflicted with Discord's negative text indent; its own content blocks now reset that indent.
- Initial selector probes for loaded styles and inbox used obsolete assumptions; corrected probes are stored as final runtime evidence.

## Screenshots and privacy

The four PNG files are native captures. Account details are made transparent for capture only, without changing layout; the private guild rail is cropped. The captures depict authorized demo data, not actual private conversations. Privacy filters are testing-only and are not shipped in the CSS.

Evidence JSON contains only component metrics and theme state, never account identifiers or message content.

## Evidence interpretation

The core rendering and local theme-manager checks were run in both mods. Extended picker, own mini-profile and server-search probes were run in Vencord. JSON menu container color is not the item text color: native menu items set their own semantic foreground. One initial BetterDiscord spoiler probe read React state before its update; subsequent BD observations and the corrected asynchronous Vencord probe confirmed reveal behavior. No unobserved state is inferred from a successful CSS parse.

Reproduction: enable only this theme, select Cendres/Clair in Appearance, use an isolated server with authorized text/code/quote/embed/spoiler/reply/reaction examples, inspect core panels and settings, open/dismiss menus and inbox, search the server, and repeat at 1000×760 with keyboard focus and reduced-motion emulation. Do not reuse private conversations as fixtures.
