import * as THREE from './vendor/three.module.js';
import { levels, createBase, createPiece } from './models.js';

const stage = document.querySelector('#stage');
const tray = document.querySelector('#tray');
const grid = document.querySelector('#pieceGrid');
const feedback = document.querySelector('#feedback');
const storageKey = 'little-worlds.progress.v1';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let progress = {};
let levelId = 'dessert';
let selected = null;
let yaw = -.35;
let elevation = .58;
let zoom = 1;
let root, scene, camera, renderer, trayRenderer;
let parts = [];
let previews = [];
let dirty = true;
let drag = null;
let pieceDrag = null;
let animation = null;
let hintUntil = 0;
let resetUntil = 0;
let soundEnabled = false;
let audioContext;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// 安全讀取已知關卡的進度，忽略損壞或不屬於本遊戲的資料。
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const [id, level] of Object.entries(levels)) {
      const valid = new Set(level.pieces.map(getPieceId));
      progress[id] = Array.isArray(saved?.[id]) ? [...new Set(saved[id].filter(valid.has, valid))] : [];
    }
  } catch {
    progress = { dessert:[], space:[], ocean:[] };
  }
}

// 取得零件識別碼，用於驗證進度。
function getPieceId(piece) {
  return piece.id;
}

// 只保存已拼上的識別碼，儲存受限時仍能繼續遊戲。
function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    document.querySelector('#saveNote').textContent = '此瀏覽器無法保存，進度只保留在本頁';
  }
}

// 以相同的柔光照亮主場景與零件預覽。
function addLights(target, shadows = false) {
  target.add(new THREE.HemisphereLight('#fff9eb','#9bada5',2.3));
  const sun = new THREE.DirectionalLight('#fff2d7',3.2);
  sun.position.set(-3,7,5);
  sun.castShadow = shadows;
  sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:20});
  sun.shadow.normalBias = .035;
  sun.shadow.bias = -.0002;
  sun.shadow.radius = 4;
  target.add(sun);
  const fill = new THREE.DirectionalLight('#dce9ff',.8);
  fill.position.set(4,3,-4);
  target.add(fill);
}

// 释放關卡模型的 GPU 資源，避免切換主題累積記憶體。
function disposeGroup(group) {
  group.traverse(disposeObject);
}

// 釋放模型目前與暫存的原始材質。
function disposeObject(object) {
  if (!object.isMesh) return;
  object.geometry.dispose();
  object.material.dispose();
  if (object.userData.originalMaterial && object.userData.originalMaterial !== object.material) {
    object.userData.originalMaterial.dispose();
  }
}

// 設定缺件的灰色外觀，同時保留拼上後的彩色材質。
function makeGhost(object) {
  if (!object.isMesh) return;
  object.userData.originalMaterial = object.material;
  object.material = new THREE.MeshStandardMaterial({ color:'#c5c7bd',roughness:.96,metalness:0 });
}

// 將已拼上的模型還原為原本的顏色。
function restoreColor(object) {
  if (!object.isMesh || !object.userData.originalMaterial) return;
  object.material.dispose();
  object.material = object.userData.originalMaterial;
  delete object.userData.originalMaterial;
}

// 建立一個關卡並保留其他關卡已完成的進度。
function loadLevel(id) {
  if (!levels[id]) return;
  cancelDrag();
  if (root) { scene.remove(root); disposeGroup(root); }
  for (const preview of previews) disposeGroup(preview.group);
  levelId = id;
  selected = null;
  animation = null;
  hintUntil = 0;
  resetUntil = 0;
  yaw = -.35; elevation = .58; zoom = 1;
  parts = []; previews = [];
  root = new THREE.Group();
  root.add(createBase(id));
  scene.add(root);
  grid.replaceChildren();
  document.querySelector('#targetButtons').replaceChildren();
  const level = levels[id];
  for (const [index, definition] of level.pieces.entries()) {
    const group = createPiece(definition.id);
    group.position.set(...definition.at);
    group.rotation.y = definition.turn || 0;
    const done = progress[id].includes(definition.id);
    group.userData.pieceId = definition.id;
    if (!done) group.traverse(makeGhost);
    root.add(group);
    parts.push({ definition, group, done });
    const button = document.createElement('button');
    button.className = 'piece';
    button.draggable = false;
    button.dataset.piece = definition.id;
    button.setAttribute('aria-label',`選取${definition.name}`);
    button.setAttribute('aria-pressed','false');
    button.innerHTML = `<canvas class="piece-preview" aria-hidden="true"></canvas><span class="piece-index">${String(index+1).padStart(2,'0')}</span><span class="piece-check"></span><span class="piece-name">${definition.name}</span>`;
    button.querySelector('canvas').draggable = false;
    grid.append(button);
    const target = document.createElement('button');
    target.dataset.target = definition.id;
    target.textContent = `${index+1}. ${definition.name}的位置`;
    document.querySelector('#targetButtons').append(target);
    const previewScene = new THREE.Scene();
    addLights(previewScene);
    const pivot = new THREE.Group();
    const model = createPiece(definition.id);
    model.rotation.y = definition.turn || 0;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    model.position.sub(bounds.getCenter(new THREE.Vector3()));
    pivot.add(model);
    pivot.scale.setScalar(1.5 / Math.max(size.x,size.y,size.z));
    previewScene.add(pivot);
    previews.push({ scene:previewScene, group:pivot, camera:new THREE.OrthographicCamera(-1.3,1.3,1.2,-1.2,.1,30), button, canvas:button.querySelector('canvas'), id:definition.id });
  }
  document.querySelector('#sceneTitle').textContent = level.title;
  document.querySelector('#chapter').textContent = `SCENE ${level.chapter}`;
  document.querySelector('.scene-panel').style.background = `radial-gradient(ellipse at 45% 38%, #fffdf6, ${level.color})`;
  document.querySelector('#completion').hidden = true;
  document.querySelector('#reset').textContent = '重新拼這一關';
  feedback.textContent = progress[id].length === level.pieces.length ? '這個世界已完成！點一下拼好的小物，看看它的小動作。' : '先挑一個你喜歡的小物吧。拼好後再點它，還會動喔！';
  updateUi();
  resize();
}

// 更新進度、選取狀態與無障礙按鈕。
function updateUi() {
  const completed = progress[levelId].length;
  const total = levels[levelId].pieces.length;
  document.querySelector('#count').innerHTML = `${completed}<span> / ${total}</span>`;
  document.querySelector('#progressBar').style.width = `${completed/total*100}%`;
  for (const button of document.querySelectorAll('[data-level]')) {
    button.setAttribute('aria-pressed',String(button.dataset.level === levelId));
    button.querySelector('.theme-progress').textContent = `${progress[button.dataset.level].length} / ${levels[button.dataset.level].pieces.length}`;
  }
  for (const part of parts) {
    const button = grid.querySelector(`[data-piece="${part.definition.id}"]`);
    button.disabled = part.done;
    button.classList.toggle('done',part.done);
    button.classList.toggle('selected',part.definition.id === selected);
    button.setAttribute('aria-pressed',String(part.definition.id === selected));
    button.querySelector('.piece-check').textContent = part.done ? '✓' : '';
    document.querySelector(`[data-target="${part.definition.id}"]`).disabled = part.done;
  }
  dirty = true;
}

// 選擇待拼的零件，不自動顯示答案位置。
function selectPiece(id) {
  const part = parts.find(findSelectedPart, id);
  if (!part || part.done) return;
  selected = id;
  hintUntil = 0;
  feedback.textContent = `拿起了「${part.definition.name}」。轉轉世界，找找相同的灰色形狀。`;
  updateUi();
}

// 依傳入識別碼尋找對應的拼圖零件。
function findSelectedPart(part) {
  return part.definition.id === String(this);
}

// 判斷配對並上色；錯誤不扣分，也不會消耗零件。
function placePiece(id) {
  const part = parts.find(findSelectedPart,id);
  if (!selected && part?.done) {
    animatePiece(part);
    const flame=part.group.getObjectByName('candleFlame');
    feedback.textContent = flame ? (flame.visible ? '蠟燭點亮了！再點一下就會熄掉。' : '呼！蠟燭熄掉了。再點一下可以點亮。') : `「${part.definition.name}」跟你打招呼！再點其他拼好的小物試試。`;
    if (!part.group.getObjectByName('drumHead')) playTone(true);
    return;
  }
  if (!selected) { feedback.textContent = '先從小物盤挑一件，再把它放回來。'; return; }
  if (!part || part.done || id !== selected) {
    feedback.textContent = '差一點點！形狀不太一樣，轉個角度再找找。';
    playTone(false);
    return;
  }
  part.done = true;
  part.group.traverse(restoreColor);
  progress[levelId].push(id);
  selected = null;
  hintUntil = 0;
  animatePiece(part);
  saveProgress();
  const remaining = levels[levelId].pieces.length-progress[levelId].length;
  feedback.textContent = `喀！「${part.definition.name}」找到家了。${remaining ? `還有 ${remaining} 件小物。` : '全部完成！'}`;
  playTone(true);
  updateUi();
  if (remaining === 0) {
    document.querySelector('#completeText').textContent = levels[levelId].message;
    document.querySelector('#completion').hidden = false;
  }
}

// 還原小物的位置與方向，避免連續點擊累積偏移。
function resetPiecePose(part) {
  if (animation?.poses) {
    for (const pose of animation.poses) {
      pose.object.position.copy(pose.position);
      pose.object.rotation.copy(pose.rotation);
      pose.object.scale.copy(pose.scale);
      pose.object.visible=pose.visible;
    }
    return;
  }
  part.group.position.set(...part.definition.at);
  part.group.rotation.set(0,part.definition.turn || 0,0);
  part.group.scale.setScalar(1);
}

// 拼好或點擊已完成的小物時，播放符合物件種類的小動作。
function animatePiece(part) {
  if (animation) resetPiecePose(animation.part);
  animation = null;
  const flame=part.group.getObjectByName('candleFlame');
  if (flame) {
    flame.visible=!flame.visible;
    dirty=true;
    return;
  }
  const name = part.definition.name;
  const wing=part.group.getObjectByName('birdWing');
  const drum=part.group.getObjectByName('drumHead');
  const rocketIds=['nose','fin','backFin','window','antenna'];
  const motion = levelId==='space' && rocketIds.includes(part.definition.id) ? 'launch' : part.group.userData.interaction?.motion || (wing ? 'bird' : drum ? 'drum' : pieceMotion(part.definition.id));
  const target=motion==='launch' ? root.getObjectByName('rocket') : wing || drum || part.group;
  const poses=[];
  // 保存局部模型姿勢，動畫結束或中斷時精確還原。
  target.traverse(function savePose(object) {
    poses.push({ object,position:object.position.clone(),rotation:object.rotation.clone(),scale:object.scale.clone(),visible:object.visible });
  });
  const passengers=motion==='launch' ? parts.filter(function rocketPassenger(item) { return item.done && rocketIds.includes(item.definition.id); }).map(function passengerPose(item) {
    const object=item.group;
    const pose={ object,position:object.position.clone(),rotation:object.rotation.clone(),scale:object.scale.clone(),visible:object.visible };
    poses.push(pose);
    return pose;
  }) : [];
  animation = reducedMotion ? null : { part, target, poses, passengers, motion, start:performance.now() };
  if (motion === 'drum') playTone(true, true);
  dirty = true;
}

// 每關明確分配不同動作，避免大多數小物都套用搖擺。
function pieceMotion(id) {
  const motions={
    dessert:['hop','sway','flip','squash','hop','nod','orbit','spin','nod','sway'],
    space:['launch','launch','launch','spin','sway','orbit','launch','nod','hop','pulse','launch','spin','orbit','hop','flip'],
    ocean:['sway','swim','nod','spin','nod','sway','scuttle','swim','float','swim','pulse','flip','squash','float','nod','hop','spin','sway','sway','float'],
    forest:['squash','hop','hop','nod','pulse','bird','squash','nod','sway','roll','nod','scuttle','squash','hop','float','roll','spin','flip','squash','pulse','hop','float'],
    museum:['nod','nod','hop','squash','pulse','sway','nod','spin','hop','flip','sway','float','flip','pulse','sway','nod','spin','hop','hop','sway','pulse','nod','flip','flip','spin'],
    carnival:['float','spin','hop','scuttle','pulse','sway','flip','drum','squash','orbit','squash','float','spin','scuttle','hop','hop','flip','nod','spin','spin','sway','spin','hop','swim','pulse','squash','spin','nod'],
  };
  const index=levels[levelId].pieces.findIndex(function matchingPiece(piece) { return piece.id===id; });
  return motions[levelId]?.[index] || 'sway';
}

// 以射線選取真正可見的物件，避免穿透前面的模型拼背面。
function placeAt(clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  if (clientX<rect.left || clientX>rect.right || clientY<rect.top || clientY>rect.bottom) return;
  pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);
  scene.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer,camera);
  const hit = raycaster.intersectObject(root,true)[0];
  if (!selected) {
    let scenery=hit?.object;
    while(scenery && !scenery.userData.interaction && !scenery.userData.pieceId) scenery=scenery.parent;
    if(scenery?.userData.interaction) {
      animatePiece({ group:scenery,definition:{ name:scenery.userData.interaction.name } });
      feedback.textContent=`${scenery.userData.interaction.name}動起來了！原本就在這裡的東西也能玩。`;
      return;
    }
  }
  let object = hit?.object;
  while(object && !object.userData.pieceId) object = object.parent;
  if (!object?.userData.pieceId && selected) {
    // 給細小零件少量點擊容錯，但仍須有可見表面且不穿透其他模型。
    for (const [dx,dy] of [[8,0],[-8,0],[0,8],[0,-8],[6,6],[-6,-6]]) {
      const nearby=new THREE.Vector2(pointer.x+dx/rect.width*2,pointer.y+dy/rect.height*2);
      raycaster.setFromCamera(nearby,camera);
      let nearObject=raycaster.intersectObject(root,true)[0]?.object;
      while(nearObject && !nearObject.userData.pieceId) nearObject=nearObject.parent;
      if (nearObject?.userData.pieceId===selected) { object=nearObject;break; }
    }
  }
  if (selected && object?.userData.pieceId!==selected) {
    const selectedPart=parts.find(findSelectedPart,selected);
    const center=new THREE.Box3().setFromObject(selectedPart.group).getCenter(new THREE.Vector3()).project(camera);
    const centerX=rect.left+(center.x+1)/2*rect.width;
    const centerY=rect.top+(1-center.y)/2*rect.height;
    if (Math.hypot(clientX-centerX,clientY-centerY)<=28) object=selectedPart.group;
  }
  placePiece(object?.userData.pieceId);
}

// 根據容器更新尺寸，讓窄螢幕仍看得到完整底座。
function resize() {
  const width = stage.clientWidth, height = stage.clientHeight;
  renderer.setSize(width,height);
  const aspect = width/height;
  const half = Math.max(2.85,3.2/aspect)/zoom;
  camera.left = -half*aspect; camera.right = half*aspect;
  camera.top = half; camera.bottom = -half;
  camera.updateProjectionMatrix();
  dirty = true;
}

// 將所有零件的方向與場景同步，並只在需要時重新繪製。
function renderFrame(time) {
  requestAnimationFrame(renderFrame);
  if (hintUntil && time>hintUntil) { hintUntil=0;dirty=true; }
  if (document.hidden || (!dirty && !animation && time>hintUntil)) return;
  dirty = false;
  root.rotation.y = yaw;
  camera.position.set(0,.9+Math.sin(elevation)*10,Math.cos(elevation)*10);
  camera.lookAt(0,.9,0);
  if (animation) {
    const { part, motion, target, poses } = animation;
    const t = Math.min(1,(time-animation.start)/(motion==='launch'?3600:motion==='wheel'?3200:1200));
    const rest=poses[0];
    const wave = Math.sin(t*Math.PI*4)*Math.sin(t*Math.PI);
    if (motion === 'bird') target.rotation.x=rest.rotation.x+wave*1.2;
    else if (motion === 'drum') target.position.y=rest.position.y-Math.abs(wave)*.045;
    else if (motion === 'wheel') {
      target.rotation.x=rest.rotation.x+t*Math.PI*2;
      for(const child of target.children) if(child.name==='wheelCabin') child.rotation.x=-t*Math.PI*2;
    } else if (motion === 'cake') target.scale.y=rest.scale.y*(1+wave*.06);
    else if (motion === 'launch') {
      const lift=(1-Math.cos(t*Math.PI*2))*.48;
      target.position.y=rest.position.y+lift;
      for(const pose of animation.passengers) pose.object.position.y=pose.position.y+lift;
      const exhaust=target.getObjectByName('rocketExhaust');
      exhaust.visible=t>0 && t<1;
      exhaust.scale.y=(.45+lift*.5)*(1+Math.sin(t*100)*.12);
    }
    else if (motion === 'sea') target.position.y=rest.position.y+wave*.06;
    else if (motion === 'tree') target.rotation.z=rest.rotation.z+wave*.12;
    else if (motion === 'hop') target.position.y=rest.position.y+Math.abs(Math.sin(t*Math.PI*2))*.23;
    else if (motion === 'spin') target.rotation.y=rest.rotation.y+t*Math.PI*2;
    else if (motion === 'flip') target.rotation.x=rest.rotation.x+t*Math.PI*2;
    else if (motion === 'nod') target.rotation.x=rest.rotation.x+wave*.3;
    else if (motion === 'squash') target.scale.set(rest.scale.x*(1+wave*.12),rest.scale.y*(1-wave*.18),rest.scale.z*(1+wave*.12));
    else if (motion === 'pulse') target.scale.copy(rest.scale).multiplyScalar(1+Math.sin(t*Math.PI*3)**2*.14);
    else if (motion === 'float') target.position.y=rest.position.y+Math.sin(t*Math.PI)*.3;
    else if (motion === 'scuttle' || motion === 'swim') {
      target.position.x=rest.position.x+wave*.22;
      target.rotation.y=rest.rotation.y+wave*(motion==='swim'?.3:.08);
    } else if (motion === 'orbit') {
      target.position.x=rest.position.x+Math.sin(t*Math.PI*2)*.2;
      target.position.y=rest.position.y+(1-Math.cos(t*Math.PI*2))*.12;
    } else if (motion === 'roll') {
      target.rotation.z=rest.rotation.z+wave*.7;
      target.position.x=rest.position.x+wave*.13;
    }
    else target.rotation.z=rest.rotation.z+wave*.2;
    if (t>=1) { resetPiecePose(part); animation = null; }
  }
  for (const part of parts) {
    if (part.done) continue;
    const glowing = part.definition.id === selected && time<hintUntil;
    // 提示時以明亮薄荷色標示零件，並保持正常的遮蔽關係。
    part.group.traverse(function colorHint(object) {
      if (!object.isMesh) return;
      object.material.color.set(glowing ? '#a9c987' : '#c5c7bd');
      object.material.emissive.set(glowing ? '#57723c' : '#000000');
      object.material.emissiveIntensity = glowing ? .3 : 0;
    });
  }
  renderer.render(scene,camera);
  const trayRect = tray.getBoundingClientRect();
  for (const preview of previews) {
    const rect = preview.button.getBoundingClientRect();
    if (rect.bottom<trayRect.top || rect.top>trayRect.bottom) continue;
    const width = rect.width-12, height = rect.height-32;
    trayRenderer.setSize(width,height,false);
    preview.group.rotation.y = yaw;
    preview.camera.left = -1.3*width/height;
    preview.camera.right = 1.3*width/height;
    preview.camera.updateProjectionMatrix();
    preview.camera.position.set(0,Math.sin(elevation)*6,Math.cos(elevation)*6);
    preview.camera.lookAt(0,0,0);
    trayRenderer.render(preview.scene,preview.camera);
    // 立即複製至每個按鈕自己的 2D 畫布，避免內建瀏覽器透明疊層變黑。
    preview.canvas.width=trayRenderer.domElement.width;
    preview.canvas.height=trayRenderer.domElement.height;
    preview.canvas.getContext('2d').drawImage(trayRenderer.domElement,0,0);
  }
}

// 按需播放短促木琴音，不使用外部音訊或麥克風。
function playTone(success, drum = false) {
  if (!soundEnabled) return;
  try {
    audioContext ||= new AudioContext();
    audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(drum ? 150 : success ? 660 : 220,audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(drum ? 45 : success ? 990 : 180,audioContext.currentTime+.12);
    gain.gain.setValueAtTime(.12,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.25);
    oscillator.connect(gain);gain.connect(audioContext.destination);
    oscillator.start();oscillator.stop(audioContext.currentTime+.27);
  } catch {
    feedback.textContent = '此瀏覽器無法播放音效，仍然可以繼續拼圖。';
  }
}

// 提示會轉到選中物件所在的一面，短暫上色但不代為拼好。
function showHint() {
  if (!selected) {
    const next = parts.find(isUnfinished);
    if (!next) { feedback.textContent = '全都拼好了，換一個世界繼續探索吧！'; return; }
    selectPiece(next.definition.id);
  }
  const part = parts.find(findSelectedPart,selected);
  yaw = -Math.atan2(part.definition.at[0],part.definition.at[2]);
  elevation = .65;
  hintUntil = performance.now()+4500;
  feedback.textContent = `「${part.definition.name}」的位置亮起來了！點那個薄荷綠形狀。`;
  dirty = true;
}

// 尋找尚未拼好的零件。
function isUnfinished(part) {
  return !part.done;
}

// 起始旋轉手勢，短按與拖動分開判斷。
function startRotation(event) {
  if (event.button !== 0 || drag) return;
  stage.setPointerCapture(event.pointerId);
  drag = { id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false };
}

// 滑動時旋轉整體模型與零件盤。
function moveRotation(event) {
  if (!drag || drag.id !== event.pointerId) return;
  const dx = event.clientX-drag.x, dy = event.clientY-drag.y;
  if (Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>5) drag.moved = true;
  if (drag.moved) {
    yaw += dx*.009;
    elevation = THREE.MathUtils.clamp(elevation+dy*.006,.15,1.25);
    hintUntil = 0;
    dirty = true;
  }
  drag.x=event.clientX;drag.y=event.clientY;
}

// 點按時拼接，拖曳結束則保持新視角。
function endRotation(event) {
  if (!drag || drag.id !== event.pointerId) return;
  const clicked = !drag.moved;
  drag = null;
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  if (clicked) placeAt(event.clientX,event.clientY);
}

// 取消手勢時避免誤觸拼圖。
function cancelDrag() {
  drag = null;
  if (pieceDrag) finishPieceDrag(false);
  stage.classList.remove('drop-target');
}

// 讓半透明小物跟著指標移動，觸控時稍微抬高以免被手指遮住。
function positionDragGhost(event) {
  const offset=pieceDrag.touchOffset || 28;
  pieceDrag.ghost.style.left=`${event.clientX-50}px`;
  pieceDrag.ghost.style.top=`${event.clientY-offset-50}px`;
}

// 放對時收起分身，放錯或取消時讓小物彈回原本格子。
function finishPieceDrag(placed) {
  const current=pieceDrag;
  if (!current) return;
  pieceDrag=null;
  current.button.classList.remove('dragging');
  current.button.blur();
  if (current.button.hasPointerCapture(current.id)) current.button.releasePointerCapture(current.id);
  stage.classList.remove('drop-target');
  if (placed || !current.moved || reducedMotion) {
    current.ghost.remove();
    return;
  }
  const target=current.button.querySelector('canvas').getBoundingClientRect();
  const source=current.ghost.getBoundingClientRect();
  const dx=target.left+target.width/2-source.left-source.width/2;
  const dy=target.top+target.height/2-source.top-source.height/2;
  const returning=current.ghost.animate([
    { transform:'translate(0,0) scale(1)',opacity:.85 },
    { transform:`translate(${dx}px,${dy}px) scale(.75)`,opacity:.7,offset:.85 },
    { transform:`translate(${dx}px,${dy}px) scale(.9)`,opacity:0 },
  ],{ duration:360,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards' });
  // 動畫完成或被中斷後都移除暫時的畫布。
  function removeGhost() { current.ghost.remove(); }
  returning.finished.then(removeGhost,removeGhost);
}

// 選取零件並記錄拖曳起點。
function startPieceDrag(event) {
  const button = event.target.closest('[data-piece]');
  if (!button || button.disabled || event.button!==0) return;
  if (pieceDrag) return;
  selectPiece(button.dataset.piece);
  button.classList.add('dragging');
  button.setPointerCapture(event.pointerId);
  const source=button.querySelector('canvas');
  const ghost=document.createElement('canvas');
  ghost.className='drag-ghost';
  ghost.setAttribute('aria-hidden','true');
  ghost.width=source.width;
  ghost.height=source.height;
  ghost.getContext('2d').drawImage(source,0,0);
  document.body.append(ghost);
  pieceDrag = { x:event.clientX,y:event.clientY,id:event.pointerId,button,ghost,moved:false,pieceId:button.dataset.piece,touchOffset:event.pointerType==='touch' ? 65 : 0 };
  positionDragGhost(event);
}

// 阻止瀏覽器建立黑底原生拖曳影像，保留遊戲自己的拖曳邏輯。
function preventNativeDrag(event) {
  event.preventDefault();
}

// 拖曳中用醒目邊框提示目前可放置的場景區域。
function movePieceDrag(event) {
  if (!pieceDrag || pieceDrag.id!==event.pointerId) return;
  pieceDrag.moved ||= Math.hypot(event.clientX-pieceDrag.x,event.clientY-pieceDrag.y)>8;
  positionDragGhost(event);
  const rect=stage.getBoundingClientRect();
  const dropY=event.clientY-pieceDrag.touchOffset;
  const inside=event.clientX>=rect.left && event.clientX<=rect.right && dropY>=rect.top && dropY<=rect.bottom;
  stage.classList.toggle('drop-target',inside);
  feedback.textContent=inside ? '放開，把這件小物放進灰色位置。' : '繼續拖到立體場景裡。';
}

// 把從零件盤拖出的物件放在指標落下的位置。
function endPieceDrag(event) {
  if (!pieceDrag || pieceDrag.id!==event.pointerId) return;
  pieceDrag.moved ||= Math.hypot(event.clientX-pieceDrag.x,event.clientY-pieceDrag.y)>8;
  if (pieceDrag.moved) placeAt(event.clientX,event.clientY-pieceDrag.touchOffset);
  const placed=progress[levelId].includes(pieceDrag.pieceId);
  if (pieceDrag.moved && !placed) feedback.textContent='還沒找到家，小物先彈回格子裡。再試一次吧！';
  finishPieceDrag(placed);
}

// 以鍵盤或普通點擊選取零件。
function clickPiece(event) {
  const button=event.target.closest('[data-piece]');
  if (button && !button.disabled && button.dataset.piece!==selected) selectPiece(button.dataset.piece);
}

// 主題按鈕直接切換關卡。
function changeTheme(event) {
  const button=event.target.closest('[data-level]');
  if (button) loadLevel(button.dataset.level);
}

// 以鍵盤友善的按鈕嘗試拼接選中的零件。
function clickTarget(event) {
  const button=event.target.closest('[data-target]');
  if (button) placePiece(button.dataset.target);
}

// 滾輪僅縮放遊戲，限制最大最小倍率。
function wheelZoom(event) {
  event.preventDefault();
  zoom=THREE.MathUtils.clamp(zoom-event.deltaY*.001, .75,1.45);
  resize();
}

// 提供鍵盤旋轉與縮放替代操作。
function keyboardRotate(event) {
  const moves = { ArrowLeft:-.18,ArrowRight:.18 };
  if (event.key in moves) yaw+=moves[event.key];
  else if (event.key==='ArrowUp') elevation=Math.min(1.25,elevation+.1);
  else if (event.key==='ArrowDown') elevation=Math.max(.15,elevation-.1);
  else if (event.key==='+' || event.key==='=') zoom=Math.min(1.45,zoom+.1);
  else if (event.key==='-') zoom=Math.max(.75,zoom-.1);
  else return;
  event.preventDefault();resize();
}

// 處理觀看工具與音效開關。
function clickTool(event) {
  const id=event.target.closest('button')?.id;
  if (id==='left') yaw-=Math.PI/4;
  else if(id==='right') yaw+=Math.PI/4;
  else if(id==='home') { yaw=-.35;elevation=.58;zoom=1; }
  else if(id==='zoomIn') zoom=Math.min(1.45,zoom+.12);
  else if(id==='zoomOut') zoom=Math.max(.75,zoom-.12);
  else if(id==='sound') {
    soundEnabled=!soundEnabled;
    document.querySelector('#sound').textContent=`音效：${soundEnabled?'開':'關'}`;
    document.querySelector('#sound').setAttribute('aria-pressed',String(soundEnabled));
    playTone(true);
  } else return;
  resize();
}

// 同步專心模式與原生全螢幕，退出時保留目前關卡和觀看角度。
function setFocusMode(enabled) {
  document.body.classList.toggle('focus-mode',enabled);
  const button=document.querySelector('#focusMode');
  button.textContent=enabled ? '⛶ 退出全螢幕' : '⛶ 全螢幕玩';
  button.setAttribute('aria-pressed',String(enabled));
  requestAnimationFrame(resize);
}

// 由按鈕進入全螢幕；瀏覽器不支援時仍提供鋪滿視窗的專心模式。
async function toggleFocusMode() {
  if (document.body.classList.contains('focus-mode')) {
    if (document.fullscreenElement) await document.exitFullscreen();
    setFocusMode(false);
    return;
  }
  setFocusMode(true);
  try {
    await document.documentElement.requestFullscreen();
  } catch {
    feedback.textContent='已進入專心模式！這個瀏覽器無法隱藏上方工具列，按 Esc 可以退出。';
  }
}

// 使用瀏覽器的退出操作時，同步還原一般版面。
function fullscreenChanged() {
  setFocusMode(Boolean(document.fullscreenElement));
}

// 非原生全螢幕也能用 Escape 離開專心模式。
function escapeFocusMode(event) {
  if (event.key==='Escape' && !document.fullscreenElement && document.body.classList.contains('focus-mode')) {
    setFocusMode(false);
    document.querySelector('#focusMode').focus();
  }
}

// 重玩需要短時間內再點一次，避免誤清掉進度。
function resetLevel() {
  if (performance.now()>resetUntil) {
    resetUntil=performance.now()+5000;
    document.querySelector('#reset').textContent='確定重來？再按一次清除此關進度';
    return;
  }
  progress[levelId]=[];saveProgress();loadLevel(levelId);
}

// 完成後切換到下一個主題。
function nextLevel() {
  const ids=Object.keys(levels);
  loadLevel(ids[(ids.indexOf(levelId)+1)%ids.length]);
}

// 初始化兩個共用繪圖器，所有零件預覽共用單一 WebGL 畫布。
function initialize() {
  loadProgress();
  renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  stage.append(renderer.domElement);
  trayRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  trayRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
  trayRenderer.toneMapping=THREE.ACESFilmicToneMapping;
  trayRenderer.toneMappingExposure=1.15;
  trayRenderer.setClearColor(0x000000,0);
  scene=new THREE.Scene();
  addLights(scene,true);
  camera=new THREE.OrthographicCamera(-4,4,3,-3,.1,50);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.235;floor.receiveShadow=true;
  scene.add(floor);
  document.querySelector('#loading').hidden=true;
  loadLevel('dessert');
  stage.addEventListener('pointerdown',startRotation);
  stage.addEventListener('pointermove',moveRotation);
  stage.addEventListener('pointerup',endRotation);
  stage.addEventListener('pointercancel',cancelDrag);
  stage.addEventListener('wheel',wheelZoom,{passive:false});
  stage.addEventListener('keydown',keyboardRotate);
  grid.addEventListener('pointerdown',startPieceDrag);
  grid.addEventListener('dragstart',preventNativeDrag);
  document.addEventListener('pointermove',movePieceDrag);
  grid.addEventListener('pointerup',endPieceDrag);
  grid.addEventListener('pointercancel',cancelDrag);
  grid.addEventListener('lostpointercapture',cancelDrag);
  window.addEventListener('blur',cancelDrag);
  grid.addEventListener('click',clickPiece);
  document.querySelector('#themes').addEventListener('click',changeTheme);
  document.querySelector('#targetButtons').addEventListener('click',clickTarget);
  document.querySelector('#hint').addEventListener('click',showHint);
  document.querySelector('#reset').addEventListener('click',resetLevel);
  document.querySelector('#next').addEventListener('click',nextLevel);
  document.addEventListener('click',clickTool);
  document.querySelector('#focusMode').addEventListener('click',toggleFocusMode);
  document.addEventListener('fullscreenchange',fullscreenChanged);
  document.addEventListener('keydown',escapeFocusMode);
  new ResizeObserver(resize).observe(stage);
  grid.addEventListener('scroll',markDirty);
  window.addEventListener('resize',resize);
  requestAnimationFrame(renderFrame);
}

// 零件盤捲動後重新繪製可見的縮圖。
function markDirty() {
  dirty=true;
}

try {
  initialize();
} catch {
  document.querySelector('#loading').hidden=false;
  document.querySelector('#loading').textContent='無法啟動 3D 畫面。請使用新版 Chrome 或 Edge，開啟瀏覽器的圖形加速後再試。';
}
