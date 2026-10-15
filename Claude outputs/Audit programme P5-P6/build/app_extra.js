// ===== STATE — sauvegarde par identifiant d'attendu (localStorage) + hash positionnel versionné (partage d'URL) =====
function getItems(){return [...document.querySelectorAll('.item')];}
function getCbs(){return getItems().map(i=>i.querySelector('input[type=checkbox]'));}
function checkedIds(){return getItems().filter(i=>i.querySelector('input').checked).map(i=>i.dataset.id);}
function saveState(){
  const ids=checkedIds();
  try{localStorage.setItem('p5p6v5',JSON.stringify(ids));}catch(e){}
  const bits=getCbs().map(c=>c.checked?'1':'0').join('');
  let pad=bits; while(pad.length%4!==0)pad+='0';
  let enc=''; for(let i=0;i<pad.length;i+=4)enc+=parseInt(pad.slice(i,i+4),2).toString(16);
  history.replaceState(null,'','#'+VERSION+'-'+enc);
  const ind=document.getElementById('save-indicator');
  if(ind){ind.style.display='inline';clearTimeout(ind._t);ind._t=setTimeout(()=>ind.style.display='none',1400);}
}
function applyChecked(set){
  getItems().forEach(it=>{const cb=it.querySelector('input');cb.checked=set.has(it.dataset.id);it.classList.toggle('checked',cb.checked);});
}
function loadState(){
  // 1. hash de cette version (lien partagé) ; 2. localStorage par identifiant
  const h=location.hash||'';
  if(h.startsWith('#'+VERSION+'-')){
    const enc=h.slice(VERSION.length+2);
    let bits=''; for(const c of enc)bits+=parseInt(c,16).toString(2).padStart(4,'0');
    const items=getItems(); const set=new Set();
    items.forEach((it,i)=>{if(bits[i]==='1')set.add(it.dataset.id);});
    applyChecked(set); return;
  }
  try{
    const raw=localStorage.getItem('p5p6v5');
    if(raw){applyChecked(new Set(JSON.parse(raw)));}
  }catch(e){}
}
function resetAll(){
  if(!confirm('Réinitialiser toute la progression ?'))return;
  try{localStorage.removeItem('p5p6v5');}catch(e){}
  history.replaceState(null,'',location.pathname+location.search);
  applyChecked(new Set());
  updateAll();
}
// ===== CHECKBOXES =====
document.querySelectorAll('.item').forEach(item=>{
  item.addEventListener('click',e=>{
    if(e.target.closest('.detail')||e.target.closest('.det-btn')||e.target.closest('.tip-btn'))return;
    const cb=item.querySelector('input[type=checkbox]');
    if(e.target!==cb)cb.checked=!cb.checked;
    item.classList.toggle('checked',cb.checked);
    saveState(); updateAll();
  });
});
// ===== DETAIL (texte officiel + pistes) =====
function toggleDetail(btn){
  const item=btn.closest('.item'); const d=item.querySelector('.detail');
  const open=d.style.display!=='none';
  d.style.display=open?'none':'block'; btn.classList.toggle('active',!open);
}
function openAll(subj,btn){
  const sec=document.getElementById('tab-'+subj);
  const anyClosed=[...sec.querySelectorAll('.domain-body')].some(b=>b.style.display==='none');
  sec.querySelectorAll('.domain').forEach(dom=>{
    const body=dom.querySelector('.domain-body'),h=dom.querySelector('.domain-header'),t=h.querySelector('.domain-toggle');
    body.style.display=anyClosed?'block':'none'; t.classList.toggle('open',anyClosed); h.classList.toggle('open',anyClosed);
  });
  btn.textContent=anyClosed?'⊟ Tout replier':'⊞ Tout déplier';
}
// ===== PROGRESS =====
function visible(i){return i.style.display!=='none';}
function updateDomain(domId,progId,barId){
  const items=[...document.querySelectorAll('#'+domId+' .item')].filter(visible);
  const done=items.filter(i=>i.querySelector('input').checked).length;
  const pct=items.length?Math.round(done/items.length*100):0;
  const pe=document.getElementById(progId); if(pe)pe.textContent=done+'/'+items.length;
  const be=document.getElementById(barId); if(be)be.style.width=pct+'%';
}
function updateSubjectDesc(subj){
  const el=document.getElementById(subj+'-desc'); if(!el)return;
  const items=[...document.querySelectorAll('#tab-'+subj+' .item')].filter(visible);
  const done=items.filter(i=>i.querySelector('input').checked).length;
  const pct=items.length?Math.round(done/items.length*100):0;
  el.textContent=done+'/'+items.length+' ('+pct+'%)';
}
function updateGlobal(){
  const all=getItems().filter(visible);
  const done=all.filter(i=>i.querySelector('input').checked).length;
  const pct=all.length?Math.round(done/all.length*100):0;
  document.getElementById('global-count').textContent=done+'/'+all.length;
  document.getElementById('global-bar').style.width=pct+'%';
}
function updateAll(){
  DOMAINS.forEach(d=>updateDomain('domain-'+d,'prog-'+d,'bar-'+d));
  SUBJECTS.forEach(s=>updateSubjectDesc(s));
  updateGlobal();
}
// ===== TABS =====
function showTab(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelector('.tab.'+tab).classList.add('active');
  try{localStorage.setItem('p5p6tab',tab);}catch(e){}
  updateAll();
}
// ===== DOMAINS =====
function toggleDomain(header){
  const body=header.nextElementSibling.classList.contains('domain-body')?header.nextElementSibling:header.parentElement.querySelector('.domain-body');
  const toggle=header.querySelector('.domain-toggle');
  const isOpen=body.style.display!=='none';
  body.style.display=isOpen?'none':'block';
  toggle.classList.toggle('open',!isOpen);
  header.classList.toggle('open',!isOpen);
}
// ===== FILTERS (année × type) =====
const FILTERS={};
function applyFilters(subj){
  const f=FILTERS[subj]||{year:'all',type:'all'};
  document.querySelectorAll('#tab-'+subj+' .item').forEach(item=>{
    const okY=f.year==='all'||item.dataset.years.split(' ').includes(f.year);
    const okT=f.type==='all'||item.dataset.type===f.type;
    item.style.display=(okY&&okT)?'flex':'none';
  });
  document.querySelectorAll('#tab-'+subj+' .subsection').forEach(sub=>{
    const vis=[...sub.querySelectorAll('.item')].some(visible);
    sub.style.display=vis?'block':'none';
  });
  updateAll();
}
function filterYear(subj,year,btn){
  document.querySelectorAll('#tab-'+subj+' .year-filter .filter-btn.all,#tab-'+subj+' .year-filter .filter-btn.p5f,#tab-'+subj+' .year-filter .filter-btn.p6f').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  FILTERS[subj]=Object.assign(FILTERS[subj]||{year:'all',type:'all'},{year});
  applyFilters(subj);
}
function filterType(subj,type,btn){
  document.querySelectorAll('#tab-'+subj+' .year-filter .filter-btn.tall,#tab-'+subj+' .year-filter .filter-btn.ts,#tab-'+subj+' .year-filter .filter-btn.tsf,#tab-'+subj+' .year-filter .filter-btn.tc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  FILTERS[subj]=Object.assign(FILTERS[subj]||{year:'all',type:'all'},{type});
  applyFilters(subj);
}
// ===== UNCHECK =====
function uncheckSubject(subj){
  const labels={math:'Mathématiques',fr:'Français',sci:'Sciences',hist:'Histoire & Géo',eco:'Éco & Social',fmttn:'FMTTN',eca:'Éducation culturelle et artistique'};
  if(!confirm('Tout décocher dans "'+(labels[subj]||subj)+'" ?'))return;
  document.querySelectorAll('#tab-'+subj+' .item input[type=checkbox]').forEach(cb=>{cb.checked=false;cb.closest('.item').classList.remove('checked');});
  saveState(); updateAll();
}
function addUncheckToDomains(){
  document.querySelectorAll('.domain').forEach(dom=>{
    const h=dom.querySelector('.domain-header');
    if(!h||h.querySelector('.uncheck-btn'))return;
    const toggle=h.querySelector('.domain-toggle');
    const btn=document.createElement('button');
    btn.className='uncheck-btn';btn.textContent='↺';btn.title='Tout décocher ce domaine';
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const title=h.querySelector('.domain-title')?.textContent?.trim()||dom.id;
      if(!confirm('Tout décocher "'+title+'" ?'))return;
      dom.querySelectorAll('.item input[type=checkbox]').forEach(cb=>{cb.checked=false;cb.closest('.item').classList.remove('checked');});
      saveState(); updateAll();
    });
    h.insertBefore(btn,toggle);
  });
}
// ===== SEARCH (libellé abrégé + texte officiel) =====
const SMETA={
  'tab-math':{label:'Mathématiques',icon:'🔢'},
  'tab-fr':{label:'Français',icon:'📖'},
  'tab-sci':{label:'Sciences',icon:'🔬'},
  'tab-hist':{label:'Histoire & Géo',icon:'🌍'},
  'tab-eco':{label:'Éco & Social',icon:'💰'},
  'tab-fmttn':{label:'FMTTN',icon:'💻'},
  'tab-eca':{label:'ECA',icon:'🎨'},
};
let sDebounce;
function onSearch(val){
  clearTimeout(sDebounce);
  sDebounce=setTimeout(()=>runSearch(val),130);
  document.getElementById('clear-search').style.display=val?'block':'none';
}
function clearSearch(){
  const inp=document.getElementById('search-input');
  inp.value=''; inp.focus();
  document.getElementById('clear-search').style.display='none';
  document.getElementById('search-panel').style.display='none';
}
function fold(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
function runSearch(q){
  const panel=document.getElementById('search-panel');
  const header=document.getElementById('search-results-header');
  const body=document.getElementById('search-results-body');
  if(!q||q.trim().length<2){panel.style.display='none';return;}
  const ql=fold(q.trim());
  const matches=getItems().filter(it=>{
    const lbl=it.querySelector('label')?.textContent||'';
    const full=it.querySelector('.d-row .d-v')?.textContent||'';
    return fold(lbl+' '+full).includes(ql);
  });
  panel.style.display='block';
  if(!matches.length){header.textContent='Aucun résultat pour « '+q+' »';body.innerHTML='<div class="no-results">😕 Aucun résultat</div>';return;}
  header.textContent=matches.length+' résultat'+(matches.length>1?'s':'')+' pour « '+q+' »';
  const groups={};
  matches.forEach(it=>{const sid=it.closest('.section')?.id||'';if(!groups[sid])groups[sid]=[];groups[sid].push(it);});
  let html='';
  const esc=q.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for(const[sid,items] of Object.entries(groups)){
    const m=SMETA[sid]||{label:sid,icon:'📌'};
    html+=`<div class="sr-group"><div class="sr-group-title">${m.icon} ${m.label} <span style="font-weight:400;color:#94a3b8">(${items.length})</span></div>`;
    items.forEach(it=>{
      const cb=it.querySelector('input[type=checkbox]');
      const lbl=it.querySelector('label')?.textContent||'';
      const years=it.dataset.years.split(' ');
      const dom=it.closest('.domain')?.querySelector('.domain-title')?.textContent||'';
      const hi=lbl.replace(new RegExp(`(${esc})`,'gi'),'<mark>$1</mark>');
      const badges=years.map(y=>`<span class="badge ${y}">${y.toUpperCase()}</span>`).join('');
      html+=`<div class="sr-item${cb.checked?' checked':''}" data-id="${it.dataset.id}" onclick="toggleFromSearch(this)"><input type="checkbox"${cb.checked?' checked':''} onclick="event.stopPropagation();toggleFromSearch(this.closest('.sr-item'))"><label><span style="font-size:10px;color:#94a3b8;display:block;margin-bottom:2px">${dom}</span>${hi}</label>${badges}</div>`;
    });
    html+='</div>';
  }
  body.innerHTML=html;
}
function toggleFromSearch(sri){
  const real=document.querySelector('.item[data-id="'+sri.dataset.id+'"]');
  if(!real)return;
  const realCb=real.querySelector('input[type=checkbox]');
  realCb.checked=!realCb.checked;
  real.classList.toggle('checked',realCb.checked);
  const srCb=sri.querySelector('input[type=checkbox]');
  if(srCb)srCb.checked=realCb.checked;
  sri.classList.toggle('checked',realCb.checked);
  saveState(); updateAll();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')clearSearch();});
