import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const assets=path.join(root,'assets');
const samples=JSON.parse(fs.readFileSync(path.join(assets,'sample.json'),'utf8'));
const screenshotIndex=JSON.parse(fs.readFileSync(path.join(assets,'component-screenshot-index.json'),'utf8'));
if(samples.length!==1)throw new Error('Expected one gallery sample.');
const sample=samples[0];
const assert=(value,message)=>{if(!value)throw new Error(message)};
assert(sample.source==='pnp','Gallery source must be pnp.');
assert(sample.metadata.some(item=>item.key==='SAMPLE-TYPE'&&item.value==='SPFx-CopilotComponent'),'Missing sample type metadata.');
assert(sample.thumbnails.length===10,'Expected ten curated publication thumbnails.');
assert(new Set(sample.thumbnails.map(item=>item.name)).size===10,'Thumbnail names must be unique.');
assert(new Set(sample.thumbnails.map(item=>item.order)).size===10,'Thumbnail order must be unique.');
assert(screenshotIndex.totalComponents===23,'Expected one published screenshot for every component.');
assert(screenshotIndex.screenshots.length===23,'Component screenshot index must contain 23 entries.');
assert(new Set(screenshotIndex.screenshots.map(item=>item.intent)).size===23,'Component screenshot intents must be unique.');
assert(new Set(screenshotIndex.screenshots.map(item=>item.file)).size===23,'Component screenshot files must be unique.');
for(const item of [...sample.thumbnails,...screenshotIndex.screenshots]){
  const file=path.join(assets,item.name||item.file);
  assert(fs.existsSync(file),`Missing screenshot ${item.name||item.file}.`);
  const buffer=fs.readFileSync(file);
  assert(buffer.length>10000,`Screenshot is unexpectedly small: ${item.name||item.file}.`);
  assert(buffer.subarray(1,4).toString()==='PNG',`Screenshot is not a PNG: ${item.name||item.file}.`);
  assert(item.alt.length>40,`Screenshot alt text is too short: ${item.name||item.file}.`);
  if(item.url)assert(item.url===`https://github.com/pnp/spfx-copilot-components/raw/main/samples/zava-customer-resolution-center/assets/${item.name}`,`Thumbnail URL mismatch: ${item.name}.`);
}
console.log(JSON.stringify({samples:1,thumbnails:10,componentScreenshots:23,missing:0,invalidSignatures:0,duplicateOrders:0}));
