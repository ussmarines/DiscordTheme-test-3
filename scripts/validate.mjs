import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import * as csstree from 'css-tree';
import {assemble,root,modules} from './build.mjs';
const {meta,css}=await assemble();const errors=[];const check=(test,msg)=>{if(!test)errors.push(msg)};
check(css===await readFile(path.join(root,`dist/${meta.name}.theme.css`),'utf8'),'Distribution stale: run npm run build');
check(Buffer.byteLength(css)<80000,'CSS exceeds reviewed 80KB budget');
check(!/@import\b|url\s*\(/i.test(css),'Unexpected remote import or asset URL');
check(!/https?:\/\//.test(css.replace(/^\/\*\*[\s\S]*?\*\//,'')),'Unexpected resource URL');
check(!/\.[a-zA-Z][\w-]*_{1,2}[a-f0-9]{5,8}\b/.test(css),'Hardcoded hashed class');
check((css.match(/!important/g)||[]).length<=2,'Excessive !important');
const ast=csstree.parse(css,{positions:true,onParseError:e=>errors.push(e.message)});
const defined=new Set();const referenced=new Set();let declarations=0,selectors=0;
csstree.walk(ast,{visit:'Declaration',enter(n){declarations++;if(n.property.startsWith('--'))defined.add(n.property);else{const result=csstree.lexer.matchProperty(n.property,n.value);if(result.error&&!/var\(/.test(csstree.generate(n.value)))errors.push(`${n.loc.start.line}: ${result.error.message}`)}}});
csstree.walk(ast,{visit:'Selector',enter(){selectors++}});
for(const m of css.matchAll(/var\(\s*(--[\w-]+)/g))if(m[1].startsWith(`--${meta.namespace}-`))referenced.add(m[1]);
for(const name of referenced)check(defined.has(name),`Undefined theme variable ${name}`);
for(const m of modules){const text=await readFile(path.join(root,`src/${m}.css`),'utf8');check(text.split('\n').length<=350,`Oversized module ${m}`);}
check((await stat(path.join(root,'assets/logo.svg'))).size<5000,'Oversized logo');
// Contrast checks are token-level evidence, not a substitute for rendered UI QA.
const luminance=h=>{const c=h.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const options=await readFile(path.join(root,'src/tokens/options.css'),'utf8');const contrast=[];
for(const mode of ['dark','light']){const text=await readFile(path.join(root,`src/modes/${mode}.css`),'utf8');const get=k=>text.match(new RegExp(`--${meta.namespace}-${k}: (#[a-f0-9]{6})`))[1];const accent=options.match(new RegExp(`--${meta.namespace}-accent-${mode}: (#[a-f0-9]{6})`))[1];for(const fg of ['ink','muted'])for(const bg of ['canvas','surface','raised']){const r=ratio(get(fg),get(bg));check(r>=4.5,`${mode} ${fg}/${bg}: ${r.toFixed(2)} < 4.5`);contrast.push({mode,fg,bg,ratio:+r.toFixed(2)});}for(const bg of ['canvas','surface','raised']){check(ratio(accent,get(bg))>=4.5,`${mode} accent/${bg} < 4.5`);check(ratio(get('line'),get(bg))>=3,`${mode} control boundary/${bg} < 3`);}check(ratio(accent,mode==='dark'?get('canvas'):'#ffffff')>=4.5,`${mode} button text < 4.5`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(JSON.stringify({status:'PASS_STATIC',bytes:Buffer.byteLength(css),modules:modules.length,declarations,selectors,themeVariables:defined.size,contrast,remoteRequests:0},null,2));
