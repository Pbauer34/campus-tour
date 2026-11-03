/* Target indices follow the owner's confirmed campus-tour.mind compilation order.
   Transform defaults need physical target/device tuning; preserve original assets. */
'use strict';
const TOUR = {
  targets: './assets/targets/campus-tour.mind',
  locations: [
    { id: 'westgate', targetIndex: 0, name: 'Westgate Building', image: './assets/targets/westgate-target.jpeg', model: './assets/models/computer.glb', scale: '0.25 0.25 0.25', position: '0 0 0.1', rotation: '0 0 0', description: "Home to Penn State's College of Information Sciences and Technology, Westgate Building supports education and research in cybersecurity, information technology, and data sciences.", linkLabel: 'Explore Penn State IST', url: 'https://ist.psu.edu/' },
    { id: 'lion-shrine', targetIndex: 1, name: 'Nittany Lion Shrine', image: './assets/targets/lion-shrine-target.jpeg', model: './assets/models/pawprint.glb', scale: '0.25 0.25 0.25', position: '0 0 0.1', rotation: '0 0 0', description: "The Nittany Lion Shrine is one of Penn State's most recognizable landmarks and represents the university's history, traditions, and school pride.", linkLabel: 'Learn About the Lion Shrine', url: null },
    { id: 'beaver-stadium', targetIndex: 2, name: 'Beaver Stadium', image: './assets/targets/beaver-stadium-target.jpeg', model: './assets/models/football.glb', scale: '0.25 0.25 0.25', position: '0 0 0.1', rotation: '0 0 0', description: 'Beaver Stadium is the home of Penn State football and one of the most recognizable landmarks on the University Park campus.', linkLabel: 'Visit Penn State Athletics', url: 'https://gopsusports.com/' }
  ]
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
}
function stopAR() {
  generation++; clearTimeout(watchdog);
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
    model.addEventListener('model-error', () => { if (scene === element) say(`${location.name}'s model could not load. Exit the camera to explore the location information.`); });
    anchor.append(model);
    anchor.addEventListener('targetFound', () => {
      if (!active || scene !== element) return;
      model.setAttribute('visible', true); model.emit('tour-found');
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
TOUR.locations.forEach(location => {
  const card = document.createElement('article'); card.className = 'card';
  const image = document.createElement('img'); image.src = location.image; image.alt = `${location.name} tour target`; image.loading = 'lazy';
  const title = document.createElement('h3'); title.textContent = location.name;
  const description = document.createElement('p'); description.textContent = location.description;
  const link = document.createElement('a'); link.className = 'button'; link.target = '_blank'; link.rel = 'noopener noreferrer';
  const note = document.createElement('p'); note.className = 'small'; note.textContent = 'Official Lion Shrine link awaiting verification.';
  configureLink(link, note, location); card.append(image, title, description, link, note); $('locations').append(card);
});
$('start').addEventListener('click', startAR);
$('browse').addEventListener('click', () => browse());
$('stop').addEventListener('click', () => { stopAR(); $('welcome').hidden = false; say(''); $('start').focus(); });
$('back').addEventListener('click', () => { $('fallback').hidden = true; $('welcome').hidden = false; say(''); $('start').focus(); });
$('close-panel').addEventListener('click', () => { $('panel').hidden = true; $('stop').focus(); });
window.addEventListener('pagehide', stopAR);
document.addEventListener('visibilitychange', () => { if (document.hidden && (active || starting)) { stopAR(); $('welcome').hidden = false; say('Camera paused. Tap Start AR to resume.'); } });
