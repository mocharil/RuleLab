// Stable issue clusters keep a large live network readable between polling updates.
export const NETWORK={width:1100,height:850,cx:550,cy:375};
export const CLUSTERS=[
 {id:'access',label:'Service access',x:230,y:185,color:'#bd2945'},
 {id:'accessibility',label:'Akomodasi',x:550,y:145,color:'#9754b6'},
 {id:'capacity',label:'Pelaksanaan',x:870,y:220,color:'#317e9c'},
 {id:'cost',label:'Cost & budget',x:865,y:555,color:'#b5852d'},
 {id:'clarity',label:'Kepastian norma',x:550,y:635,color:'#3e8b69'},
 {id:'other',label:'Sector impact',x:220,y:555,color:'#6b7a9b'},
];
export function layoutNetwork(personas){
 const positions=new Map();
 for(const cluster of CLUSTERS){
  const members=personas.filter(p=>(p.cluster||p.issue||'other')===cluster.id);
  const radius=members.length<=1?0:members.length<=4?68:members.length<=7?88:108;
  members.forEach((p,i)=>{
   const angle=-Math.PI/2+i*Math.PI*2/members.length;
   positions.set(p.id,[Math.round(cluster.x+Math.cos(angle)*radius),Math.round(cluster.y+Math.sin(angle)*radius)]);
  });
 }
 return personas.map(p=>positions.get(p.id)||[NETWORK.cx,NETWORK.cy]);
}
export function opinionPosition(point,round,totalRounds=4){
 const angle=-Math.PI/2+(round-1)*Math.PI*2/totalRounds;
 const distance=36;
 return [Math.round(point[0]+Math.cos(angle)*distance),Math.round(point[1]+Math.sin(angle)*distance)];
}
export function sourcePositions(count){
 return Array.from({length:count},(_,i)=>[110+i*(880/Math.max(1,count-1)),790]);
}
