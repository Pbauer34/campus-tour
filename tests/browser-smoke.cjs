const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 // Optional verified local CDN copies for environments with browser proxy restrictions.
 if (process.env.TEST_DEPENDENCY_DIR) {
 await page.route('https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-master.min.js',r=>r.fulfill({path:require('node:path').join(process.env.TEST_DEPENDENCY_DIR,'aframe.js'),contentType:'application/javascript'}));
 await page.route('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js',r=>r.fulfill({path:require('node:path').join(process.env.TEST_DEPENDENCY_DIR,'mindar.js'),contentType:'application/javascript'}));
 }
 await page.goto('http://127.0.0.1:8001/campus-tour/');
 await page.waitForFunction(()=>window.AFRAME && window.MINDAR);
 const targets=await page.evaluate(async()=>new window.MINDAR.IMAGE.Compiler().importData(await (await fetch('./assets/targets/campus-tour.mind')).arrayBuffer()).length); assert.equal(targets,3); console.log('PASS: MindAR imports database with 3 targets');
 await page.locator('#browse').click(); assert.equal(await page.locator('#locations article').count(),3); assert(await page.locator('#fallback').isVisible());
 assert.equal(await page.locator('#locations a:visible').count(),2);
 assert(await page.locator('#locations').evaluate(e=>e.scrollWidth<=document.documentElement.clientWidth));
 await page.locator('#back').click(); assert(await page.locator('#welcome').isVisible());
 for(const path of ['assets/targets/campus-tour.mind','assets/models/computer.glb','assets/models/pawprint.glb','assets/models/football.glb','assets/targets/westgate-target.jpeg','assets/targets/lion-shrine-target.jpeg','assets/targets/beaver-stadium-target.jpeg']) {
  const res=await page.request.get('http://127.0.0.1:8001/campus-tour/'+path); assert.equal(res.status(),200,path);
 }
 // Exercise app lifecycle/event handlers with a controlled AR system; physical tracking is not simulated.
 await page.evaluate(()=>{
  window.originalBuild=buildScene;
  buildScene=()=>{const e=originalBuild();e.addEventListener('loaded',()=>{e.systems['mindar-image-system'].start=async()=>e.emit('arReady');e.systems['mindar-image-system'].stop=()=>{};},{once:true});return e;};
 });
 await page.locator('#start').click(); await page.waitForFunction(()=>document.body.classList.contains('scanning'));
 await page.waitForFunction(()=>[...document.querySelectorAll('[gltf-model]')].every(e=>e.getObject3D('mesh')));
 console.log('PASS: all three GLBs loaded into A-Frame meshes');
 assert.equal(await page.locator('[mindar-image-target]').count(),3);
 for(let i=0;i<3;i++){
  await page.evaluate(i=>document.querySelectorAll('[mindar-image-target]')[i].emit('targetFound'),i);
  assert(await page.locator('#panel').isVisible());
  await page.evaluate(i=>document.querySelectorAll('[mindar-image-target]')[i].emit('targetLost'),i);
  assert(await page.locator('#panel').isVisible());
  await page.locator('#close-panel').click(); assert(await page.locator('#panel').isHidden());
 }
 await page.locator('#stop').click(); assert.equal(await page.locator('a-scene').count(),0);
 await page.evaluate(()=>{buildScene=()=>{const e=originalBuild();e.addEventListener('loaded',()=>{e.systems['mindar-image-system'].start=async()=>{throw new DOMException('Denied','NotAllowedError')};},{once:true});return e;};});
 await page.locator('#start').click(); await page.waitForSelector('#fallback:not([hidden])'); assert.match(await page.locator('#status').textContent(),/permission was denied/);
 assert.deepEqual(errors,[]); console.log('PASS: dependencies initialize; 7 assets served under subpath; fallback/navigation; 3 target panel events; close/persistence; stop; denied-camera recovery. AR start mocked; no physical tracking verified.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
