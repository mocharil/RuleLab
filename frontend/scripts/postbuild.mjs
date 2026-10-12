import fs from "node:fs";
import path from "node:path";
const output=path.resolve("..","app","static","framework");
fs.writeFileSync(path.join(output,"package.json"),JSON.stringify({type:"module"},null,2)+"\n");
const lock=JSON.parse(fs.readFileSync("package-lock.json","utf8"));
const packages=Object.entries(lock.packages).filter(([key,value])=>key.startsWith("node_modules/")&&!value.dev).map(([key])=>key.slice("node_modules/".length));
let notices="RuleLab component framework: third-party licenses\n\n";
for(const name of packages){
  const folder=path.resolve("node_modules",name);
  if(!fs.existsSync(folder))continue;
  const file=fs.readdirSync(folder).find(name=>/^licen[sc]e/i.test(name));
  if(file)notices+=name+"\n"+"=".repeat(70)+"\n"+fs.readFileSync(path.join(folder,file),"utf8")+"\n\n";
}
fs.writeFileSync(path.join(output,"THIRD_PARTY_NOTICES.txt"),notices);
