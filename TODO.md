# Penn State AR Campus Tour — Development Checklist

## Phase 1 — Repository and asset verification

- [x] Inspect the entire repository structure and tracked-file inventory.
- [x] Identify all JPEG target images and GLB models (inventory below).
- [x] Verify JPEG integrity and GLB 2.0 headers, chunk lengths, and JSON.
- [x] Confirm every tracked project file is present; preserve all original assets.
- [x] Confirm image-to-model mappings with the project owner: Westgate → computer,
  Lion Shrine → pawprint, Beaver Stadium → football.
- [x] Record owner-confirmed compilation order: 0 Westgate, 1 Lion Shrine, 2 Beaver Stadium.
- [x] Verify `assets/targets/campus-tour.mind` exists after merging main (1,979,240 bytes).
- [x] Receive owner-compiled `.mind` file from main and record its exact input order.

| Location | Existing JPEG | Confirmed existing model | JPEG dimensions | Target index |
| --- | --- | --- | --- | --- |
| Westgate Building | `assets/targets/westgate-target.jpeg` | `assets/models/computer.glb` | 1920 × 840 | 0 |
| Nittany Lion Shrine | `assets/targets/lion-shrine-target.jpeg` | `assets/models/pawprint.glb` | 720 × 540 | 1 |
| Beaver Stadium | `assets/targets/beaver-stadium-target.jpeg` | `assets/models/football.glb` | 958 × 639 | 2 |

The three GLBs contain 5, 1, and 1 meshes respectively and reference no external
buffers or images. This is structural verification, not rendering validation.
`index.html`, `style.css`, and `campus-tour.js` now implement the application. `README.md` and `TODO.md`
are present. There is no dependency manifest, lockfile, or build system;
`tests/browser-smoke.cjs` provides optional browser checks. Tracked `.DS_Store` files are preserved. The actual remote is
`Pbauer34/campus-tour`, not `campus-ar-tour`.

## Phase 2 — Application foundation

Asset mappings and compilation order were confirmed by the owner.

- [x] Create semantic HTML structure and A-Frame scene.
- [x] Add responsive navy-and-white CSS with accessible contrast and tap targets.
- [x] Integrate compatible, pinned A-Frame and MindAR versions without a build system.
- [x] Configure relative asset paths and loading/error states.
- [x] Centralize location content, links, indices, model paths, and transforms in JavaScript.

## Phase 3 — AR functionality

The owner authorized continuing the AR application after uploading the database.

- [x] Implement user-initiated camera initialization and permission/error handling.
- [x] Configure Westgate using its verified index in the committed `.mind` file.
- [ ] Load and visually verify the existing Westgate GLB; tune its transforms.
- [x] Implement target-found/lost handlers; hide models when tracking is lost.
- [x] Add subtle rotation animations, paused when targets are lost.
- [ ] Assess real-device performance and tune model transforms.
- [x] Configure all three confirmed target anchors and corresponding existing GLB paths.

## Phase 4 — User interface

- [x] Create welcome instructions and Start AR button.
- [x] Create readable location information panels using the supplied descriptions.
- [x] Keep panels visible during temporary tracking loss.
- [x] Add user-tapped IST and Athletics website buttons; never navigate automatically.
- [x] Add the Lion Shrine button using the owner-supplied official URL.
- [ ] Independently verify the supplied Lion Shrine URL response; environment network policy blocks this request.
- [x] Implement panel close and back/stop controls and continued scanning.
- [x] Implement non-AR fallback with all three locations and the two available links.
- [x] Handle unavailable cameras, unsupported browsers, and tracking failures clearly.

## Phase 5 — Testing and debugging

- [x] Verify all currently tracked files and listed asset paths exist.
- [x] Verify all JPEGs decode structurally and GLB containers parse successfully.
- [x] Check JavaScript syntax after implementation.
- [x] Verify dependency loading, asset references, and confirmed target indices.
- [x] Test application initialization and error recovery.
- [x] Test loading all GLBs into A-Frame meshes.
- [ ] Visually inspect rendered models and materials.
- [x] Test tracking listeners, persistent panels, close controls, and external links.
- [ ] Test non-AR fallback, accessibility, and mobile layout.
- [ ] Test iPhone Safari and Android Chrome camera permissions (owner confirmation required).
- [ ] Test all three physical image targets on a smartphone (owner confirmation required).
- [ ] Test target loss/reacquisition and real-device performance (owner confirmation required).

## Phase 6 — Deployment

- [x] Document GitHub Pages setup and the approved PR workflow in README.md.
- [x] Verify implemented asset paths work under the GitHub Pages repository subpath.
- [ ] Deploy through the approved GitHub workflow after review and merge.
- [ ] Test the deployed HTTPS website, including camera and dependency requests.

## Phase 7 — Documentation and final evaluation

- [x] Update README.md with project goals, structure, local serving, compilation,
  mapping rules, model adjustment guidance, deployment, collaboration, and limitations.
- [ ] Record asset creators, sources, permission, and licenses; provenance is not supplied.
- [x] Document implemented configuration and how to add or modify locations.
- [x] Document current limitations and required manual validation.
- [ ] Complete usability testing with the university group.

## Review gates

- [ ] Review and merge the repository-verification/documentation PR.
- [x] Confirm asset mappings.
- [x] Receive a compiled target file with exact index order.
- [ ] Review the AR implementation PR; do not merge automatically.

Application implementation is present; deployment has not been performed. Check boxes only
after successful work; keep manual smartphone checks open until the owner confirms.

## Implementation notes

The Lion Shrine official article URL could not be verified because network access
was denied. The owner has now supplied the official URL and its button is configured. Manual phone tests and transform tuning remain incomplete.

## Automated validation performed

- `node --check campus-tour.js` and `git diff --check` passed.
- Chromium at 390 × 844: pinned runtimes initialize; fallback has three cards,
  navigation works, and all seven application assets return HTTP 200 under
  `/campus-tour/`.
- MindAR imports the supplied database and reports exactly three targets.
- All three GLBs load as A-Frame meshes (not a visual quality assessment).
- Controlled target-found/lost events show the correct panels, preserve them
  on tracking loss, and allow closing; stop removes the scene.
- Controlled denied-camera startup reaches the fallback without uncaught errors.
- AR startup was mocked for lifecycle checks; no physical tracking was verified.
- The Lion Shrine href now matches the owner-provided URL; remote verification remains blocked.

## Approved A + E overlay revision

- [x] Create a new feature branch from latest main: `codex/iphone-glass-panes`.
- [x] Implement 40%-opacity frosted glass with opaque navy text and buttons.
- [x] Place model in left pane; stack synopsis and website panes on the right.
- [x] Fit all three original GLBs to the pane using their real bounding spheres.
- [x] Keep camera image free of target-anchored oversized models.
- [x] Support safe-area insets, viewport height changes, scrolling synopsis,
  reduced motion, and renderer cleanup on exit.
- [x] Run browser geometry checks for all three models at seven iPhone-sized
  portrait/landscape viewports; verify 40% opacity and minimum 44px links.
- [x] Rerun fallback, tracking-event, panel persistence, exit, and denied-camera checks.
- [ ] Test the revised overlay on physical iPhone Safari, including changing toolbars,
  safe areas, rotation, contrast over camera scenes, and preview performance.
- [ ] Review and merge the new overlay PR (no automatic merge).

Owner confirmed the earlier application's functionality on a device. The revised
pane layout still needs its own physical-device validation. Existing JPEG/GLB/
MindAR assets are unchanged. The Lion Shrine official link is now supplied by the owner.

## Larger model previews (same overlay branch)

- [x] Replace conservative sphere fitting with current projected-box fitting.
- [x] Increase preview occupancy to 92% of the limiting pane dimension.
- [x] Use a gentle ±20° turn so models do not become edge-on during rotation.
- [ ] Confirm the enlarged computer and football sizes on physical iPhone Safari.

## Approved welcome-screen revision

- [x] Add centered `PENN STATE` / `AR Campus Tour` heading and navy background.
- [x] Use the requested subtitle and three friendly numbered instructions.
- [x] Remove the printed-target tip, camera privacy line, and student disclaimer.
- [x] Configure the supplied Lion Shrine URL in the dock and fallback tour.
- [x] Check title, instructions, links, horizontal overflow, and button tap sizes at
  five common iPhone portrait viewports; rerun the AR/dock browser smoke suite.
- [x] Connect the uploaded `assets/old main.jpeg` without renaming or editing it.
- [x] Verify browser decoding and photo display at five iPhone portrait widths.
- [ ] Confirm the new welcome screen on physical iPhone Safari.

## Lighter welcome screen and clear Old Main photo

- [x] Remove photo blur without modifying the uploaded image.
- [x] Replace the masked frame with four explicit white corner markers.
- [x] Add white instruction cards and a navy-to-white welcome background.
- [x] Check photo rendering, marker bounds, and layout at five iPhone widths;
  rerun the complete browser smoke suite.
- [ ] Review the lighter interface on physical iPhone Safari.

## Interactive model spinning

- [x] Add touch/mouse drag-to-spin and bounded vertical tilt for each model.
- [x] Stop automatic motion after user interaction and refit the model while turning.
- [x] Add focusable preview, instructions, arrow-key controls, and Home reset.
- [x] Confine gestures to the model pane; keep synopsis scrolling available.
- [x] Test mouse and browser-dispatched touch drags, keyboard reset, retained pose,
  and fitted bounds for all three models; rerun iPhone-sized layout/AR smoke checks.
- [ ] Confirm touch rotation, synopsis scrolling, and exit/restart on physical iPhone Safari.

## README simplification

- [x] Replace the accumulated development notes with a concise app summary and use case,
  project structure, MindAR explanation/mapping, and short run/test instructions.
