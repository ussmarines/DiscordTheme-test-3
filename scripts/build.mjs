import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const modules=['tokens/options','modes/dark','modes/light','core/discord-vars','core/base','surfaces/navigation','surfaces/chat','surfaces/conversation-shape','surfaces/overlays','surfaces/settings','surfaces/voice','core/layout','integrations/client-mods','accessibility'];
export async function assemble(){
 const meta=JSON.parse(await readFile(path.join(root,'theme.json'),'utf8'));
 for(const key of ['name','author','description','version'])if(typeof meta[key]!=='string'||!meta[key]||/[\r\n]|\*\//.test(meta[key]))throw Error(`Invalid metadata: ${key}`);
 if(!/^[A-Za-z][A-Za-z0-9]+$/.test(meta.name)||!/^\d+\.\d+\.\d+$/.test(meta.version))throw Error('Invalid name or version');
 if(!/^https:\/\/github\.com\/ussmarines\/DiscordTheme-test-[123]$/.test(meta.repository))throw Error('Unexpected repository');
 let donation='';
 if(meta.PAYPAL_DONATION_URL){const u=new URL(meta.PAYPAL_DONATION_URL);if(u.protocol!=='https:'||!['paypal.me','www.paypal.com','paypal.com'].includes(u.hostname)||u.username||u.password||/[\s<>*]/.test(meta.PAYPAL_DONATION_URL))throw Error('Donation must be a real HTTPS PayPal URL');donation=` * @donate ${u.href}\n`;}
 const header=`/**\n * @name ${meta.name}\n * @author ${meta.author}\n * @version ${meta.version}\n * @description ${meta.description}\n * @source ${meta.repository}\n * @website ${meta.repository}\n${donation} */\n`;
 const parts=await Promise.all(modules.map(async m=>`\n/* Source: src/${m}.css */\n${(await readFile(path.join(root,`src/${m}.css`),'utf8')).trim()}\n`));
 return {meta,css:header+parts.join('')};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const {meta,css}=await assemble();await mkdir(path.join(root,'dist'),{recursive:true});await writeFile(path.join(root,`dist/${meta.name}.theme.css`),css);
 const readmePath=path.join(root,'README.md');let readme=await readFile(readmePath,'utf8');
 const donation=meta.PAYPAL_DONATION_URL?`[![Donate with PayPal](assets/donate.svg)](${meta.PAYPAL_DONATION_URL})`:'Donations are not configured: `PAYPAL_DONATION_URL` is missing.';
 readme=readme.replace(/<!-- donation:start -->[\s\S]*?<!-- donation:end -->/,`<!-- donation:start -->\n${donation}\n<!-- donation:end -->`);await writeFile(readmePath,readme);
 console.log(`${meta.name}: ${Buffer.byteLength(css)} bytes, ${modules.length} modules`);
}
