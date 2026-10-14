/*
  The moving dot field behind the dark header of the Research, Team and Contact pages.
  It draws into <canvas class="field"> inside any element marked data-field.
*/
(() => {
  const holder = document.querySelector('[data-field]');
  if (!holder) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas');
  cv.id = 'field'; cv.setAttribute('aria-hidden', 'true');
  holder.prepend(cv);
  const gl = cv.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false });
  if (!gl) { cv.remove(); return; }

  const VS = `
  attribute vec2 a; uniform float t; uniform float asp; uniform vec2 m; varying float vA; varying float vScan;
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 perm(vec3 x){return mod289(((x*34.)+1.)*x);}
  float sn(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
    vec3 p=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 mm=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); mm=mm*mm; mm=mm*mm;
    vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
    mm*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.*dot(mm,g);}
  void main(){
    float x=a.x*7.0, z=.55+a.y*4.6;
    float h=sn(vec2(x*.5, z*.6 - t*.035))*.38 + sn(vec2(x*1.2+4., z*1.3 - t*.05))*.12;
    float s=fract(t*.05); float sz=mix(.2, 5.6, s);
    vScan=exp(-pow((z-sz)*2.6, 2.));
    h+=vScan*.06;
    vec3 q=vec3(x + m.x*.35, h - .78 - m.y*.06, z);
    float f=1.6;
    gl_Position=vec4(q.x*f/asp, q.y*f + .28*q.z, 0., q.z);
    float depth=clamp(1.-(q.z-.55)/4.8, 0., 1.);
    vA=depth*(.32+.68*smoothstep(-.4,.5,h));
    gl_PointSize=(1.1+2.4*depth)*${Math.min(devicePixelRatio || 1, 2).toFixed(1)};
  }`;
  const FS = `precision mediump float; varying float vA; varying float vScan; uniform vec3 c1; uniform vec3 c2;
  void main(){ vec2 d=gl_PointCoord-.5; float r=dot(d,d); if(r>.25) discard;
    float e=smoothstep(.25,.0,r); vec3 col=mix(c1,c2,vScan); gl_FragColor=vec4(col*e*(vA*.55+vScan*.9), 1.); }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const NX = 260, NZ = 180, pts = new Float32Array(NX * NZ * 2);
  for (let j = 0, k = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { pts[k++] = i / (NX - 1) - .5; pts[k++] = j / (NZ - 1); }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  gl.uniform3f(U('c1'), .62, .74, .82); gl.uniform3f(U('c2'), .37, .82, .85);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => {
    const r = holder.getBoundingClientRect();
    tx = Math.max(-.5, Math.min(.5, (e.clientX - r.left) / r.width - .5));
    ty = Math.max(-.5, Math.min(.5, (e.clientY - r.top) / r.height - .5));
  });
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; gl.viewport(0, 0, cv.width, cv.height); };
  size(); addEventListener('resize', size);

  const t0 = performance.now();
  const frame = now => {
    if (holder.getBoundingClientRect().bottom > 0) {
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      gl.clearColor(.0235, .039, .067, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U('t'), reduce ? 8 : (now - t0) / 1000 + 8); gl.uniform1f(U('asp'), cv.width / cv.height); gl.uniform2f(U('m'), mx, my);
      gl.drawArrays(gl.POINTS, 0, NX * NZ);
    }
    if (!reduce) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
