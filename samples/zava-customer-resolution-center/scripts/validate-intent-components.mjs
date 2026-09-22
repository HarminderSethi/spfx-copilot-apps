import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const manifests=fs.readdirSync(path.join(root,'src','copilotComponents'),{withFileTypes:true})
  .filter(item=>item.isDirectory())
  .map(item=>path.join(root,'src','copilotComponents',item.name,`${item.name[0].toUpperCase()}${item.name.slice(1)}CopilotComponent.manifest.json`))
  .filter(fs.existsSync)
  .map(file=>JSON.parse(fs.readFileSync(file,'utf8')));
const config=JSON.parse(fs.readFileSync(path.join(root,'config','config.json'),'utf8'));
const agent=JSON.parse(fs.readFileSync(path.join(root,'config','copilot-agent.json'),'utf8'));
const assert=(value,message)=>{if(!value)throw new Error(message)};
const entries=Object.values(config.bundles).flatMap(bundle=>bundle.components||[]);
const ids=manifests.map(item=>item.id);
const tools=manifests.map(item=>item.tools?.[0]?.name);
const descriptions=manifests.map(item=>item.tools?.[0]?.description?.default);
assert(manifests.length===23,`Expected 23 manifests, received ${manifests.length}.`);
assert(new Set(ids).size===23,'Component GUIDs must be unique.');
assert(new Set(tools).size===23,'Tool names must be unique.');
assert(new Set(descriptions).size===23,'Tool descriptions must be unique.');
assert(descriptions.every(item=>item&&!/ description|placeholder/i.test(item)),'Placeholder tool description found.');
assert(descriptions.every(item=>item.startsWith('Use when ')&&item.includes('Do not use ')),'Every tool description must define positive and negative LLM routing boundaries.');
assert(Object.keys(config.bundles).length===1,'Expected one shared bundle.');
assert(entries.length===23&&new Set(entries.map(item=>item.manifest)).size===23,'Bundle must contain 23 unique manifest entries.');
assert(config.localizedResources&&Object.keys(config.localizedResources).length===0,'Generated localized placeholder resources must not remain.');
assert(agent.agents[0].components.length===23&&!ids.some(id=>!agent.agents[0].components.includes(id)),'Agent registration must exactly cover manifest GUIDs.');
for(const manifest of manifests){const schema=manifest.tools[0].propertiesSchema?.id;assert(schema&&schema.includes('CopilotComponentProperties.js'),'Manifest schema reference is missing.');}
console.log(JSON.stringify({components:23,uniqueGuids:23,uniqueTools:23,bundles:1,entries:23,placeholderDescriptions:0,routingBoundaries:23}));
