# Selector map — Tally

Reviewed against Discord Desktop 1.0.9257 on 2026-09-11. This inventory records shipped hooks, not a claim that every state was exercised. See [QA](QA.md) and its evidence files for runtime scope.

## Selection strategy

1. Discord semantic custom properties supply the base palette, including controls, badges, scrollbars and native message states. Those property names are also internal contracts and can change.
2. ARIA roles describe menus, dialogs, controls and focus without hashed classes. A role can cover several components; rules only set surface properties and preserve functionality.
3. Class-prefix pairs such as `[class^="chatContent_"]` and `[class*=" chatContent_"]` match a complete class-token start without embedding a build hash. Redesign-specific substring hooks are localized below. They are still fragile if Discord renames a component.

## Runtime coverage

| Hook family | Observed scope | Risk / fallback |
|---|---|---|
| guilds, sidebarList, page, panels, link, members | Test-server navigation and member panel | Prefix rename drops geometry; semantic palette remains. Folders and role-heavy lists need a separate fixture. |
| chatContent, channelTextArea, scrollableContainer, reaction, embedFull, markup | Demo conversation, composer, code, quote, embed and reaction | Attachments, video and edit/upload states are not certified. |
| message-content IDs, repliedTextContent, groupStart | Six demo messages and native reply preview | IDs are prefix-only. Exclusion of repliedTextContent is essential: Discord reuses the message ID prefix in replies. |
| menu / menuitem, emojiPicker, searchResultsWrap | Message context menu, emoji picker and server-scoped search | GIF/sticker, autocomplete and pinned-message variants remain unexercised. |
| dialog + inboxTitle | Current inbox dialog opened/closed | Relational selector depends on inboxTitle; generic dialog palette remains. |
| userPopoutOuter, userProfileOuter | Own mini-profile opened | Current profile can inherit semantic tokens without matching legacy prefixes. Full/premium profiles not certified; banners and role colors are not overridden. |
| modal, modalContentInner, sidebar, active, contentHeader, sectionLabel | Current Appearance settings modal | Highest redesign risk. Older standardSidebarView/contentRegion hooks are retained as fallbacks, not asserted current matches. |
| vc-addon-card, vc-settings-card, vc-text-select | Vencord local/online theme settings and plugin cards | Explicit public-looking mod classes only; no wildcard vc override. External QuickCSS editor is excluded. |
| bd-addon-card, bd-settings-group | Standalone BetterDiscord theme manager | Tested with BD 1.14.1; future manager versions may rename these hooks. |
| callContainer, tile, videoControls | Authored only; no active call | NOT TESTED. Native disconnect, speaking and media states remain authoritative. |
| focus-visible, reduced-motion | Keyboard focus and media emulation | 2px outline is the one important declaration, needed against native Slate. Forced-colors and OS combinations require further live testing. |

## Shipped class hooks by module

Prefixes below omit the underscore/hash suffix. Repeated uses are listed once per module.

| Module | Class hooks |
|---|---|
| `src/core/base.css` | `markup`, `timestamp`, `bg` |
| `src/surfaces/navigation.css` | `guilds`, `sidebarList`, `panels`, `folderButtonInner`, `folderGroupBackground`, `link`, `interactive`, `interactiveSelected`, `membersGroup`, `members`, `member` |
| `src/surfaces/chat.css` | `chatContent`, `channelTextArea`, `scrollableContainer`, `replyBar`, `reaction`, `reactionMe`, `embedFull`, `fileWrapper`, `attachment`, `markup` |
| `src/surfaces/conversation-shape.css` | `repliedTextContent`, `repliedMessage`, `reaction` |
| `src/surfaces/overlays.css` | `tooltip`, `autocomplete`, `messagesPopoutWrap`, `containerRecentMentions`, `searchResultsWrap`, `emojiPicker`, `userPopoutOuter`, `userProfileOuter`, `inboxTitle` |
| `src/surfaces/settings.css` | `standardSidebarView`, `contentRegion`, `sidebarRegion`, `itemCard`, `connectContainer`, `separator`, `modalContentInner`, `modal`, `sidebar`, `active`, `contentHeader`, `sectionLabel` |
| `src/surfaces/voice.css` | `callContainer`, `tile`, `videoControls` |
| `src/core/layout.css` | `sidebarList`, `page`, `chatContent`, `link`, `interactiveSelected`, `channelTextArea`, `membersGroup`, `message`, `groupStart`, `itemCard`, `embedFull` |

## Maintenance procedure

Reproduce an affected surface with the theme disabled, inspect its current role and class-token prefix, then change the smallest owning module. Rebuild and retest that surface in both modes and both client mods when their UI is involved. Keep exact hashes and account/message IDs out of source and reports. A selector matching zero elements on the main screen is not itself a failure: many targets only mount in a modal or another route.
