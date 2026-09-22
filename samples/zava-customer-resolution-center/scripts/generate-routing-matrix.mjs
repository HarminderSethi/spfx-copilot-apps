import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=fs.readFileSync(path.join(root,'src','shared','catalog.ts'),'utf8');
const rows=[...source.matchAll(/intent\('([^']+)','([^']+)','([^']+)','([^']+)','([^']+)'[^\n]+?'([^']+)'\),?/g)].map(match=>({key:match[1],title:match[2],lens:match[3],route:match[4],operation:match[5],prompt:match[6]}));
if(rows.length!==23)throw new Error(`Expected 23 routing rows, parsed ${rows.length}.`);
const starters=JSON.parse(fs.readFileSync(path.join(root,'config','conversation-starters.json'),'utf8')).starters;
let output='# Zava Customer Resolution - Routing Matrix\n\nGenerated from the immutable intent catalog and canonical conversation starters.\n\n| Tool | Operation | Workspace | Full-screen route | Primary prompt |\n| --- | --- | --- | --- | --- |\n';
for(const row of rows)output+=`| \`${row.key}\` | ${row.operation} | ${row.lens} | \`${row.route}\` | ${row.prompt} |\n`;
output+='\n## Conversation Starters\n\n';
for(const starter of starters)output+=`- **${starter.title}:** ${starter.text} -> \`${starter.tool}\`\n`;
const target=path.join(root,'Zava-Customer-Resolution-Routing-Matrix.md');
if(process.argv.includes('--check')){
  const existing=fs.existsSync(target)?fs.readFileSync(target,'utf8').replaceAll('\r\n','\n'):'';
  if(existing!==output)throw new Error('Routing matrix is stale.');
  console.log(JSON.stringify({routes:rows.length,starters:starters.length,current:true}));
}else{
  fs.writeFileSync(target,output);
  console.log(`Generated ${rows.length} routing rows.`);
}
