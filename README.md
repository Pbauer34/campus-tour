# Penn State Augmented Reality Campus Tour

A planned browser-based tour of Westgate Building, the Nittany Lion Shrine, and
Beaver Stadium at Penn State University Park. The intended stack is HTML, CSS,
JavaScript, MindAR image tracking, A-Frame rendering, and GitHub Pages hosting.
No backend, paid service, or build system is required.

## Current status

Repository and asset verification is complete. Application files are empty;
there is no working AR experience yet. Original assets are preserved. Model
mappings await owner confirmation, and no compiled `.mind` file is present.
Target indices are unassigned. See [TODO.md](TODO.md) for the phased checklist.
The repository remote is `Pbauer34/campus-tour`.

## Structure and assets

```text
index.html             # Empty application structure placeholder
style.css              # Empty styling placeholder
campus-tour.js         # Existing empty JavaScript placeholder
README.md
TODO.md
assets/
  targets/
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
quality, and model scale/orientation have not been tested. The proposed mappings
are Westgate → computer, Lion Shrine → pawprint, and Beaver Stadium → football;
these remain unconfirmed and must not be used as approved configuration.

## Running locally

From the repository directory, with Python 3 installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in a browser for development. At present the index page
is blank because it is empty. There is nothing to install or build. A phone
connecting over a LAN needs an HTTPS development endpoint for camera access;
ordinary HTTP on a LAN address is generally not a secure camera context.

## MindAR target compilation and index mapping

This task remains incomplete. Use the image-target compiler linked from the
official MindAR project documentation, selecting the existing JPEG files without
renaming or replacing them. Record the exact compiler version and input order,
compile, test the resulting database, and save the exported `.mind` file under
`assets/targets/`. Commit it together with an explicit mapping from each zero-based
target index to its source JPEG and location. Obtain owner confirmation before
wiring the application to that mapping.

Indices follow the compiler input order, never GitHub display order or directory
listing order. Do not assume Westgate is index 0. If compilation order is unknown,
re-establish it with the compiler/project owner before implementation. If targets
are recompiled, update and reverify the mapping alongside the new database.

## Models and location configuration

The planned centralized JavaScript configuration will contain location names,
descriptions, official links, verified target indices, existing model paths, and
position/rotation/scale values. Its implementation is pending. A-Frame positions
and scales use three components; rotations use degrees. Tune transforms on a real
target and device rather than assuming GLB units match the scene.

To add a location later, obtain appropriately licensed target/model assets,
compile the target database with a documented order, update configuration, and
test model loading and physical tracking. Do not rename, delete, overwrite, or
replace the uploaded assets without owner permission.

## Planned interaction

The welcome screen will offer an explicit Start AR action. Recognized targets
will show anchored animated models and location information. Models will hide
when tracking is lost; information panels will remain readable until closed.
Official websites will open only after a button tap. A non-AR view will show all
three locations if camera access is unavailable. The official Lion Shrine link
must still be selected and verified before use.

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

- A blank page is expected at this inspection stage; application code is absent.
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

Current limitations: no application implementation, no compiled target database,
unconfirmed asset mappings, no chosen framework versions, no mobile/visual AR
validation, and no deployment or usability testing. Future work is tracked in
TODO.md; no mobile compatibility or camera-tracking success is claimed.
