const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const sampleLeads = [
  { nombre: 'María González', email: 'maria@empresa.cl', servicio: 'Sitio Web', estado: 'Nuevo', origen: 'Formulario Web' },
  { nombre: 'Juan Pérez', email: 'juan@empresa.cl', servicio: 'Soporte TI', estado: 'Contactado', origen: 'LinkedIn' },
  { nombre: 'Carla Rojas', email: 'carla@empresa.cl', servicio: 'Automatización', estado: 'Calificado', origen: 'Instagram' },
  { nombre: 'Diego Morales', email: 'diego@empresa.cl', servicio: 'CRM', estado: 'Cierre', origen: 'Facebook' }
];

function menuToggle(){
  const btn = $('.mobile-toggle');
  const menu = $('.menu');
  if(btn && menu){ btn.addEventListener('click', () => menu.classList.toggle('open')); }
}

function getLeads(){
  const stored = localStorage.getItem('portfolio_leads_demo');
  return stored ? JSON.parse(stored) : sampleLeads;
}
function setLeads(leads){ localStorage.setItem('portfolio_leads_demo', JSON.stringify(leads)); }
function statusClass(estado){
  return estado.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function renderLeadTable(){
  const table = $('#leadTableBody');
  if(!table) return;
  const filter = $('#leadFilter')?.value || 'Todos';
  const leads = getLeads().filter(l => filter === 'Todos' || l.estado === filter);
  table.innerHTML = leads.map(l => `
    <tr>
      <td>${l.nombre}</td><td>${l.email}</td><td>${l.servicio}</td><td>${l.origen}</td>
      <td><span class="badge ${statusClass(l.estado)}">${l.estado}</span></td>
    </tr>
  `).join('');
  const kpiTotal = $('#kpiTotal');
  const kpiCalificados = $('#kpiCalificados');
  const kpiCierre = $('#kpiCierre');
  const all = getLeads();
  if(kpiTotal) kpiTotal.textContent = all.length;
  if(kpiCalificados) kpiCalificados.textContent = all.filter(l => l.estado === 'Calificado').length;
  if(kpiCierre) kpiCierre.textContent = all.filter(l => l.estado === 'Cierre').length;
}
function leadForm(){
  const form = $('#leadForm');
  if(!form) return;
  renderLeadTable();
  $('#leadFilter')?.addEventListener('change', renderLeadTable);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const lead = {
      nombre: data.get('nombre') || 'Cliente demo',
      email: data.get('email') || 'cliente@demo.cl',
      servicio: data.get('servicio') || 'Sitio Web',
      estado: 'Nuevo',
      origen: data.get('origen') || 'Formulario Web'
    };
    const leads = [lead, ...getLeads()];
    setLeads(leads);
    form.reset();
    renderLeadTable();
    showToast('Lead guardado en la demo local. Puedes exportarlo a CSV.');
  });
  $('#resetLeads')?.addEventListener('click', () => { setLeads(sampleLeads); renderLeadTable(); showToast('Demo reiniciada con datos de ejemplo.'); });
  $('#exportCsv')?.addEventListener('click', () => {
    const leads = getLeads();
    const rows = [['Nombre','Email','Servicio','Origen','Estado'], ...leads.map(l => [l.nombre,l.email,l.servicio,l.origen,l.estado])];
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leads-demo-portafolio.csv';
    link.click();
  });
}

function chatbot(){
  const box = $('#chatBox');
  if(!box) return;
  const replies = {
    web: 'Perfecto. Para una PYME recomiendo una landing page con WhatsApp, formulario, SEO básico y una sección de servicios clara.',
    crm: 'Un CRM simple puede ayudarte a registrar clientes, estado de oportunidad, próximas tareas y reportes de seguimiento.',
    soporte: 'Puedo ayudarte con soporte remoto, correos, Microsoft 365, Google Workspace, respaldos y configuración de equipos.',
    automatizacion: 'La automatización conecta formularios, Google Sheets, email y CRM para no perder clientes interesados.'
  };
  function add(text, type='bot'){
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  $$('.chat-demo-btn').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.reply;
    add(btn.textContent.trim(), 'user');
    setTimeout(() => add(replies[key] || 'Cuéntame más de tu negocio y preparo una solución.'), 250);
  }));
}

function calculator(){
  const form = $('#roiForm');
  if(!form) return;
  form.addEventListener('input', calculate);
  calculate();
  function calculate(){
    const leads = Number($('#calcLeads').value || 0);
    const conversion = Number($('#calcConversion').value || 0) / 100;
    const ticket = Number($('#calcTicket').value || 0);
    const ventas = Math.round(leads * conversion);
    const ingreso = ventas * ticket;
    $('#calcVentas').textContent = ventas;
    $('#calcIngresos').textContent = ingreso.toLocaleString('es-CL', {style:'currency', currency:'CLP', maximumFractionDigits:0});
  }
}

function showToast(message){
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed'; toast.style.bottom = '22px'; toast.style.left = '50%'; toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'linear-gradient(90deg,#3478ff,#9b4dff)'; toast.style.color = '#fff'; toast.style.padding = '14px 18px'; toast.style.borderRadius = '14px'; toast.style.boxShadow = '0 18px 45px rgba(0,0,0,.4)'; toast.style.zIndex = '9999'; toast.style.fontWeight = '800';
  document.body.appendChild(toast); setTimeout(() => toast.remove(), 2600);
}

document.addEventListener('DOMContentLoaded', () => {
  menuToggle(); leadForm(); chatbot(); calculator();
});
