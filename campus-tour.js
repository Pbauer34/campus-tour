/* Target indices follow the owner's confirmed campus-tour.mind compilation order.
   Transform defaults need physical target/device tuning; preserve original assets. */
'use strict';
const TOUR = {
  targets: './assets/targets/campus-tour.mind',
  welcomeImage: './assets/old%20main.jpeg', // Preserve the uploaded filename, including its space.
  previewFill: 0.92, // Fraction of pane width/height used by the projected model.
  locations: [
    { id: 'westgate', targetIndex: 0, name: 'Westgate Building', image: './assets/targets/westgate-target.jpeg', model: './assets/models/computer.glb', scale: '0.05 0.05 0.05', position: '0 0 0.1', rotation: '0 0 0', description: "Home to Penn State's College of Information Sciences and Technology, Westgate Building supports education and research in cybersecurity, information technology, and data sciences.", linkLabel: 'Explore the College of IST', url: 'https://ist.psu.edu/' },
    { id: 'lion-shrine', targetIndex: 1, name: 'Nittany Lion Shrine', image: './assets/targets/lion-shrine-target.jpeg', model: './assets/models/pawprint.glb', scale: '0.05 0.05 0.05', position: '0 0 0.1', rotation: '0 0 0', description: "The Nittany Lion Shrine is one of Penn State's most recognizable landmarks and represents the university's history, traditions, and school pride.", linkLabel: 'Learn About the Lion Shrine', url: 'https://www.psu.edu/about/nittany-lion-shrine/' },
    { id: 'beaver-stadium', targetIndex: 2, name: 'Beaver Stadium', image: './assets/targets/beaver-stadium-target.jpeg', model: './assets/models/football.glb', scale: '0.05 0.05 0.05', position: '0 0 0.1', rotation: '0 0 0', description: 'Beaver Stadium is the home of Penn State football and one of the most recognizable landmarks on the University Park campus.', linkLabel: 'Visit Penn State Athletics', url: 'https://gopsusports.com/' }
  ]
};
// Render a bounded preview using the GLB already loaded by A-Frame: no extra library
// or download, and no oversized model floating over the camera image.
const preview = {
  renderer: null, group: null, frame: null, observer: null,
  show(location) {
    this.pause();
    const host = document.getElementById('model-preview');
    host.dataset.location = location.id;
    if (this.world && this.group) this.world.remove(this.group);
    this.group = null;
    this.manual = false;
    const source = document.querySelector(`a-entity[data-location="${location.id}"]`);
    const mesh = source?.getObject3D('mesh');
    if (!mesh) {
      this.renderer?.clear();
      document.getElementById('model-status').textContent = source?.dataset.failed ? 'Model unavailable.' : 'Loading model…';
      return;
    }
    try {
      const THREE = AFRAME.THREE;
      if (!this.renderer) {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setClearColor(0x000000, 0);
        host.append(this.renderer.domElement);
        this.world = new THREE.Scene();
        this.world.add(new THREE.HemisphereLight(0xffffff, 0x708090, 2));
        const light = new THREE.DirectionalLight(0xffffff, 2); light.position.set(2, 3, 4); this.world.add(light);
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
        this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(host);
      }
      const content = mesh.clone(true);
      // Center and normalize the actual bounds so differently sized source GLBs fit.
      content.rotation.set(...location.rotation.split(' ').map(value => THREE.MathUtils.degToRad(Number(value))));
      content.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(content);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const factor = 1.4 / Math.max(size.x, size.y, size.z, 0.001);
      content.position.sub(center); content.position.multiplyScalar(factor); content.scale.multiplyScalar(factor);
      this.group = new THREE.Group(); this.group.add(content); this.world.add(this.group);
      const bounds = new THREE.Box3().setFromObject(this.group);
      this.corners = [];
      for (const x of [bounds.min.x, bounds.max.x])
        for (const y of [bounds.min.y, bounds.max.y])
          for (const z of [bounds.min.z, bounds.max.z]) this.corners.push(new THREE.Vector3(x, y, z));
      this.resize();
      document.getElementById('model-status').textContent = '';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let elapsed = 0, last;
      const draw = time => {
        if (!this.renderer || this.manual || document.getElementById('panel').hidden) return;
        if (!reducedMotion && last) elapsed += Math.min(time - last, 50);
        // A gentle turn keeps the broad face readable instead of turning edge-on.
        this.group.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.00035) * 0.35;
        this.fitCamera();
        last = time;
        this.renderer.render(this.world, this.camera);
        if (!reducedMotion) this.frame = requestAnimationFrame(draw);
      };
      this.frame = requestAnimationFrame(draw);
    } catch (error) {
      document.getElementById('model-status').textContent = '3D preview unavailable on this device.';
      console.warn('Model preview:', error);
    }
  },
  resize() {
    if (!this.renderer || !this.group) return;
    const host = document.getElementById('model-preview');
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.fitCamera();
    this.renderer.render(this.world, this.camera);
  },
  fitCamera() {
    if (!this.group || !this.corners) return;
    const tanY = Math.tan(this.camera.fov * Math.PI / 360);
    const tanX = tanY * this.camera.aspect;
    const fill = TOUR.previewFill;
    this.group.updateMatrixWorld(true);
    // Fit the current projected box, including depth. Unlike a sphere this does
    // not waste pane width around wide/flat models such as the computer.
    let distance = 0.1;
    for (const corner of this.corners) {
      const point = corner.clone().applyMatrix4(this.group.matrixWorld);
      distance = Math.max(distance, point.z + Math.abs(point.x) / (tanX * fill),
        point.z + Math.abs(point.y) / (tanY * fill));
    }
    this.camera.position.set(0, 0, distance);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);
  },
  turn(yaw, pitch, reset = false) {
    if (!this.group || !this.renderer || document.getElementById('panel').hidden) return;
    this.manual = true; cancelAnimationFrame(this.frame); this.frame = null;
    this.group.rotation.y = reset ? 0 : (this.group.rotation.y + yaw) % (Math.PI * 2);
    this.group.rotation.x = reset ? 0 : Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.group.rotation.x + pitch));
    this.fitCamera(); this.renderer.render(this.world, this.camera);
  },
  pause() {
    cancelAnimationFrame(this.frame); this.frame = null;
    const host = document.getElementById('model-preview');
    if (this.drag && host.hasPointerCapture(this.drag.id)) host.releasePointerCapture(this.drag.id);
    this.drag = null;
    host.classList.remove('dragging');
  },
  dispose() {
    this.pause(); this.observer?.disconnect();
    if (this.renderer) { this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove(); }
    // Mesh geometry/materials are shared with A-Frame; do not dispose them here.
    this.renderer = this.group = this.world = this.camera = this.observer = null;
  }
};
const $ = id => document.getElementById(id);
let scene, starting = false, active = false, generation = 0, watchdog;
const say = message => { $('status').textContent = message; };
function configureLink(link, note, location) {
  link.hidden = !location.url;
  if (location.url) { link.href = location.url; link.textContent = location.linkLabel; }
  else link.removeAttribute('href');
  note.hidden = !!location.url;
}
function showLocation(location) {
  $('panel-title').textContent = location.name;
  $('panel-description').textContent = location.description;
  configureLink($('panel-link'), $('panel-link-note'), location);
  $('panel').hidden = false;
  $('model-preview').setAttribute('aria-label', `${location.name} 3D model`);
  $('model-status').textContent = 'Loading model…';
  preview.show(location);
}
function stopAR() {
  generation++; clearTimeout(watchdog);
  preview.dispose();
  if (scene) {
    const system = scene.systems['mindar-image-system'];
    // MindAR 1.2.5 pause assumes a controller exists, even on a denied camera.
    if (system && !system.controller) system.pause = () => {};
    try { if (system?.controller) system.stop(); } catch (error) { console.warn('AR cleanup:', error); }
    // Component removal calls stop again; make teardown safe and idempotent.
    if (system) { system.stop = () => {}; system.pause = () => {}; }
    scene.remove(); scene = null;
  }
  // Stop any camera stream remaining after a partially failed initialization.
  document.querySelectorAll('video').forEach(video => {
    if (video.srcObject) { video.srcObject.getTracks().forEach(track => track.stop()); video.srcObject = null; video.remove(); }
  });
  active = starting = false;
  $('start').disabled = false;
  $('viewer').hidden = $('scan-controls').hidden = $('panel').hidden = true;
  document.body.classList.remove('scanning');
}
function browse(message = '') {
  stopAR(); $('welcome').hidden = true; $('fallback').hidden = false; say(message);
  $('fallback-title').tabIndex = -1; $('fallback-title').focus();
}
function fail(error) {
  const denied = ['NotAllowedError', 'PermissionDeniedError'].includes(error?.name);
  browse(denied ? 'Camera permission was denied. Enable camera access in your browser settings to try again, or explore below.' : 'The AR camera could not start. Check camera availability, HTTPS, browser support, and your connection. You can still explore below.');
}
function buildScene() {
  const element = document.createElement('a-scene');
  element.setAttribute('mindar-image', `imageTargetSrc: ${TOUR.targets}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; maxTrack: 1`);
  element.setAttribute('embedded', '');
  element.setAttribute('renderer', 'colorManagement: true; physicallyCorrectLights: true; antialias: true');
  element.setAttribute('vr-mode-ui', 'enabled: false');
  element.setAttribute('device-orientation-permission-ui', 'enabled: false');
  const assets = document.createElement('a-assets'); assets.setAttribute('timeout', '30000');
  TOUR.locations.forEach(location => {
    const asset = document.createElement('a-asset-item'); asset.id = `model-${location.id}`; asset.setAttribute('src', location.model); assets.append(asset);
  });
  element.append(assets);
  const camera = document.createElement('a-camera'); camera.setAttribute('position', '0 0 0'); camera.setAttribute('look-controls', 'enabled: false'); element.append(camera);
  TOUR.locations.forEach(location => {
    const anchor = document.createElement('a-entity'); anchor.setAttribute('mindar-image-target', `targetIndex: ${location.targetIndex}`);
    const model = document.createElement('a-entity'); model.setAttribute('gltf-model', `url(${location.model})`);
    ['position', 'rotation', 'scale'].forEach(key => model.setAttribute(key, location[key]));
    model.setAttribute('visible', false);
    model.setAttribute('animation', `property: rotation; from: ${location.rotation}; to: 0 360 0; dur: 18000; loop: true; easing: linear; startEvents: tour-found; pauseEvents: tour-lost`);
    model.addEventListener('model-error', () => {
      model.dataset.failed = 'true';
      if ($('model-preview').dataset.location === location.id) $('model-status').textContent = 'Model unavailable. You can still read about this landmark.';
    });
    model.dataset.location = location.id;
    model.addEventListener('model-loaded', () => {
      if (!$('panel').hidden && $('model-preview').dataset.location === location.id) preview.show(location);
    });
    anchor.append(model);
    anchor.addEventListener('targetFound', () => {
      if (!active || scene !== element) return;
      // The model is presented in the dock, leaving the camera target unobstructed.
      model.setAttribute('visible', false);
      $('scan-status').textContent = `${location.name} recognized`; showLocation(location);
    });
    anchor.addEventListener('targetLost', () => {
      model.setAttribute('visible', false); model.emit('tour-lost');
      if (scene === element) $('scan-status').textContent = 'Tracking lost. Point at a tour target image.';
      // Keep the information panel visible for reading.
    });
    element.append(anchor);
  });
  return element;
}
async function startAR() {
  if (starting || active) return;
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return browse('Camera AR needs a supported browser and HTTPS. Explore the landmarks below.');
  if (!window.AFRAME || !window.MINDAR) return browse('AR libraries could not load. Check your connection, then reload to try again.');
  starting = true; $('start').disabled = true; say('Loading target images and 3D models…');
  const token = ++generation;
  try {
    const response = await fetch(TOUR.targets, { method: 'HEAD' });
    if (!response.ok) throw new Error('Target database unavailable');
    if (token !== generation) return;
    scene = buildScene(); const current = scene;
    current.addEventListener('arError', () => { if (token === generation) fail(); });
    current.addEventListener('arReady', () => {
      if (token !== generation) return;
      clearTimeout(watchdog); starting = false; active = true; say('');
      $('welcome').hidden = $('fallback').hidden = true; $('scan-controls').hidden = false;
      $('scan-status').textContent = 'Point at a tour target image.'; document.body.classList.add('scanning');
    });
    current.addEventListener('loaded', async () => {
      if (token !== generation) return;
      try { await current.systems['mindar-image-system'].start(); }
      catch (error) { if (token === generation) fail(error); }
    }, { once: true });
    $('viewer').hidden = false; $('viewer').append(current);
    watchdog = setTimeout(() => { if (token === generation && starting) fail(); }, 90000);
  } catch (error) { if (token === generation) fail(error); }
}
// Keep an unavailable original photo hidden rather than showing a broken image.
if (TOUR.welcomeImage) {
  const photo = $('old-main-photo');
  photo.addEventListener('load', () => { $('welcome-photo').hidden = false; }, { once: true });
  photo.addEventListener('error', () => { $('welcome-photo').hidden = true; });
  photo.src = TOUR.welcomeImage;
}
TOUR.locations.forEach(location => {
  const card = document.createElement('article'); card.className = 'card';
  const image = document.createElement('img'); image.src = location.image; image.alt = `${location.name} tour target`; image.loading = 'lazy';
  const title = document.createElement('h3'); title.textContent = location.name;
  const description = document.createElement('p'); description.textContent = location.description;
  const link = document.createElement('a'); link.className = 'button'; link.target = '_blank'; link.rel = 'noopener noreferrer';
  const note = document.createElement('p'); note.className = 'small'; note.textContent = 'Official Lion Shrine link awaiting verification.';
  configureLink(link, note, location); card.append(image, title, description, link, note); $('locations').append(card);
});
// Pointer events support both iPhone touch gestures and mouse dragging. Capture
// keeps a drag stable when the finger briefly leaves the pane; other panes scroll.
const modelHost = $('model-preview');
modelHost.addEventListener('pointerdown', event => {
  if (!preview.group || preview.drag || event.button !== 0) return;
  preview.turn(0, 0);
  preview.drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  modelHost.setPointerCapture(event.pointerId);
  modelHost.classList.add('dragging');
  modelHost.focus({ preventScroll: true });
});
modelHost.addEventListener('pointermove', event => {
  const drag = preview.drag;
  if (!drag || drag.id !== event.pointerId) return;
  const yaw = (event.clientX - drag.x) / Math.max(modelHost.clientWidth, 1) * Math.PI * 2;
  const pitch = (event.clientY - drag.y) / Math.max(modelHost.clientHeight, 1) * Math.PI;
  preview.turn(yaw, pitch);
  drag.x = event.clientX; drag.y = event.clientY;
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  modelHost.addEventListener(type, event => {
    if (preview.drag?.id !== event.pointerId) return;
    preview.drag = null;
    if (modelHost.hasPointerCapture(event.pointerId)) modelHost.releasePointerCapture(event.pointerId);
    modelHost.classList.remove('dragging');
  });
}
modelHost.addEventListener('keydown', event => {
  if (!preview.group) return;
  const step = Math.PI / 12;
  const turns = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (event.key === 'Home') { event.preventDefault(); preview.turn(0, 0, true); }
  else if (turns[event.key]) { event.preventDefault(); preview.turn(...turns[event.key]); }
});
$('start').addEventListener('click', startAR);
$('browse').addEventListener('click', () => browse());
$('stop').addEventListener('click', () => { stopAR(); $('welcome').hidden = false; say(''); $('start').focus(); });
$('back').addEventListener('click', () => { $('fallback').hidden = true; $('welcome').hidden = false; say(''); $('start').focus(); });
$('close-panel').addEventListener('click', () => { $('panel').hidden = true; preview.pause(); $('stop').focus(); });
window.addEventListener('pagehide', stopAR);
document.addEventListener('visibilitychange', () => { if (document.hidden && (active || starting)) { stopAR(); $('welcome').hidden = false; say('Camera paused. Tap Start AR to resume.'); } });
