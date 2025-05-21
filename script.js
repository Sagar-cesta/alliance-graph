
const SCALE = 1.2;

function partnerLogo(company, partnerName){
  const d = graphData[company];
  if(!d) return '';
  const x = d.partners.find(p=>p.name === partnerName);
  return x ? x.logo : '';
}

const sels = {
  target: document.getElementById('targetSel'),
  comp1: document.getElementById('comp1Sel'),
  comp2: document.getElementById('comp2Sel'),
  comp3: document.getElementById('comp3Sel')
};
const msgBox = document.getElementById('message');
const svgRoot = d3.select('#graph');
const W = 2200, H = 1400;
svgRoot.attr('viewBox', '0 0 ' + W + ' ' + H);
const container = svgRoot.append('g').attr('transform', 'scale(' + SCALE + ')').attr('id', 'graphContainer');

populate();
Object.values(sels).forEach(sel=>sel.addEventListener('change', render));
render();

function populate(){
  Object.values(sels).forEach(sel=>{
    sel.innerHTML = (sel === sels.target) ? '' : "<option value=''>–</option>";
  });
  Object.keys(graphData).forEach(name=>{
    const opt = new Option(name, name);
    sels.target.add(opt.cloneNode(true));
    sels.comp1.add(opt.cloneNode(true));
    sels.comp2.add(opt.cloneNode(true));
    sels.comp3.add(opt.cloneNode(true));
  });
  sels.target.value = Object.keys(graphData)[0] || '';
}

function render(){
  const chosen = [sels.target.value, sels.comp1.value, sels.comp2.value, sels.comp3.value].filter(Boolean);
  container.selectAll('*').remove();
  if(!chosen.length){ msgBox.style.display='none'; return; }

  let common = null;
  chosen.forEach(c=>{
    const set = new Set((graphData[c]?.partners || []).map(p=>p.name));
    common = (common === null) ? set : new Set([...common].filter(x=>set.has(x)));
  });
  if(chosen.length === 1){
    common = new Set((graphData[chosen[0]]?.partners || []).map(p=>p.name));
  }
  const partners = [...common];
  if(!partners.length){
    msgBox.textContent = 'No common alliances across selected companies.';
    msgBox.style.display = 'block';
    return;
  } else {
    msgBox.style.display = 'none';
  }

  const nodes = [], links = [], ids = new Set();
  chosen.forEach(c=>{
    const d = graphData[c];
    if(!d) return;
    if(!ids.has(c)){
      nodes.push({id: c, logo: d.center_logo, center: true});
      ids.add(c);
    }
  });
  partners.forEach(p=>{
    let logo = '';
    for(const c of chosen){
      const l = partnerLogo(c, p);
      if(l){ logo = l; break;}
    }
    if(!ids.has(p)){
      nodes.push({id: p, logo});
      ids.add(p);
    }
    chosen.forEach(c=>links.push({source: c, target: p}));
  });

  const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(180*SCALE))
      .force('charge', d3.forceManyBody().strength(-600*SCALE))
      .force('center', d3.forceCenter(W/(2*SCALE), H/(2*SCALE)));

  const link = container.append('g').selectAll('line').data(links).enter().append('line').attr('class','link');

  const icon = 50*SCALE;
  const node = container.append('g').selectAll('a').data(nodes).enter()
    .append('a')
    .attr('xlink:href', d => d.website || (d.logo ? 'https://' + d.logo.replace(/^https?:\/\/logo\.clearbit\.com\//,'') : '#'))
    .attr('target', '_blank')
    .append('image')
      .attr('href',d=>d.logo)
      .attr('width',icon).attr('height',icon)
      .attr('x',-icon/2).attr('y',-icon/2)
      .call(d3.drag().on('start',ds).on('drag',dg).on('end',de));

  const tip = d3.select('body').append('div').attr('class','tooltip');
  node.on('mouseover',(e,d)=>tip.style('opacity',1).text(d.id))
      .on('mousemove',e=>tip.style('left',(e.pageX+15)+'px').style('top',e.pageY+'px'))
      .on('mouseout',()=>tip.style('opacity',0));

  sim.on('tick',()=>{
    link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y)
        .attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
    node.attr('transform',d=>'translate('+d.x+','+d.y+')');
  });

  function ds(event,d){ if(!event.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; }
  function dg(event,d){ d.fx=event.x; d.fy=event.y; }
  function de(event,d){ if(!event.active) sim.alphaTarget(0); d.fx=d.fy=null; }
}
