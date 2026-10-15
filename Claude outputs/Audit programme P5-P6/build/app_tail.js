// ===== TIPS (pistes d'activité héritées, mathématiques) =====
let activeTipBtn=null;
function initTips(){
  document.querySelectorAll('#tab-math .item').forEach(item=>{
    const txt=((item.querySelector('label')?.textContent||'')+' '+(item.querySelector('.d-row .d-v')?.textContent||'')).toLowerCase();
    for(const[key,html] of Object.entries(TIPS)){
      if(txt.includes(key.toLowerCase())){
        if(!item.querySelector('.tip-btn')){
          const btn=document.createElement('button');
          btn.className='tip-btn';btn.textContent='i';btn.title="Voir une piste d'activité";
          btn.addEventListener('click',e=>{e.stopPropagation();showTip(btn,html);});
          item.insertBefore(btn,item.querySelector('.detail'));
        }
        break;
      }
    }
  });
}
function showTip(btn,html){
  if(activeTipBtn===btn){closeTip();return;}
  if(activeTipBtn)activeTipBtn.classList.remove('active');
  activeTipBtn=btn; btn.classList.add('active');
  const panel=document.getElementById('tip-panel');
  document.getElementById('tip-body').innerHTML=html;
  panel.style.display='block';
  const rect=btn.getBoundingClientRect();
  const pw=320; let left=rect.right+8;
  if(left+pw>window.innerWidth-8)left=rect.left-pw-8;
  if(left<8)left=8;
  let top=rect.top;
  const ph=panel.offsetHeight||150;
  if(top+ph>window.innerHeight-8)top=window.innerHeight-ph-8;
  if(top<8)top=8;
  panel.style.left=left+'px'; panel.style.top=top+'px';
}
function closeTip(){
  document.getElementById('tip-panel').style.display='none';
  if(activeTipBtn){activeTipBtn.classList.remove('active');activeTipBtn=null;}
}
document.addEventListener('click',e=>{
  const tp=document.getElementById('tip-panel');
  if(tp.style.display!=='none'&&!tp.contains(e.target)&&!e.target.classList.contains('tip-btn'))closeTip();
});
// ===== INIT =====
loadState();
try{const t=localStorage.getItem('p5p6tab');if(t&&document.getElementById('tab-'+t))showTab(t);}catch(e){}
updateAll();
addUncheckToDomains();
initTips();
