# Penn State AR Campus Tour

## Summary and use case

A mobile-friendly campus tour that uses image recognition to introduce three
Penn State University Park landmarks: Westgate Building, the Nittany Lion Shrine,
and Beaver Stadium. Visitors and students can discover each location through a
3D model, a short description, and a link to its official website.

Tap **Start AR tour**, allow camera access, and point at one of the tour’s target
photos. Recognizing a target opens a glass information panel with an interactive
3D model. **Drag to move.** The panel stays visible if tracking is lost. Choose
**Explore without a camera** to browse the locations without AR.

The app uses HTML, CSS, JavaScript, MindAR 1.2.5, and A-Frame 1.5.0. It runs as a
static website with no backend, package installation, or build step. The AR
libraries load from jsDelivr, so an internet connection is required.

## Project structure

```text
index.html                 Welcome screen, AR viewer, and information panels
style.css                  Responsive layout, colors, and glass overlays
campus-tour.js             Location configuration, tracking, and model controls
TODO.md                    Development checklist
assets/
  old main.jpeg            Old Main welcome-screen photo
  targets/
    campus-tour.mind       Compiled MindAR image-target database
    westgate-target.jpeg
    lion-shrine-target.jpeg
    beaver-stadium-target.jpeg
  models/
    computer.glb
    pawprint.glb
    football.glb
```

## How MindAR works

MindAR compares the camera view with the images compiled into
`assets/targets/campus-tour.mind`. When an image is recognized, its target index
selects the matching location and GLB model. A-Frame loads the models; the app
shows the selected model inside the lower information panel, keeping the camera
view clear.

The owner confirmed this compilation order:

| Target index | Location | Target image | Model |
| --- | --- | --- | --- |
| 0 | Westgate Building | `westgate-target.jpeg` | `computer.glb` |
| 1 | Nittany Lion Shrine | `lion-shrine-target.jpeg` | `pawprint.glb` |
| 2 | Beaver Stadium | `beaver-stadium-target.jpeg` | `football.glb` |

Indices come from the **compiler input order**, not the order files appear in
GitHub. To change targets, use the image-target compiler linked from the
[MindAR project](https://github.com/hiukim/mind-ar-js), compile the intended JPEGs,
and save the exported `.mind` file. Record the input order and update the
`targetIndex` values in `campus-tour.js` to match.

The `TOUR` configuration in `campus-tour.js` also controls descriptions, website
links, image/model paths, and initial model rotation. `previewFill` adjusts how
much of the model pane is filled. Preserve existing assets unless replacing them
has been approved.
