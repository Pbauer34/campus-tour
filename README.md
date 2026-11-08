# Penn State Augmented Reality Campus Tour

A planned browser-based tour of Westgate Building, the Nittany Lion Shrine, and
Beaver Stadium at Penn State University Park. The intended stack is HTML, CSS,
JavaScript, MindAR image tracking, A-Frame rendering, and GitHub Pages hosting.
No backend, paid service, or build system is required.

## Current status

The mobile interface, fallback tour, and all three AR anchors are implemented.
The owner supplied `assets/targets/campus-tour.mind` on main and confirmed its
compilation order: **0 Westgate, 1 Lion Shrine, 2 Beaver Stadium**. Original JPEGs,
GLBs, and the compiled database are preserved. Real camera tracking, model
transforms, and mobile compatibility still need phone testing. See TODO.md.

## Structure and assets

```text
index.html             # Application structure
style.css              # Responsive styling
campus-tour.js         # Centralized configuration and AR lifecycle
README.md
TODO.md
assets/
  targets/
    campus-tour.mind
    westgate-target.jpeg
    lion-shrine-target.jpeg
    beaver-stadium-target.jpeg
  models/
    computer.glb
    pawprint.glb
    football.glb
```

All three JPEGs pass image-integrity checks. All three models have parseable
GLB 2.0 containers and no external buffer/image references. Rendering, tracking
quality, and model scale/orientation have not been tested. The owner-confirmed mappings
are Westgate → computer, Lion Shrine → pawprint, and Beaver Stadium → football.

## Running locally

From the repository directory, with Python 3 installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in a browser for development. Choose Start AR or Explore without a camera. There is nothing to install or build. A phone
connecting over a LAN needs an HTTPS development endpoint for camera access;
ordinary HTTP on a LAN address is generally not a secure camera context.

## MindAR target compilation and index mapping

The owner compiled and uploaded `assets/targets/campus-tour.mind`. The confirmed
order is 0 Westgate, 1 Lion Shrine, 2 Beaver Stadium. For future updates, use the
image-target compiler linked from official MindAR documentation, preserve the
JPEGs, record the exact input order and compiler version, and commit the exported
database with the corresponding configuration changes. The original compiler
version was not supplied.

Indices follow the compiler input order, never GitHub display order or directory
listing order. Do not assume Westgate is index 0. If compilation order is unknown,
re-establish it with the compiler/project owner before implementation. If targets
are recompiled, update and reverify the mapping alongside the new database.

## Models and location configuration

The `TOUR` object in `campus-tour.js` will contain location names,
descriptions, official links, verified target indices, existing model paths, and
position/rotation/scale values. Edit that configuration to adjust models and content. A-Frame positions
and scales use three components; rotations use degrees. Tune transforms on a real
target and device rather than assuming GLB units match the scene.

To add a location later, obtain appropriately licensed target/model assets,
compile the target database with a documented order, update configuration, and
test model loading and physical tracking. Do not rename, delete, overwrite, or
replace the uploaded assets without owner permission.

## Planned interaction

The welcome screen offers an explicit Start AR action. Recognized targets
show anchored animated models and location information. Models hide
when tracking is lost; information panels remain readable until closed.
Official websites open only after a button tap. A non-AR view shows all
three locations if camera access is unavailable. The Lion Shrine button uses the owner-provided official URL:
https://www.psu.edu/about/nittany-lion-shrine/.

## GitHub Pages deployment

After an implementation PR is approved and merged, a repository maintainer can
open Settings → Pages, choose **Deploy from a branch**, select `main` and the
repository root, and save. Follow the repository's approved workflow if one is
established instead. No deployment has been performed during inspection.

Use document-relative asset paths such as `./assets/models/computer.glb` so they
work beneath the repository subpath. Test the actual Pages HTTPS address supplied
by GitHub, including camera permissions, dependency requests, and all targets.
Never commit directly to `main` or merge a PR automatically.

## Collaboration

Create a descriptive feature branch, group related changes into clear commits,
and include the matching TODO updates in each PR targeting `main`. Summarize the
change, completed checklist items, actual test results, unresolved blockers, and
manual tests needed. Wait for a group member's review and approval before merging.
The first implementation PR should cover the foundation and Westgate; extend to
the other locations only after that PR is approved and merged.

## Troubleshooting and manual testing

- If libraries cannot load, check access to cdn.jsdelivr.net and reload; the fallback remains available.
- If the camera fails later, check HTTPS, browser support, camera permissions,
  whether another app uses the camera, and the displayed error.
- If tracking fails, check the `.mind` response, verified index order, lighting,
  image framing, and similarity to the compiled JPEG.
- If a model fails, check its relative URL, browser console, GLB compatibility,
  transforms, and renderer errors.
- Test iPhone Safari and Android Chrome: allow/deny camera, all three physical
  targets, target loss/reacquisition, close controls, links, fallback, readability,
  loading failures, and sustained performance. These tests remain unperformed.

## Attribution, licenses, and limitations

JPEGs and GLBs were supplied by the project owner; creators, source URLs,
licenses, and redistribution permissions were not supplied. Record and verify
those details before public release. No asset license is inferred from upload.
Document pinned MindAR/A-Frame versions and applicable licenses when integrated.
No project license has been declared in this checkout.

Runtime dependencies are pinned to A-Frame 1.5.0 and MindAR 1.2.5, loaded from
jsDelivr over HTTPS (both projects use the MIT license). Internet access is needed
for these scripts; application assets are served from this repository.

The Lion Shrine button now uses the owner-provided URL in both the AR dock and
fallback tour. Its href is covered by browser tests; independent remote response
verification remains blocked by the environment network policy.
Model transforms are initial defaults and require real target/device tuning.
No camera-tracking, smartphone, deployment, or usability success is claimed.
Browser tests use controlled AR start/error events and do not prove tracking.
The camera is stopped when leaving the page or hiding its tab; restart explicitly.

## Automated smoke checks

Run `node --check campus-tour.js`. The optional browser smoke test requires
Playwright available to Node and Chromium (`CHROMIUM_PATH` can override its path).
It does not add production dependencies or a build step. Serve the parent of the
checkout at port 8001 so the project is available beneath `/campus-tour/`, then run
`node tests/browser-smoke.cjs`. For restricted browser networking, set
`TEST_DEPENDENCY_DIR` to a directory containing securely downloaded copies of the
exact pinned scripts named `aframe.js` and `mindar.js`. Tests use controlled AR
startup/events and do not validate camera tracking. Smartphone checks remain open.

## Approved glass dock (A + E)

The camera view stays clear above a bottom dock, limited to 44% of the current
viewport height in portrait. Its white background has **40% opacity** with a
14px backdrop blur. Text and buttons stay fully opaque. The left 40% of the dock
holds the selected original GLB; the right 60% holds a scrollable synopsis above
the website link. The dock and model remain visible after tracking loss until
closed. No model is rendered over the tracked image.

The preview reuses the mesh loaded by A-Frame, centers it by its real bounds,
and fits its projected bounds to the available pane during a gentle ±20° turn.
Adjust `TOUR.previewFill` (currently 0.92) to change the model's pane occupancy;
`location.rotation` sets its initial orientation. Target-space `scale` and
`position` are retained as configuration but do not control the dock preview.
There are no new runtime dependencies. Animation respects reduced-motion
preferences, and the renderer is released when exiting AR. Devices lacking
backdrop blur use a denser background for readability.

Automated Chromium checks cover all three models at 375×667, 375×812, 390×844,
393×852, 402×874, 430×932, and 844×390 CSS-pixel viewports. These verify layout,
model pane bounds, opacity, and 44px link targets, not physical iPhone Safari.
On your iPhone, verify Safari toolbar expansion/collapse, notch/home-indicator
clearance, rotation, synopsis scrolling, text contrast over bright/dark camera
scenes, all three models, camera exit/restart, and sustained performance.

The closer preview framing uses up to 92% of the limiting pane dimension rather
than reserving space for a full rotation. This makes the computer and football
more prominent while keeping every projected bounding-box corner inside the
pane. The camera refits during the gentle turn and on viewport resize.

## Navy welcome screen

The approved welcome interface uses a centered two-line heading, `PENN STATE`
and `AR Campus Tour`, with a navy background and friendly numbered instructions.
The printed-target tip and both requested disclaimers have been removed.
This is a text wordmark treatment, not an imported official logo asset.
The welcome screen uses the owner-uploaded `assets/old main.jpeg` directly,
with its original filename and bytes preserved. The space is URL-encoded in
`TOUR.welcomeImage`. The photo is displayed without blur, with four explicit white corner markers;
the source photo is not edited. White instruction cards and a navy-to-white
welcome background make the interface lighter while retaining navy branding. The file contains WebP image data despite its JPEG
extension; browser decoding is covered by the smoke test.

## Spin the 3D models

Drag left/right in the model pane to spin the model through a full turn; drag
up/down to tilt it (limited to ±60°). Both touch and mouse input are supported.
The initial gentle animation stops after interaction so it does not fight your
chosen view. The model refits as it turns and stays within the left pane.
Keyboard users can focus the preview and use arrow keys; Home resets its pose.
Dragging is confined to the model pane so the synopsis can still scroll normally.
A new landmark starts with its configured default pose. Pointer capture is
released on cancellation, panel close, and AR exit.

Automated Chromium tests exercise mouse drags, browser-dispatched touch gestures,
keyboard turning/reset, manual pose persistence, and projected bounds for all
three models. These do not replace touch/scroll checks on physical iPhone Safari.
