import * as THREE from './vendor/three.module.js';

// 將同主題的小物平均分布在前後兩圈，後續關卡需要旋轉觀察。
function makeThemePieces(prefix, names) {
  return names.map(function makePieceDefinition(name,index) {
    const inner = index%3===0;
    const radius = inner ? 1.28 : 2.04;
    const angle = index*2.399 + (inner ? .35 : 0);
    return {
      id:`${prefix}_${index}`,
      name,
      at:[Math.cos(angle)*radius,(prefix==='carnival'?.65:.3)+(index%5)*.25,Math.sin(angle)*radius],
      turn:-angle+Math.PI/2,
    };
  });
}

export const levels = {
  dessert: { title: '甜點時光', chapter: '01', color: '#eee9d9', message: '草莓、奶油和一點點幸福，今天的甜點上桌了。', pieces: [
    { id:'berry', name:'草莓', at:[-.65,1.67,.6] },
    { id:'candle', name:'蠟燭', at:[.22,1.99,.05] },
    { id:'chocolate', name:'巧克力片', at:[.68,1.67,-.58], turn:-.35 },
    { id:'macaron', name:'綠色馬卡龍', at:[1.83,.38,.7] },
    { id:'cherry', name:'櫻桃', at:[-.75,1.63,-.56] },
    { id:'cup', name:'茶杯', at:[-1.82,.49,-.12] },
    { id:'blueberry', name:'藍莓', at:[.15,1.51,.87] },
    { id:'wafer', name:'捲心酥', at:[.1,1.83,-.9], turn:.4 },
    { id:'spoon', name:'金色湯匙', at:[1.7,.25,-.8], turn:.3 },
    { id:'mint', name:'薄荷葉', at:[-.65,1.52,.1] },
  ] },
  space: { title:'太空探險', chapter:'02', color:'#e5e8f0', message:'引擎準備好了。帶著好奇心，出發去更遠的地方！', pieces:[
    { id:'nose', name:'火箭頭', at:[0,2.65,0] },
    { id:'fin', name:'紅色尾翼', at:[.64,.8,0] },
    { id:'window', name:'圓形窗戶', at:[0,1.65,.61] },
    { id:'planet', name:'環形行星', at:[-1.7,1.35,-.3] },
    { id:'flag', name:'綠色旗子', at:[1.65,.85,1] },
    { id:'satellite', name:'衛星', at:[.9,.9,-1.55] },
    { id:'backFin', name:'藍色尾翼', at:[0,.8,-.65], turn:Math.PI/2 },
    { id:'dish', name:'碟形天線', at:[-1.6,.65,1.05] },
    { id:'robot', name:'機器人', at:[.92,.49,1.68] },
    { id:'moonrock', name:'紫色水晶', at:[-1.95,.4,-1.1] },
    { id:'antenna', name:'火箭天線', at:[.46,2.28,-.18] },
    { id:'spaceStar', name:'金色星星', at:[-1.1,.3,1.93] },
    { id:'comet', name:'綠色彗星', at:[1.85,.7,-.7] },
    { id:'capsule', name:'太空膠囊', at:[-.42,.45,-1.8] },
    { id:'solar', name:'太陽能板', at:[1.9,.42,.25] },
  ] },
  ocean: { title:'海底世界', chapter:'03', color:'#e0eeea', message:'貝殼找到家，小魚也回來了。收好這片小小的海。', pieces:[
    { id:'coral', name:'粉紅珊瑚', at:[-1.35,.75,.25] },
    { id:'fish', name:'橘色小魚', at:[.55,1.62,.4] },
    { id:'shell', name:'珍珠貝殼', at:[.95,.28,1.38] },
    { id:'starfish', name:'海星', at:[-.85,.19,1.5] },
    { id:'lid', name:'寶箱蓋', at:[.6,.86,-.85] },
    { id:'seaweed', name:'綠色海草', at:[-1.25,.72,-1.45] },
    { id:'crab', name:'螃蟹', at:[.15,.34,1.94] },
    { id:'turtle', name:'海龜', at:[-1.8,.5,1.3] },
    { id:'jelly', name:'紫色水母', at:[-.7,1.85,.25] },
    { id:'seahorse', name:'海馬', at:[1.77,1.0,.4] },
    { id:'anemone', name:'海葵', at:[2.1,.43,-.65] },
    { id:'clam', name:'扇形貝殼', at:[1.75,.24,1.48] },
    { id:'sponge', name:'黃色海綿', at:[-.32,.53,-1.95] },
    { id:'bottle', name:'漂流瓶', at:[.75,.48,-1.98], turn:.4 },
    { id:'anchor', name:'船錨', at:[-2.02,.72,-.55] },
    { id:'pearls', name:'珍珠', at:[-.25,.28,1.0] },
    { id:'spiral', name:'海螺', at:[-1.1,.29,-2.05] },
    { id:'blueCoral', name:'藍色珊瑚', at:[1.55,.72,-1.7] },
    { id:'kelp', name:'黃綠色海草', at:[-1.95,.72,-1.37] },
    { id:'bubbles', name:'藍色泡泡', at:[.3,1.3,-1.57] },
  ] },
  forest: { title:'森林野餐', chapter:'04', color:'#e4ecdc', message:'松果、莓果和森林朋友都到齊了。野餐開始！', pieces:makeThemePieces('forest',[
    '紅色蘑菇','橡果','狐狸','野餐籃','提燈','藍色小鳥','莓果叢','木頭路牌','黃色小花','灰色石頭','樹樁','紫色蘑菇','橡果','狐狸','野餐籃','提燈','藍色小鳥','莓果叢','木頭路牌','黃色小花','灰綠色石頭','樹樁',
  ]) },
  museum: { title:'恐龍博物館', chapter:'05', color:'#ece5d8', message:'最後一塊化石歸位，沉睡億萬年的展廳亮起來了。', pieces:makeThemePieces('museum',[
    '恐龍頭骨','恐龍角','紫色恐龍蛋','恐龍腳印','琥珀色水晶','蕨葉','展示牌','螺旋化石','恐龍模型','恐龍牙齒','恐龍頭骨','恐龍角','綠色恐龍蛋','恐龍腳印','琥珀色水晶','蕨葉','展示牌','螺旋化石','恐龍模型','恐龍牙齒','恐龍頭骨','恐龍角','米色恐龍蛋','恐龍腳印','琥珀色水晶',
  ]) },
  carnival: { title:'夜晚遊樂園', chapter:'06', color:'#e9e3ef', message:'燈光全部亮起，旋轉木馬奏起音樂。今晚的遊樂園完整了！', pieces:makeThemePieces('carnival',[
    '紅色氣球','黃色星星燈','藍色木馬','紫色碰碰車','綠色球燈','紅色三角旗','星星票券','藍色小鼓','粉紅棉花糖','綠色月亮燈','藍色氣球','黃色星星燈','藍色木馬','紫色碰碰車','綠色球燈','紅色三角旗','星星票券','藍色小鼓','粉紅棉花糖','綠色月亮燈','粉紅氣球','黃色星星燈','藍色木馬','紫色碰碰車','粉紅球燈','紅色三角旗','星星票券','藍色小鼓',
  ]) },
};

// 建立具有霧面玩具質感的幾何零件。
function mesh(geometry, color, parent, position = [0,0,0], scale = [1,1,1]) {
  const object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness:.72, metalness:0 }));
  object.position.set(...position);
  object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

// 建立球形，依比例拉伸成水果、石頭或魚身。
function ball(parent, color, position, scale) {
  return mesh(new THREE.SphereGeometry(1,24,16), color, parent, position, scale);
}

// 建立積木形狀。
function box(parent, color, position, scale) {
  return mesh(new THREE.BoxGeometry(1,1,1), color, parent, position, scale);
}

// 建立圓柱形物件。
function cylinder(parent, color, radius, height, position, topRadius = radius) {
  return mesh(new THREE.CylinderGeometry(topRadius,radius,height,48),color,parent,position);
}

// 在兩點之間建立細枝、天線或莖。
function stick(parent, color, from, to, radius = .035) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const object = mesh(new THREE.CylinderGeometry(radius,radius,a.distanceTo(b),12),color,parent);
  object.position.copy(a.clone().add(b).multiplyScalar(.5));
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());
  return object;
}

// 製作有厚度的星形，供海星及小裝飾使用。
function star(parent, color, radius, depth, position) {
  const shape = new THREE.Shape();
  for (let i=0;i<10;i+=1) {
    const angle = i*Math.PI/5 + Math.PI/2;
    const r = i%2 ? radius*.47 : radius;
    if (!i) shape.moveTo(Math.cos(angle)*r,Math.sin(angle)*r);
    else shape.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);
  }
  shape.closePath();
  return mesh(new THREE.ExtrudeGeometry(shape,{ depth,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:2,steps:1 }),color,parent,position);
}

// 建立森林關卡的小物輪廓。
function createForestPiece(group,index) {
  const kind=index%11;
  if(kind===0) {
    cylinder(group,'#efe0bd',.09,.38,[0,-.12,0],.12);
    ball(group,index%2?'#9b77a0':'#d36f64',[0,.14,0],[.3,.18,.3]);
    for(let i=0;i<5;i+=1) ball(group,'#f5dfbd',[Math.cos(i*1.26)*.14,.2,Math.sin(i*1.26)*.14],[.035,.025,.035]);
  } else if(kind===1) {
    ball(group,'#a3734e',[0,-.05,0],[.22,.27,.22]);
    cylinder(group,'#6f8d60',.16,.13,[0,.22,0],.06);
  } else if(kind===2) {
    ball(group,'#c9825d',[0,0,0],[.3,.22,.2]);
    ball(group,'#d9956d',[.28,.12,0],[.18,.18,.17]);
    for(const z of [-.11,.11]) {
      ball(group,'#fff3d2',[.36,.16,z],[.067,.067,.035]);
      ball(group,'#354940',[.401,.16,z],[.033,.04,.019]);
    }
    for(const z of [-.12,.12]) {
      const ear=mesh(new THREE.ConeGeometry(.10,.22,3),'#a96552',group,[.14,.35,z]);
      ear.rotation.z=-.35;
    }
    const tail=mesh(new THREE.ConeGeometry(.17,.46,18),'#efe1c1',group,[-.36,.03,0]);tail.rotation.z=-Math.PI/2;
  } else if(kind===3) {
    box(group,'#a97752',[0,0,0],[.48,.3,.36]);
    const handle=mesh(new THREE.TorusGeometry(.25,.045,10,24,Math.PI),'#875f43',group,[0,.18,0]);handle.rotation.z=0;
  } else if(kind===4) {
    cylinder(group,'#7f7664',.18,.38,[0,0,0]);
    box(group,'#efc46e',[0,.02,.19],[.22,.24,.03]);
    stick(group,'#756d60',[0,.18,0],[0,.43,0],.025);
  } else if(kind===5) {
    ball(group,'#6f9db1',[0,0,0],[.26,.17,.16]);
    ball(group,'#89b4c3',[.24,.1,0],[.13,.13,.12]);
    const wing=ball(group,'#507f94',[-.05,.1,.14],[.18,.06,.12]);wing.rotation.z=.3;wing.name='birdWing';
    ball(group,'#fff5da',[.34,.16,.105],[.038,.038,.018]);
    ball(group,'#344b49',[.36,.16,.117],[.018,.022,.01]);
    const beak=mesh(new THREE.ConeGeometry(.05,.18,4),'#d9a65f',group,[.4,.1,0]);beak.rotation.z=-Math.PI/2;
  } else if(kind===6) {
    for(let i=0;i<5;i+=1) {
      const angle=i*1.26;
      ball(group,'#6b9868',[Math.cos(angle)*.18,0,Math.sin(angle)*.18],[.18,.12,.18]);
      ball(group,'#815c85',[Math.cos(angle)*.22,.13,Math.sin(angle)*.22],[.06,.06,.06]);
    }
  } else if(kind===7) {
    stick(group,'#8d6548',[0,-.35,0],[0,.35,0],.045);
    box(group,'#b98b5f',[.12,.18,0],[.5,.22,.08]);
    box(group,'#b98b5f',[-.12,-.1,0],[.5,.22,.08]);
  } else if(kind===8) {
    stick(group,'#648661',[0,-.28,0],[0,.22,0],.025);
    for(let i=0;i<8;i+=1) ball(group,'#f3dda2',[Math.cos(i*.785)*.17,.27,Math.sin(i*.785)*.17],[.06,.025,.06]);
    ball(group,'#d5a85d',[0,.27,0],[.08,.04,.08]);
  } else if(kind===9) {
    ball(group,['#9a9d8d','#b5aa98','#8da095'][index%3],[0,0,0],[.31,.22,.27]);
    ball(group,'#d9d6c4',[-.08,.12,.12],[.07,.035,.05]);
  } else {
    cylinder(group,'#8d6748',.28,.26,[0,-.08,0]);
    cylinder(group,'#b18a61',.29,.025,[0,.06,0]);
    for(let i=0;i<5;i+=1) stick(group,'#74523c',[Math.cos(i*1.26)*.1,.07,Math.sin(i*1.26)*.1],[Math.cos(i*1.26)*.22,.24,Math.sin(i*1.26)*.22],.02);
  }
}

// 建立博物館關卡的化石與考古小物。
function createMuseumPiece(group,index) {
  const kind=index%10;
  const bone=index%2?'#e8d9b9':'#d8c9aa';
  if(kind===0) {
    ball(group,bone,[0,0,0],[.34,.25,.27]);
    box(group,'#4c453a',[.18,.02,.23],[.2,.08,.03]);
    for(let i=0;i<4;i+=1) mesh(new THREE.ConeGeometry(.035,.16,8),bone,group,[.06+i*.08,-.18,.2]).rotation.z=Math.PI;
  } else if(kind===1) {
    for(let i=0;i<3;i+=1) {const horn=mesh(new THREE.ConeGeometry(.08,.5,16),bone,group,[(i-1)*.17,0,0]);horn.rotation.z=(i-1)*.25;}
  } else if(kind===2) {
    ball(group,['#b7bea1','#d7c69c','#b9a9c4'][index%3],[0,0,0],[.26,.34,.26]);
    stick(group,'#8d7f68',[-.12,.22,.18],[.04,.04,-.2],.025);
  } else if(kind===3) {
    const foot=ball(group,'#9e8d76',[0,0,0],[.26,.07,.35]);foot.rotation.y=.2;
    for(let i=-1;i<=1;i+=1) ball(group,'#9e8d76',[i*.16,.03,.28],[.08,.05,.16]);
  } else if(kind===4) {
    for(let i=0;i<3;i+=1) mesh(new THREE.OctahedronGeometry(.18+i*.035),'#c79c61',group,[(i-1)*.18,i*.06,0]);
  } else if(kind===5) {
    stick(group,'#758b65',[0,-.3,0],[0,.28,0],.035);
    for(let i=0;i<6;i+=1) {
      const leaf=ball(group,'#86a274',[(i%2?1:-1)*.13,-.14+i*.09,0],[.13,.035,.06]);
      leaf.rotation.z=(i%2?-.5:.5);
    }
  } else if(kind===6) {
    stick(group,'#806c54',[0,-.35,0],[0,.12,0],.035);
    box(group,'#c6aa78',[0,.18,0],[.46,.3,.07]);
    box(group,'#786850',[0,.2,.041],[.27,.025,.01]);
  } else if(kind===7) {
    const fossil=mesh(new THREE.TorusGeometry(.22,.06,12,32,Math.PI*1.75),bone,group);fossil.rotation.x=.25;
    ball(group,bone,[.22,-.04,0],[.08,.08,.08]);
  } else if(kind===8) {
    ball(group,['#8aa27f','#a28b6e'][index%2],[0,0,0],[.34,.18,.17]);
    ball(group,'#77936f',[.34,.15,0],[.15,.14,.13]);
    stick(group,'#657a5f',[-.2,-.05,0],[-.45,-.12,0],.055);
    for(let i=0;i<3;i+=1) mesh(new THREE.ConeGeometry(.06,.2,8),bone,group,[.32+i*.09,.28,0]);
  } else {
    mesh(new THREE.ConeGeometry(.11,.6,18),bone,group).rotation.z=.25;
    cylinder(group,'#a99370',.14,.05,[0,-.31,0]);
  }
}

// 建立遊樂園關卡的燈飾與遊園小物。
function createCarnivalPiece(group,index) {
  const kind=index%10;
  const colors=['#d8757a','#e3b967','#729eaa','#a78ab3','#7da37d'];
  const balloonColors={0:'#d8757a',10:'#729eaa',20:'#e6a1aa'};
  const color=kind===0 ? balloonColors[index] || colors[index%colors.length] : kind===4 && index===24 ? '#d875a0' : colors[index%colors.length];
  if(kind===0) {
    ball(group,color,[0,.12,0],[.26,.32,.26]);
    stick(group,'#8b8172',[0,-.18,0],[0,-.55,0],.018);
  } else if(kind===1) {
    const light=star(group,color,.34,.1,[0,0,0]);light.rotation.x=-.4;
    ball(group,'#fff0b3',[0,.03,.1],[.08,.08,.04]);
  } else if(kind===2) {
    stick(group,'#d2aa67',[0,-.35,0],[0,.38,0],.035);
    ball(group,color,[0,.02,0],[.33,.18,.14]);
    ball(group,'#efe3c6',[.28,.12,0],[.14,.14,.12]);
    for(const x of [-.18,.18]) stick(group,'#9c7557',[x,-.08,0],[x,-.3,0],.035);
  } else if(kind===3) {
    box(group,color,[0,0,0],[.48,.24,.32]);
    ball(group,'#cfd4ca',[.18,.18,0],[.14,.09,.12]);
    for(const z of [-.18,.18]) cylinder(group,'#536264',.09,.08,[-.14,-.15,z]);
  } else if(kind===4) {
    ball(group,color,[0,0,0],[.17,.17,.17]);
    cylinder(group,'#7b7567',.06,.24,[0,-.22,0]);
    ball(group,'#fff2b4',[-.045,.055,.12],[.045,.045,.025]);
  } else if(kind===5) {
    stick(group,'#837462',[0,-.35,0],[0,.3,0],.025);
    const flag=mesh(new THREE.ConeGeometry(.22,.48,3),color,group,[.2,.2,0]);flag.rotation.z=-Math.PI/2;
  } else if(kind===6) {
    box(group,'#e6cc84',[0,0,0],[.5,.25,.05]);
    for(const x of [-.18,.18]) cylinder(group,'#f7e4a9',.04,.06,[x,0,0]);
    star(group,'#b97875',.08,.015,[0,0,.035]);
  } else if(kind===7) {
    cylinder(group,color,.25,.25,[0,0,0],.31);
    const drumHead=cylinder(group,'#efe4c9',.28,.025,[0,.14,0]);
    drumHead.name='drumHead';
    for(let i=0;i<6;i+=1) stick(group,'#efe4c9',[0,.12,0],[Math.cos(i*1.05)*.27,.2,Math.sin(i*1.05)*.27],.018);
    stick(group,'#806c54',[-.18,.3,0],[.05,.52,0],.025);
  } else if(kind===8) {
    ball(group,'#f1b9c1',[0,.05,0],[.3,.36,.25]);
    cylinder(group,'#e5cf9c',.05,.48,[0,-.3,0]);
    for(let i=0;i<5;i+=1) ball(group,'#f7d9df',[Math.cos(i*1.26)*.16,.12,Math.sin(i*1.26)*.12],[.13,.16,.13]);
  } else {
    const moon=mesh(new THREE.TorusGeometry(.25,.095,18,36,Math.PI*1.35),color,group);moon.rotation.z=.75;
    star(group,'#f1d99b',.09,.03,[.25,.17,.02]);
  }
}

// 依識別碼建立後三關的小物模型。
function createExtendedPiece(group,id) {
  const [theme,indexText]=id.split('_');
  const index=Number(indexText);
  if (createNewPiece(group, id)) return;
  if(theme==='forest') createForestPiece(group,index);
  if(theme==='museum') createMuseumPiece(group,index);
  if(theme==='carnival') createCarnivalPiece(group,index);
}

// 用不同輪廓取代重複的小物，保留原本識別碼與存檔。
function createNewPiece(g, id) {
  const name = newPieceNames[id];
  if (!name) return false;
  const cream = '#f4dfb1', brown = '#916644', green = '#78a479', pink = '#dc94a7';
  switch (name) {
    case '蝸牛':
      ball(g, cream, [0,-.13,0], [.4,.1,.15]);
      ball(g, brown, [0,.05,0], [.23,.24,.18]);
      mesh(new THREE.TorusGeometry(.12,.025,8,24), cream, g, [0,.05,.18]);
      for (const z of [-.08,.08]) { stick(g, green, [.3,-.1,z],[.35,.17,z]); ball(g,'#344b49',[.35,.18,z],[.035,.035,.035]); }
      break;
    case '蜂蜜罐':
      ball(g,'#dea449',[0,0,0],[.24,.28,.24]);
      cylinder(g,brown,.2,.08,[0,.27,0]);
      box(g,cream,[0,0,.23],[.25,.16,.03]);
      break;
    case '蘋果':
      for (const x of [-.1,.1]) ball(g,'#cf6664',[x,0,0],[.2,.24,.23]);
      stick(g,brown,[0,.2,0],[.04,.38,0]);
      ball(g,green,[.14,.3,0],[.14,.03,.07]);
      break;
    case '蝴蝶':
      for (const x of [-1,1]) { ball(g,'#edc86b',[x*.19,.12,0],[.2,.22,.05]); ball(g,pink,[x*.15,-.14,0],[.15,.14,.05]); stick(g,brown,[0,.18,0],[x*.1,.35,0],.015); }
      ball(g,brown,[0,0,.04],[.045,.24,.045]);
      break;
    case '松果':
      for (let row=0;row<4;row+=1) for (let i=0;i<5;i+=1) { const a=i*1.26+row*.5; ball(g,brown,[Math.cos(a)*(.15-row*.025),row*.12-.2,Math.sin(a)*(.15-row*.025)],[.09,.1,.09]); }
      break;
    case '四葉草':
      stick(g,green,[0,-.35,0],[0,.12,0]);
      for (const x of [-1,1]) for (const y of [-1,1]) ball(g,green,[x*.12,.13+y*.12,0],[.14,.14,.045]);
      break;
    case '野餐三明治':
      for (const [y,c] of [[-.13,cream],[-.04,green],[.03,pink],[.12,cream]]) box(g,c,[0,y,0],[.48,.07,.4]);
      break;
    case '小帳篷':
      mesh(new THREE.ConeGeometry(.4,.55,3),'#d7ad70',g,[0,.02,0]).rotation.y=Math.PI/6;
      mesh(new THREE.ConeGeometry(.17,.31,3),brown,g,[0,-.09,.22]).rotation.y=Math.PI/6;
      break;
    case '營火':
      for (const angle of [-.65,.65]) { const log=box(g,brown,[0,-.2,0],[.6,.1,.12]); log.rotation.y=angle; }
      mesh(new THREE.ConeGeometry(.2,.5,7),'#ee985c',g,[0,.08,0]);
      mesh(new THREE.ConeGeometry(.1,.3,7),'#ffe093',g,[0,.03,.13]);
      break;
    case '兔子':
      ball(g,cream,[0,-.1,0],[.24,.2,.19]); ball(g,cream,[.15,.13,0],[.17,.17,.16]);
      for (const z of [-.08,.08]) { ball(g,cream,[.12,.38,z],[.065,.22,.055]); ball(g,'#344b49',[.27,.17,z],[.025,.025,.025]); }
      ball(g,'#ffffff',[-.23,-.04,0],[.09,.09,.09]);
      break;
    case '羽毛':
      stick(g,brown,[0,-.35,0],[0,.35,0],.015);
      for(let i=0;i<6;i+=1) for(const side of [-1,1]) stick(g,'#9ab9c5',[0,i*.1-.23,0],[side*(.18-i*.02),i*.1-.08,0],.035);
      break;
    case '恐龍脊椎':
      stick(g,cream,[-.35,0,0],[.35,0,0],.06);
      for(let i=0;i<5;i+=1) { ball(g,cream,[i*.14-.28,0,0],[.09,.1,.1]); stick(g,cream,[i*.14-.28,0,0],[i*.14-.28,.2,0]); }
      break;
    case '翼龍':
      ball(g,green,[0,0,0],[.08,.2,.1]);
      for(const side of [-1,1]) { const wing=mesh(new THREE.ConeGeometry(.24,.44,3), '#b2b987',g,[side*.24,0,0]); wing.rotation.z=side*Math.PI/2; }
      ball(g,green,[0,.25,0],[.09,.1,.09]);
      break;
    case '骨頭':
      stick(g,cream,[-.25,0,0],[.25,0,0],.07);
      for(const x of [-.25,.25]) for(const y of [-.08,.08]) ball(g,cream,[x,y,0],[.1,.1,.1]);
      break;
    case '火山':
      cylinder(g,'#887d74',.35,.45,[0,0,0],.13);
      cylinder(g,'#ee8d5f',.12,.02,[0,.235,0]);
      for(let i=0;i<3;i+=1) ball(g,'#c6bbb0',[i*.08,.35+i*.1,0],[.06+i*.015,.07,.06]);
      break;
    case '劍龍背板':
      box(g,brown,[0,-.2,0],[.65,.08,.18]);
      for(let i=0;i<3;i+=1) mesh(new THREE.ConeGeometry(.13,.3+(i===1?.15:0),4),green,g,[(i-1)*.2,0,0]);
      break;
    case '考古刷子':
      box(g,brown,[0,-.1,0],[.09,.45,.08]); box(g,'#adb9b4',[0,.16,0],[.26,.1,.09]);
      for(let i=0;i<6;i+=1) box(g,cream,[(i-2.5)*.045,.29,0],[.035,.18,.08]);
      break;
    case '放大鏡':
      mesh(new THREE.TorusGeometry(.22,.05,12,32),'#b89559',g,[0,.12,0]);
      stick(g,brown,[0,-.12,0],[0,-.45,0],.06);
      break;
    case '破蛋殼':
      mesh(new THREE.SphereGeometry(.28,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2),cream,g);
      for(let i=0;i<6;i+=1) mesh(new THREE.ConeGeometry(.07,.13,3),cream,g,[Math.cos(i*1.05)*.24,.02,Math.sin(i*1.05)*.24]);
      break;
    case '長頸恐龍':
      ball(g,green,[0,-.1,0],[.28,.17,.16]); stick(g,green,[.17,-.05,0],[.24,.39,0],.08); ball(g,green,[.3,.4,0],[.13,.09,.09]);
      for(const x of [-.16,.16]) for(const z of [-.1,.1]) stick(g,green,[x,-.12,z],[x,-.32,z],.05);
      stick(g,green,[-.23,-.1,0],[-.46,.04,0],.04);
      break;
    case '恐龍肋骨':
      stick(g,cream,[-.3,.2,0],[.3,.2,0],.04);
      for(let i=0;i<4;i+=1) { const rib=mesh(new THREE.TorusGeometry(.21,.025,8,20,Math.PI),cream,g,[i*.16-.24,0,0]); rib.rotation.y=Math.PI/2; }
      break;
    case '綠色晶柱':
      for(let i=0;i<3;i+=1) { cylinder(g,green,.09,.3+i*.12,[(i-1)*.15,0,0]); mesh(new THREE.ConeGeometry(.09,.15,6),green,g,[(i-1)*.15,.225+i*.06,0]); }
      break;
    case '檯燈':
      cylinder(g,brown,.23,.06,[0,-.3,0]); stick(g,brown,[0,-.3,0],[0,.17,0]); cylinder(g,'#ddb96a',.25,.22,[0,.22,0],.12);
      break;
    case '化石石板':
      box(g,'#bfa98b',[0,0,0],[.5,.48,.1]);
      stick(g,cream,[-.17,0,.07],[.17,0,.07],.025);
      for(let i=0;i<4;i+=1) stick(g,cream,[i*.09-.14,-.12,.07],[i*.09-.14,.12,.07],.018);
      break;
    case '研究筆記':
      box(g,brown,[0,0,0],[.42,.12,.5]); box(g,cream,[0,.07,0],[.37,.02,.45]);
      for(let i=0;i<4;i+=1) box(g,'#9aabac',[0,.085,(i-1.5)*.08],[.25,.01,.015]);
      break;
    case '獎牌':
      for(const x of [-1,1]) { const ribbon=box(g,'#7d9bb5',[x*.1,.18,0],[.09,.35,.035]); ribbon.rotation.z=x*-.45; }
      const medal=cylinder(g,'#dbb45e',.18,.05,[0,-.12,0]); medal.rotation.x=Math.PI/2; star(g,cream,.1,.02,[0,-.12,.04]);
      break;
    case '冰淇淋':
      mesh(new THREE.ConeGeometry(.19,.45,20),'#cda574',g,[0,-.15,0]).rotation.z=Math.PI;
      ball(g,pink,[0,.13,0],[.24,.23,.24]); ball(g,'#bc626d',[0,.36,0],[.065,.065,.065]);
      break;
    case '摩天輪車廂':
      box(g,'#e1b36d',[0,-.08,0],[.44,.25,.35]);
      for(const x of [-.2,.2]) stick(g,brown,[x,0,0],[x,.3,0],.025);
      box(g,pink,[0,.32,0],[.5,.08,.4]);
      break;
    case '旋轉茶杯':
      cylinder(g,'#95b7c9',.23,.27,[0,0,0],.3); cylinder(g,cream,.36,.04,[0,-.16,0]); mesh(new THREE.TorusGeometry(.13,.035,10,24),'#95b7c9',g,[.32,0,0]);
      break;
    case '小火車':
      box(g,'#91b49a',[-.13,0,0],[.3,.36,.28]); box(g,'#cf7b70',[.17,-.07,0],[.32,.2,.28]); cylinder(g,brown,.06,.18,[.23,.1,0]);
      for(const x of [-.2,.2]) for(const z of [-.17,.17]) ball(g,'#555c64',[x,-.22,z],[.09,.09,.04]);
      break;
    case '爆米花':
      cylinder(g,pink,.17,.35,[0,-.06,0],.24);
      for(let i=0;i<9;i+=1) ball(g,cream,[Math.cos(i*2.4)*.16,.16+(i%3)*.035,Math.sin(i*2.4)*.16],[.09,.09,.09]);
      break;
    case '禮物盒':
      box(g,'#94b7b6',[0,-.05,0],[.42,.35,.4]); box(g,cream,[0,-.05,.205],[.07,.35,.02]); box(g,cream,[0,.13,0],[.07,.02,.4]);
      for(const x of [-.1,.1]) mesh(new THREE.TorusGeometry(.1,.025,8,20),pink,g,[x,.23,0]);
      break;
    case '愛心餅乾':
      for(const x of [-.12,.12]) ball(g,'#d8a879',[x,.08,0],[.17,.17,.07]); mesh(new THREE.ConeGeometry(.25,.3,3),'#d8a879',g,[0,-.1,0],[1,1,.3]).rotation.z=Math.PI;
      break;
    case '小喇叭':
      cylinder(g,'#ddba67',.22,.3,[0,.12,0],.06); stick(g,'#ddba67',[0,-.03,0],[0,-.32,0],.04); mesh(new THREE.TorusGeometry(.1,.025,8,24),'#ddba67',g,[.1,-.15,0]);
      break;
    case '甜甜圈':
      mesh(new THREE.TorusGeometry(.23,.105,16,32),'#cf9d6a',g); mesh(new THREE.TorusGeometry(.23,.075,16,32),pink,g,[0,0,.065]);
      for(let i=0;i<8;i+=1) box(g,cream,[Math.cos(i*.785)*.23,Math.sin(i*.785)*.23,.14],[.055,.02,.015]);
      break;
    case '旋轉風車':
      stick(g,brown,[0,-.45,0],[0,.17,0]);
      for(let i=0;i<4;i+=1) { const a=i*Math.PI/2; const blade=box(g,['#d98384','#8fb3ba','#e4c577','#b5a0c7'][i],[Math.cos(a)*.17,.17+Math.sin(a)*.17,0],[.26,.12,.05]); blade.rotation.z=a+.4; }
      ball(g,cream,[0,.17,.05],[.06,.06,.05]);
      break;
    case '小雨傘':
      mesh(new THREE.SphereGeometry(.34,24,12,0,Math.PI*2,0,Math.PI/2),'#a59ac4',g,[0,.13,0],[1,.6,1]); stick(g,brown,[0,-.32,0],[0,.13,0]);
      break;
    case '皇冠':
      cylinder(g,'#d7b45e',.24,.14,[0,-.1,0]);
      for(let i=0;i<5;i+=1) { const a=i*1.26; mesh(new THREE.ConeGeometry(.07,.28,4),'#d7b45e',g,[Math.cos(a)*.2,.09,Math.sin(a)*.2]); }
      break;
    case '玩具熊':
      ball(g,brown,[0,-.08,0],[.2,.23,.16]); ball(g,brown,[0,.2,0],[.2,.18,.16]);
      for(const x of [-1,1]) { ball(g,brown,[x*.17,.35,0],[.08,.08,.07]); ball(g,brown,[x*.24,-.04,0],[.1,.08,.09]); ball(g,brown,[x*.13,-.29,.04],[.1,.1,.1]); ball(g,'#303e3e',[x*.065,.23,.15],[.025,.025,.02]); }
      ball(g,cream,[0,.14,.15],[.1,.07,.045]);
      break;
    case '小帆船':
      ball(g,'#93b7ba',[0,-.2,0],[.36,.12,.17]); stick(g,brown,[0,-.2,0],[0,.4,0]); mesh(new THREE.ConeGeometry(.26,.4,3),cream,g,[.1,.14,0],[1,1,.2]);
      break;
    case '彩虹拱門':
      for(let i=0;i<3;i+=1) mesh(new THREE.TorusGeometry(.32-i*.07,.035,8,28,Math.PI),['#d8898d','#e1c477','#8db6ad'][i],g,[0,-.13,0]);
      break;
    case '小城堡':
      box(g,'#b2a9ca',[0,-.08,0],[.35,.34,.26]);
      for(const x of [-.23,.23]) { cylinder(g,'#b2a9ca',.1,.45,[x,0,0]); mesh(new THREE.ConeGeometry(.14,.2,12),pink,g,[x,.32,0]); }
      box(g,brown,[0,-.15,.14],[.1,.2,.02]);
      break;
    case '棒棒糖':
      stick(g,cream,[0,-.45,0],[0,.05,0]); ball(g,pink,[0,.17,0],[.23,.23,.065]);
      mesh(new THREE.TorusGeometry(.14,.025,8,24),cream,g,[0,.17,.065]); ball(g,cream,[0,.17,.07],[.045,.045,.025]);
      break;
    case '小手鈴':
      cylinder(g,'#d9b967',.25,.28,[0,-.1,0],.08); stick(g,brown,[0,.05,0],[0,.32,0],.055); ball(g,brown,[0,-.26,0],[.05,.05,.05]);
      break;
  }
  return true;
}

const newPieceNames = {
  forest_11:'蝸牛', forest_12:'蜂蜜罐', forest_13:'蘋果', forest_14:'蝴蝶', forest_15:'松果', forest_16:'四葉草', forest_17:'野餐三明治', forest_18:'小帳篷', forest_19:'營火', forest_20:'兔子', forest_21:'羽毛',
  museum_10:'恐龍脊椎', museum_11:'翼龍', museum_12:'骨頭', museum_13:'火山', museum_14:'劍龍背板', museum_15:'考古刷子', museum_16:'放大鏡', museum_17:'破蛋殼', museum_18:'長頸恐龍', museum_19:'恐龍肋骨', museum_20:'綠色晶柱', museum_21:'檯燈', museum_22:'化石石板', museum_23:'研究筆記', museum_24:'獎牌',
  carnival_10:'冰淇淋', carnival_11:'摩天輪車廂', carnival_12:'旋轉茶杯', carnival_13:'小火車', carnival_14:'爆米花', carnival_15:'禮物盒', carnival_16:'愛心餅乾', carnival_17:'小喇叭', carnival_18:'甜甜圈', carnival_19:'旋轉風車', carnival_20:'小雨傘', carnival_21:'皇冠', carnival_22:'玩具熊', carnival_23:'小帆船', carnival_24:'彩虹拱門', carnival_25:'小城堡', carnival_26:'棒棒糖', carnival_27:'小手鈴',
};

// 將新名稱套回既有位置，已完成的零件仍沿用原本的存檔。
for (const level of Object.values(levels)) {
  for (const piece of level.pieces) {
    if (newPieceNames[piece.id]) piece.name = newPieceNames[piece.id];
    if (piece.id === 'museum_15') piece.at[1] = .85;
  }
}

// 建立獨立的彩色拼圖模型，主場景與零件盤共用同一造型。
export function createPiece(id) {
  const g = new THREE.Group();
  if (/^(forest|museum|carnival)_\d+$/.test(id)) {
    createExtendedPiece(g,id);
  } else if (id === 'blueberry') {
    for(let i=0;i<3;i+=1) {
      const x=Math.cos(i*2.09)*.13,z=Math.sin(i*2.09)*.13;
      ball(g,'#6c799a',[x,0,z],[.14,.13,.14]);
      cylinder(g,'#4b5976',.04,.016,[x,.13,z]);
    }
  } else if(id === 'wafer') {
    cylinder(g,'#d9aa71',.095,.68,[0,0,0]);
    for(let i=0;i<5;i+=1) { const band=cylinder(g,'#956b4e',.098,.045,[0,i*.13-.25,0]);band.rotation.z=.25; }
    g.rotation.z=-.2;
  } else if(id === 'spoon') {
    ball(g,'#c5a365',[0,0,.24],[.16,.035,.23]);
    box(g,'#c5a365',[0,0,-.18],[.075,.045,.55]);
  } else if(id === 'mint') {
    for(let i=0;i<3;i+=1) {
      const leaf=ball(g,'#6f9e77',[(i-1)*.12,0,0],[.09,.045,.23]);
      leaf.rotation.y=(i-1)*.7;
    }
  } else if(id === 'backFin' || id === 'blueCoral' || id === 'kelp') {
    const base=createPiece(id==='backFin'?'fin':id==='blueCoral'?'coral':'seaweed');
    // 相似零件使用不同顏色與比例，仍保有可判斷的輪廓差異。
    base.traverse(function recolor(object) {
      if(object.isMesh) object.material.color.set(id==='backFin'?'#729cab':id==='blueCoral'?'#7facc0':'#b3ac69');
    });
    base.scale.set(id==='kelp'?.8:.8,id==='backFin'?.8:1.12,.8);
    g.add(base);
  } else if(id === 'dish') {
    cylinder(g,'#8b9a9d',.20,.06,[0,-.43,0]);
    stick(g,'#87999b',[0,-.4,0],[0,0,0],.04);
    const dish=ball(g,'#dee3d8',[0,.08,0],[.33,.07,.33]);dish.rotation.x=.6;
    stick(g,'#c09968',[0,.1,0],[0,.35,.15],.025);
  } else if(id === 'robot') {
    box(g,'#b8c8bd',[0,.05,0],[.38,.36,.28]);
    box(g,'#e1c895',[0,.35,0],[.43,.24,.32]);
    for(const side of [-1,1]) {
      ball(g,'#486a78',[side*.1,.37,.17],[.045,.045,.022]);
      box(g,'#7a8e90',[side*.13,-.19,0],[.1,.13,.2]);
      stick(g,'#91a69e',[side*.22,.17,0],[side*.33,-.04,0],.04);
    }
    stick(g,'#8d9a8c',[0,.47,0],[0,.59,0],.025);
    ball(g,'#d68576',[0,.62,0],[.05,.05,.05]);
  } else if(id === 'moonrock') {
    for(let i=0;i<3;i+=1) mesh(new THREE.ConeGeometry(.13,.38+i*.12,5),'#b5a6cf',g,[(i-1)*.18,0,(i%2)*.1]);
  } else if(id === 'antenna') {
    stick(g,'#a7b8b6',[0,-.25,0],[0,.32,0],.025);
    ball(g,'#e0bb78',[0,.35,0],[.09,.09,.09]);
    cylinder(g,'#879e9f',.09,.10,[0,-.22,0]);
  } else if(id === 'spaceStar') {
    const s=star(g,'#e5c47f',.31,.09,[0,0,0]);s.rotation.x=-1.1;
  } else if(id === 'comet') {
    ball(g,'#8ab7b2',[.15,0,0],[.23,.23,.23]);
    const tail=mesh(new THREE.ConeGeometry(.19,.67,7),'#b4d8d0',g,[-.23,0,0]);tail.rotation.z=Math.PI/2;
    g.rotation.z=.3;
  } else if(id === 'capsule') {
    cylinder(g,'#d7ac82',.17,.35,[0,0,0]);
    ball(g,'#f4edd9',[0,.19,0],[.17,.15,.17]);
    cylinder(g,'#6e9b9e',.175,.09,[0,-.03,0]);
  } else if(id === 'solar') {
    box(g,'#697e9d',[0,0,0],[.51,.08,.52]);
    for(let i=0;i<3;i+=1) box(g,'#a6b9c9',[(i-1)*.15,.047,0],[.012,.01,.47]);
    stick(g,'#8c9a9d',[0,-.25,0],[0,0,0],.04);
    g.rotation.x=.3;
  } else if(id === 'crab') {
    ball(g,'#d79078',[0,0,0],[.22,.12,.17]);
    for(const side of [-1,1]) {
      stick(g,'#d79078',[side*.15,0,0],[side*.34,.12,.13],.035);
      ball(g,'#cf846c',[side*.35,.15,.13],[.08,.10,.065]);
      for(let i=0;i<3;i+=1) stick(g,'#d79078',[side*.16,0,(i-1)*.08],[side*.32,-.05,(i-1)*.15],.025);
      ball(g,'#374b48',[side*.08,.11,.13],[.025,.04,.025]);
    }
  } else if(id === 'turtle') {
    ball(g,'#86a68b',[0,0,0],[.31,.17,.25]);
    ball(g,'#aec1a0',[.36,-.02,0],[.14,.11,.12]);
    for(const x of [-.2,.2]) for(const z of [-.23,.23]) ball(g,'#aac3a0',[x,-.09,z],[.13,.04,.10]);
    ball(g,'#394d43',[.43,.025,.083],[.024,.024,.018]);
    for(let i=0;i<3;i+=1) ball(g,'#688e76',[(i-1)*.13,.15,0],[.065,.022,.11]);
  } else if(id === 'jelly') {
    ball(g,'#b6a0c4',[0,.14,0],[.32,.21,.3]);
    for(let i=0;i<5;i+=1) stick(g,'#c7b2cb',[(i-2)*.1,.06,0],[(i-2)*.12,-.31,(i%2)*.08],.025);
  } else if(id === 'seahorse') {
    ball(g,'#ddb877',[0,0,0],[.12,.24,.10]);
    ball(g,'#ddb877',[0,.25,0],[.15,.13,.11]);
    box(g,'#ddb877',[.17,.25,0],[.2,.075,.09]);
    ball(g,'#475d55',[.025,.29,.1],[.025,.025,.022]);
    const tail=mesh(new THREE.TorusGeometry(.12,.035,8,24,Math.PI*1.6),'#d3a865',g,[0,-.27,0]);
  } else if(id === 'anemone') {
    ball(g,'#b9a3b3',[0,-.06,0],[.27,.10,.23]);
    for(let i=0;i<9;i+=1) {
      const a=i*.7;
      stick(g,'#c9aabd',[Math.cos(a)*.1,0,Math.sin(a)*.1],[Math.cos(a)*.23,.26,Math.sin(a)*.23],.035);
    }
  } else if(id === 'clam') {
    for(let i=0;i<7;i+=1) {
      const leaf=ball(g,'#d6b49e',[(i-3)*.07,0,0],[.05,.05,.27-Math.abs(i-3)*.025]);leaf.rotation.y=(i-3)*.15;
    }
  } else if(id === 'sponge') {
    for(let i=0;i<3;i+=1) {
      cylinder(g,'#d9c187',.11,.45+i*.09,[(i-1)*.17,0,0]);
      cylinder(g,'#b39964',.065,.014,[(i-1)*.17,(.45+i*.09)/2+.01,0]);
    }
  } else if(id === 'bottle') {
    cylinder(g,'#87b2a4',.14,.4,[0,0,0]);
    cylinder(g,'#87b2a4',.065,.17,[0,.28,0]);
    cylinder(g,'#ad8c64',.069,.08,[0,.38,0]);
    box(g,'#e9dec0',[0,0,.14],[.14,.2,.015]);
    g.rotation.z=.25;
  } else if(id === 'anchor') {
    stick(g,'#7d989b',[0,-.29,0],[0,.3,0],.045);
    stick(g,'#7d989b',[-.22,.08,0],[.22,.08,0],.04);
    stick(g,'#7d989b',[-.23,-.15,0],[0,-.33,0],.045);
    stick(g,'#7d989b',[.23,-.15,0],[0,-.33,0],.045);
    mesh(new THREE.TorusGeometry(.10,.032,10,24),'#7d989b',g,[0,.37,0]);
  } else if(id === 'pearls') {
    for(let i=0;i<3;i+=1) ball(g,'#f4e8d2',[(i-1)*.16,0,(i%2)*.1],[.09,.09,.09]);
  } else if(id === 'spiral') {
    for(let i=0;i<4;i+=1) ball(g,['#cc9e84','#dab096'][i%2],[(i-1.5)*.10,i*.035,0],[.14-i*.025,.13-i*.02,.13-i*.02]);
  } else if(id === 'bubbles') {
    for(let i=0;i<3;i+=1) {
      ball(g,'#b6d4d5',[(i%2)*.15,i*.22-.2,0],[.08+i*.02,.08+i*.02,.08+i*.02]);
      ball(g,'#eff6eb',[(i%2)*.15-.03,i*.22-.17,.07+i*.02],[.025,.025,.015]);
    }
  } else if (id === 'berry') {
    ball(g,'#cf5c63',[0,0,0],[.3,.36,.3]);
    for(let i=0;i<5;i+=1) {
      const leaf=ball(g,'#6c9970',[Math.cos(i*1.26)*.13,.29,Math.sin(i*1.26)*.13],[.19,.055,.09]);
      leaf.rotation.y=-i*1.26;
    }
    for(let i=0;i<14;i+=1) {
      const a=i*2.4, y=(i%4)*.115-.19, r=.28*Math.sqrt(1-y*y/.14);
      ball(g,'#f8d9a0',[Math.cos(a)*r,y,Math.sin(a)*r],[.025,.039,.025]);
    }
  } else if (id === 'candle') {
    cylinder(g,'#f1b467',.095,.69,[0,0,0]);
    for(let i=0;i<4;i+=1) cylinder(g,'#fff2ce',.098,.052,[0,i*.15-.25,0]);
    stick(g,'#675445',[0,.34,0],[0,.43,0],.015);
    const flame=ball(g,'#ffce6b',[0,.49,0],[.10,.18,.10]);
    flame.name='candleFlame';
    flame.visible=false;
    flame.material.emissive.set('#ff9b32');
    flame.material.emissiveIntensity=1;
  } else if(id === 'chocolate') {
    box(g,'#79513f',[0,0,0],[.58,.62,.12]);
    for(let i=0;i<4;i+=1) box(g,'#98684e',[(i%2-.5)*.27,(Math.floor(i/2)-.5)*.29,.074],[.22,.24,.04]);
    g.rotation.x=-.16;
  } else if(id === 'macaron') {
    ball(g,'#9bb57a',[0,.09,0],[.43,.19,.37]);
    cylinder(g,'#faf0d7',.34,.10,[0,0,0]);
    ball(g,'#b2c88d',[0,-.10,0],[.43,.17,.37]);
  } else if(id === 'cherry') {
    ball(g,'#b95360',[-.18,-.08,0],[.19,.20,.19]);
    ball(g,'#c7656c',[.18,-.08,.06],[.19,.20,.19]);
    stick(g,'#68834c',[-.18,.06,0],[.02,.5,0]);
    stick(g,'#68834c',[.18,.06,.06],[.02,.5,0]);
    ball(g,'#83a76b',[.15,.4,0],[.19,.05,.08]);
  } else if(id === 'cup') {
    cylinder(g,'#f8f1dc',.3,.42,[0,0,0],.36);
    cylinder(g,'#af8563',.31,.015,[0,.214,0]);
    const handle=mesh(new THREE.TorusGeometry(.18,.065,12,32),'#f8f1dc',g,[.38,.01,0]);
    cylinder(g,'#c8d6b9',.47,.055,[0,-.24,0]);
  } else if(id === 'nose') {
    mesh(new THREE.ConeGeometry(.57,.85,40),'#d37d72',g);
    ball(g,'#e4a58a',[0,.39,0],[.065,.065,.065]);
  } else if(id === 'fin') {
    const shape=new THREE.Shape();
    shape.moveTo(-.22,.55);shape.lineTo(.43,-.43);shape.lineTo(-.22,-.3);shape.closePath();
    mesh(new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:2}),'#c97268',g,[0,0,-.09]);
  } else if(id === 'window') {
    mesh(new THREE.TorusGeometry(.24,.07,16,40),'#d9aa65',g);
    const pane=cylinder(g,'#6899a7',.22,.07,[0,0,0]);pane.rotation.x=Math.PI/2;
    ball(g,'#d8eeeb',[-.06,.07,.06],[.05,.08,.025]);
  } else if(id === 'planet') {
    ball(g,'#e0b571',[0,0,0],[.46,.46,.46]);
    const ring=mesh(new THREE.TorusGeometry(.7,.07,12,64),'#ac94b3',g);
    ring.rotation.x=1.14;ring.rotation.y=.28;
  } else if(id === 'flag') {
    stick(g,'#9aa6af',[0,-.65,0],[0,.58,0],.04);
    box(g,'#7eaca4',[.27,.34,0],[.52,.34,.05]);
    star(g,'#fff1b6',.10,.02,[.27,.34,.032]);
  } else if(id === 'satellite') {
    box(g,'#e8cd8e',[0,0,0],[.36,.4,.32]);
    for(const side of [-1,1]) {
      box(g,'#7489ab',[side*.48,0,0],[.52,.36,.08]);
      for(let i=0;i<3;i+=1) box(g,'#a8b9cf',[side*.48+(i-1)*.14,0,.047],[.018,.3,.01]);
    }
    stick(g,'#b6bbc4',[0,.2,0],[.13,.48,0],.025);
    ball(g,'#d98c7d',[.13,.49,0],[.06,.06,.06]);
  } else if(id === 'coral') {
    for(const [a,b] of [[ [0,-.6,0],[0,.55,0] ],[[0,-.1,0],[-.34,.16,0]],[[-.34,.16,0],[-.34,.49,0]],[[0,.05,0],[.36,.32,.05]],[[.36,.32,.05],[.36,.65,.05]]]) {
      stick(g,'#d98e8f',a,b,.09);ball(g,'#d98e8f',b,[.09,.09,.09]);
    }
  } else if(id === 'fish') {
    ball(g,'#e7a562',[0,0,0],[.45,.25,.20]);
    const tail=mesh(new THREE.ConeGeometry(.25,.35,3),'#d88658',g,[-.49,0,0]);tail.rotation.z=Math.PI/2;
    ball(g,'#fff4dc',[.24,.06,.175],[.09,.09,.04]);ball(g,'#334d50',[.26,.065,.208],[.043,.043,.02]);
    ball(g,'#fff4dc',[.24,.06,-.175],[.09,.09,.04]);ball(g,'#334d50',[.26,.065,-.208],[.043,.043,.02]);
    const fin=mesh(new THREE.ConeGeometry(.15,.2,3),'#e6bd75',g,[0,.25,0]);
  } else if(id === 'shell') {
    ball(g,'#e9bcb0',[0,0,0],[.4,.1,.3]);
    const back=ball(g,'#ecc8bc',[0,.22,-.15],[.39,.32,.075]);back.rotation.x=-.35;
    ball(g,'#fff7dc',[0,.13,.04],[.13,.13,.13]);
  } else if(id === 'starfish') {
    const s=star(g,'#dfa572',.38,.10,[0,0,0]);s.rotation.x=-Math.PI/2;
    for(let i=0;i<5;i+=1) ball(g,'#f4d1a0',[Math.cos(i*1.26+.31)*.16,.1,Math.sin(i*1.26+.31)*.16],[.035,.035,.035]);
  } else if(id === 'lid') {
    const lid=box(g,'#b28660',[0,0,0],[.99,.2,.7]);lid.rotation.x=-.3;
    for(const x of [-.32,.32]) {const band=box(g,'#ddbb6c',[x,.09,0],[.075,.045,.71]);band.rotation.x=-.3;}
    box(g,'#ddbb6c',[0,-.02,.35],[.14,.17,.045]);
  } else if(id === 'seaweed') {
    for(let i=0;i<3;i+=1) {
      const stem=ball(g,['#7cae8f','#96bc94','#649d8d'][i],[(i-1)*.19,i===1?.12:0,0],[.10,.64-(i%2)*.06,.07]);
      stem.rotation.z=(i-1)*-.22;
    }
  }
  return g;
}

// 建立各主題已完成的基底，玩家只補上散落在場景中的缺件。
export function createBase(level) {
  const g=new THREE.Group();
  const baseColors={ dessert:'#d2c8a7',space:'#aeb8c8',ocean:'#91b9b3',forest:'#9fb48d',museum:'#b7a68e',carnival:'#9c91af' };
  const topColors={ dessert:'#e9dec0',space:'#d0d5dc',ocean:'#dacfaa',forest:'#cad6b3',museum:'#ded1bb',carnival:'#d8cee0' };
  const color=baseColors[level] || '#b7b7a8';
  cylinder(g,color,2.65,.28,[0,-.08,0]);
  cylinder(g,topColors[level] || '#e9dec0',2.56,.10,[0,.11,0]);
  if(level==='dessert') {
    cylinder(g,'#fbf2d9',1.65,.09,[0,.24,0]);
    cylinder(g,'#d19d79',1.34,.94,[0,.77,0]);
    cylinder(g,'#f3d7b1',1.36,.17,[0,.70,0]);
    cylinder(g,'#fff0d4',1.4,.19,[0,1.30,0]);
    for(let i=0;i<22;i+=1) {
      const a=i*Math.PI/11;
      ball(g,'#fff0d4',[Math.cos(a)*1.32,1.20,Math.sin(a)*1.32],[.12,.17+(i%3)*.045,.12]);
    }
    for(let i=0;i<8;i+=1) {
      const a=i*.785;
      ball(g,'#fff7e3',[Math.cos(a)*.95,1.44,Math.sin(a)*.95],[.15,.12,.15]);
    }
    box(g,'#d6b69a',[.65,.2,1.9],[.8,.045,.4]);
    for(let i=0;i<3;i+=1) ball(g,'#baa483',[-.6+i*.23,.18,1.93],[.045,.025,.04]);
  } else if(level==='space') {
    cylinder(g,'#edead9',.55,1.55,[0,1.44,0],.57);
    cylinder(g,'#7899a1',.57,.17,[0,.7,0]);
    cylinder(g,'#d4b984',.35,.3,[0,.44,0],.28);
    const fin=createPiece('fin');fin.position.set(-.64,.8,0);fin.rotation.y=Math.PI;g.add(fin);
    const rocket=new THREE.Group();
    rocket.name='rocket';
    rocket.userData.interaction={ motion:'launch',name:'火箭' };
    for(const child of [...g.children].slice(2)) rocket.add(child);
    const exhaust=new THREE.Group();
    exhaust.name='rocketExhaust';
    exhaust.position.y=.29;
    exhaust.visible=false;
    for(const [radius,height,color] of [[.23,.75,'#ff843d'],[.13,.5,'#ffe784']]) {
      const flame=mesh(new THREE.ConeGeometry(radius,height,20),color,exhaust,[0,-height/2,0]);
      flame.rotation.z=Math.PI;
      flame.material.emissive.set(color);
      flame.material.emissiveIntensity=.8;
    }
    rocket.add(exhaust);
    g.add(rocket);
    for(let i=0;i<7;i+=1) {
      const a=i*2.4;
      ball(g,'#bdc5cd',[Math.cos(a)*2,.20,Math.sin(a)*2],[.2+(i%2)*.09,.09,.18]);
    }
    cylinder(g,'#c4cdd3',.35,.025,[-1.45,.17,1.25]);
    cylinder(g,'#b8c2cc',.24,.03,[-1.45,.18,1.25]);
  } else if(level==='ocean') {
    ball(g,'#97aca3',[-.4,.4,-.65],[.78,.33,.62]);
    ball(g,'#abbdb1',[-.7,.56,-.77],[.39,.40,.35]);
    box(g,'#a27d59',[.6,.48,-.85],[1,.53,.72]);
    for(const x of [.26,.94]) box(g,'#d6b76e',[x,.49,-.48],[.07,.5,.035]);
    for(let i=0;i<7;i+=1) ball(g,['#adba9e','#c5c6ac','#9caf9f'][i%3],[Math.cos(i*1.5)*2.13,.2,Math.sin(i*1.5)*2.13],[.23,.1,.16]);
    for(let i=0;i<3;i+=1) ball(g,'#b5d6d0',[1.7+i*.08,.66+i*.38,-.45],[.075+i*.025,.075+i*.025,.075+i*.025]);
    const plant=createPiece('seaweed');plant.scale.setScalar(.6);plant.position.set(1.7,.5,-.9);g.add(plant);
  } else if(level==='forest') {
    box(g,'#d9b68b',[0,.17,.05],[1.42,.06,1.14]);
    for(let i=0;i<4;i+=1) {
      const x=(i%2?1:-1)*.48,z=(i<2?1:-1)*.38;
      const tree=new THREE.Group();
      tree.position.set(x,.19,z);
      tree.userData.interaction={ motion:'tree', name:'小樹' };
      g.add(tree);
      cylinder(tree,'#8a6c4e',.07,.48,[0,.24,0]);
      mesh(new THREE.ConeGeometry(.35,.75,14),'#73906b',tree,[0,.73,0]);
      mesh(new THREE.ConeGeometry(.27,.58,14),'#829e73',tree,[0,1.06,0]);
    }
    cylinder(g,'#a87e59',.34,.32,[0,.32,-.25]);
    cylinder(g,'#d0a879',.35,.025,[0,.49,-.25]);
  } else if(level==='museum') {
    box(g,'#d7c7ad',[0,.23,0],[3.65,.18,2.75]);
    for(const x of [-.68,.68]) for(const z of [-.48,.48]) cylinder(g,'#c0aa8d',.065,.72,[x,.57,z]);
    const platform=box(g,'#a99073',[0,.41,0],[1.55,.4,.76]);
    for(let i=0;i<7;i+=1) {
      const x=-.65+i*.22;
      ball(g,'#e2d4b5',[x,.78,0],[.09,.09,.09]);
      stick(g,'#d5c5a7',[x,.78,0],[x,.94,Math.sin(i*.8)*.2],.025);
    }
    stick(g,'#d5c5a7',[-.72,.79,0],[.76,.79,0],.05);
  } else if(level==='carnival') {
    cylinder(g,'#cabed3',1.18,.12,[0,.25,0]);
    cylinder(g,'#9f7595',.09,2.1,[0,1.23,0]);
    const wheelGroup=new THREE.Group();
    wheelGroup.position.set(0,1.38,0);
    wheelGroup.userData.interaction={ motion:'wheel', name:'摩天輪' };
    g.add(wheelGroup);
    const wheel=mesh(new THREE.TorusGeometry(1.02,.065,12,48),'#d0aa68',wheelGroup);wheel.rotation.y=Math.PI/2;
    for(let i=0;i<8;i+=1) {
      const angle=i*Math.PI/4;
      stick(wheelGroup,'#d0aa68',[0,0,0],[0,Math.sin(angle)*1.02,Math.cos(angle)*1.02],.025);
      const cabin=box(wheelGroup,['#d87d82','#7fa3ae','#d4b36f','#9e88ad'][i%4],[0,Math.sin(angle)*1.02,Math.cos(angle)*1.02],[.28,.22,.2]);
      cabin.name='wheelCabin';
    }
    for(const x of [-.62,.62]) {
      stick(g,'#806d63',[x,.15,.62],[x,.82,.62],.035);
      stick(g,'#806d63',[x,.82,.62],[0,1.08,.62],.035);
    }
  }
  const scenery=new THREE.Group();
  const actions={ dessert:['cake','蛋糕'],space:['sway','月球地面'],ocean:['sea','海底小景'],forest:['sway','野餐營地'],museum:['sway','恐龍展示台'],carnival:['sway','遊樂園舞台'] };
  const [motion,name]=actions[level];
  scenery.userData.interaction={ motion,name };
  for(const child of [...g.children].slice(2)) scenery.add(child);
  g.add(scenery);
  return g;
}
