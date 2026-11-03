# Penn State AR Campus Tour — Development Checklist

## Phase 1 — Repository and asset verification

- [x] Inspect the entire repository structure and tracked-file inventory.
- [x] Identify all JPEG target images and GLB models (inventory below).
- [x] Verify JPEG integrity and GLB 2.0 headers, chunk lengths, and JSON.
- [x] Confirm every tracked project file is present; preserve all original assets.
- [ ] Confirm image-to-model mappings with the project owner. Proposed mappings
  below are inferred from filenames, not approved configuration.
- [ ] Verify target-index order from the actual MindAR compilation.
- [x] Check for a compiled MindAR file: none exists in this checkout.
- [ ] Compile and commit a `.mind` file using the existing images; record its exact
  input order. Blocked pending compilation and verified index mapping.

| Location | Existing JPEG | Proposed existing model | JPEG dimensions | Target index |
| --- | --- | --- | --- | --- |
| Westgate Building | `assets/targets/westgate-target.jpeg` | `assets/models/computer.glb` | 1920 × 840 | Unassigned |
| Nittany Lion Shrine | `assets/targets/lion-shrine-target.jpeg` | `assets/models/pawprint.glb` | 720 × 540 | Unassigned |
| Beaver Stadium | `assets/targets/beaver-stadium-target.jpeg` | `assets/models/football.glb` | 958 × 639 | Unassigned |

The three GLBs contain 5, 1, and 1 meshes respectively and reference no external
buffers or images. This is structural verification, not rendering validation.
`index.html`, `style.css`, and `campus-tour.js` are empty. `README.md` and `TODO.md`
are present. There is no dependency manifest, lockfile, build system, or test
suite. Tracked `.DS_Store` files are preserved. The actual remote is
`Pbauer34/campus-tour`, not `campus-ar-tour`.

## Phase 2 — Application foundation

Blocked until asset mappings and compiled target indices are confirmed.

- [ ] Create semantic HTML structure and A-Frame scene.
- [ ] Add responsive navy-and-white CSS with accessible contrast and tap targets.
- [ ] Integrate compatible, pinned A-Frame and MindAR versions without a build system.
- [ ] Configure relative asset paths and loading/error states.
- [ ] Centralize location content, links, indices, model paths, and transforms in JavaScript.

## Phase 3 — AR functionality

Implement Westgate first; submit for review before extending to other locations.

- [ ] Implement user-initiated camera initialization and permission/error handling.
- [ ] Configure Westgate using its verified index in the committed `.mind` file.
- [ ] Load and visually verify the existing Westgate GLB; tune its transforms.
- [ ] Implement target-found/lost handlers; hide models when tracking is lost.
- [ ] Add a subtle model animation and assess mobile performance.
- [ ] After the first implementation PR is approved and merged, configure the other
  two targets and load their corresponding existing GLBs.

## Phase 4 — User interface

- [ ] Create welcome instructions and Start AR button.
- [ ] Create readable location information panels using the supplied descriptions.
- [ ] Keep panels visible during temporary tracking loss.
- [ ] Add user-tapped official website buttons; never navigate automatically.
- [ ] Verify an official Penn State Lion Shrine information URL before using it.
- [ ] Implement panel close and back/stop controls and continued scanning.
- [ ] Implement non-AR fallback with all three locations and links.
- [ ] Handle unavailable cameras, unsupported browsers, and tracking failures clearly.

## Phase 5 — Testing and debugging

- [x] Verify all currently tracked files and listed asset paths exist.
- [x] Verify all JPEGs decode structurally and GLB containers parse successfully.
- [ ] Check JavaScript syntax after implementation.
- [ ] Verify dependency loading, asset references, and confirmed target indices.
- [ ] Test application initialization and error recovery.
- [ ] Test GLB loading/rendering where supported by the environment.
- [ ] Test tracking listeners, persistent panels, close controls, and external links.
- [ ] Test non-AR fallback, accessibility, and mobile layout.
- [ ] Test iPhone Safari and Android Chrome camera permissions (owner confirmation required).
- [ ] Test all three physical image targets on a smartphone (owner confirmation required).
- [ ] Test target loss/reacquisition and real-device performance (owner confirmation required).

## Phase 6 — Deployment

- [x] Document GitHub Pages setup and the approved PR workflow in README.md.
- [ ] Verify implemented asset paths work under the GitHub Pages repository subpath.
- [ ] Deploy through the approved GitHub workflow after review and merge.
- [ ] Test the deployed HTTPS website, including camera and dependency requests.

## Phase 7 — Documentation and final evaluation

- [x] Update README.md with project goals, structure, local serving, compilation,
  mapping rules, model adjustment guidance, deployment, collaboration, and limitations.
- [ ] Record asset creators, sources, permission, and licenses; provenance is not supplied.
- [ ] Document implemented configuration and how to add or modify locations.
- [x] Document current limitations and required manual validation.
- [ ] Complete usability testing with the university group.

## Review gates

- [ ] Review and merge the repository-verification/documentation PR.
- [ ] Confirm asset mappings and provide a compiled target file with exact index order.
- [ ] Review and merge the first Westgate implementation PR before further implementation.

No application implementation or deployment has been performed. Check boxes only
after successful work; keep manual smartphone checks open until the owner confirms.
