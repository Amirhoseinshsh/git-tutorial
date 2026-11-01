const CITIES=["Tehran","Tabriz","Shiraz","Isfahan","Mashhad","Ahvaz","Qom","Kerman","Karaj","Rasht","Yazd","Urmia","Zanjan","Hamadan","Arak","Ardabil","Bandar Abbas","Bushehr","Birjand","Gorgan","Ilam","Kermanshah","Sanandaj","Semnan","Sari","Zahedan","Khorramabad","Yasuj","Shahrekord","Bojnord","London","Lisbon","Paris","Berlin","Madrid","Rome","Tokyo","Toronto","New York","Istanbul","Dubai","Doha","Delhi","Cairo","Sydney"];
const q=document.getElementById('q'),list=document.getElementById('list'),ghost=document.getElementById('ghost');
let items=[],sel=0;

function lev(a,b){ // فاصله ویرایشی (حساس به حروف)
  const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i]);
  for(let j=1;j<=n;j++)d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return d[m][n];
}
function rank(v){
  return CITIES.map(c=>({c,d:lev(v,c.slice(0,v.length))}))
    .sort((x,y)=>x.d-y.d||x.c.length-y.c.length||x.c.localeCompare(y.c))
    .slice(0,5);
}
function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function render(){
  const v=q.value;
  items=v?rank(v):[];
  if(sel>=items.length)sel=0;
  list.innerHTML=items.map((it,i)=>{
    const k=it.c.startsWith(v)?v.length:0;
    return `<li class="${i===sel?'on':''}" data-i="${i}"><span><mark>${esc(it.c.slice(0,k))}</mark>${esc(it.c.slice(k))}</span><small>${it.d===0?'':'فاصله '+it.d}</small></li>`;
  }).join('');
  const top=items[sel];
  ghost.innerHTML=top&&top.c.startsWith(v)?`<b>${esc(v)}</b>${esc(top.c.slice(v.length))}`:'';
}
function accept(i){if(items[i]){q.value=items[i].c;sel=0;render();list.innerHTML='';ghost.innerHTML='';}}
q.addEventListener('input',()=>{sel=0;render()});
q.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%Math.max(items.length,1);render()}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+items.length)%Math.max(items.length,1);render()}
  else if(e.key==='Tab'||e.key==='Enter'){if(items.length&&q.value){e.preventDefault();accept(sel)}}
  else if(e.key==='Escape'){list.innerHTML='';ghost.innerHTML=''}
});
list.addEventListener('mousedown',e=>{const li=e.target.closest('li');if(li){e.preventDefault();accept(+li.dataset.i)}});
