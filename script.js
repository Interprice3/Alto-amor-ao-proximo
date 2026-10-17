const form=document.getElementById('memberForm'), success=document.getElementById('success');let latest=null;
document.getElementById('year').textContent=new Date().getFullYear();
const birth=form.elements.nascimento;const today=new Date();birth.max=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
form.elements.nome.addEventListener('input',e=>{e.target.value=e.target.value.replace(/[^A-Za-zÀ-ÿ\s'-]/g,'')});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new Date(birth.value+'T00:00:00');if(Number.isNaN(d.getTime())||d>today){birth.setCustomValidity('Introduza uma data real, não futura.');birth.reportValidity();birth.setCustomValidity('');return}
const fd=new FormData(form);const obj={};for(const [k,v] of fd.entries()){if(k==='contribuicao'){(obj[k]??=[]).push(v)}else if(k!=='declaracao')obj[k]=v}
obj.contribuicao=obj.contribuicao||[];if(obj.outra)obj.contribuicao.push('Outra: '+obj.outra);obj.dataCadastro=new Date().toLocaleDateString('pt-MZ');latest=obj;
try{const all=JSON.parse(localStorage.getItem('altoAmorCadastros')||'[]');all.push(obj);localStorage.setItem('altoAmorCadastros',JSON.stringify(all));}catch(err){alert('Não foi possível guardar neste dispositivo. Verifique o espaço disponível.');return}
success.hidden=false;success.scrollIntoView({behavior:'smooth',block:'center'});});
document.getElementById('resetBtn').addEventListener('click',()=>{success.hidden=true;latest=null});
document.getElementById('pdfBtn').addEventListener('click',()=>{if(!latest)return;if(!window.jspdf){alert('A biblioteca de PDF não carregou. Verifique a ligação à internet e tente novamente.');return}
const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});const red=[233,35,45],black=[28,29,34];let y=18;
doc.setFillColor(...red);doc.rect(0,0,210,5,'F');doc.setTextColor(...black);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text('FICHA DE CADASTRO DE MEMBRO',105,y+5,{align:'center'});y+=15;
doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text('ALTO AMOR AO PRÓXIMO - MÃOS SOLIDÁRIAS PARA SEMPRE',105,y,{align:'center'});y+=12;
function section(title){doc.setFillColor(255,239,240);doc.rect(14,y-5,182,8,'F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(...red);doc.text(title,17,y);y+=9;doc.setTextColor(...black);doc.setFont('helvetica','normal');doc.setFontSize(10)}
function row(label,value){const val=String(value||'—');const lines=doc.splitTextToSize(label+': '+val,178);if(y+lines.length*5>275){doc.addPage();y=18}doc.text(lines,16,y);y+=Math.max(7,lines.length*5)}
section('1. DADOS DO MEMBRO');row('Nome completo',latest.nome);row('Data de nascimento',latest.nascimento);row('BI/Documento',latest.documento);row('Telefone/WhatsApp',latest.telefone);row('E-mail',latest.email);row('Bairro/Cidade',latest.localidade);
y+=2;section('2. PARTICIPAÇÃO NA ASSOCIAÇÃO');row('Área de interesse',latest.interesse);row('Função/Cargo',latest.cargo);row('Profissão/Ocupação',latest.profissao);row('Disponibilidade',latest.disponibilidade);
y+=2;section('3. ÁREA DE CONTRIBUIÇÃO');row('Áreas selecionadas',latest.contribuicao.join(', '));
y+=2;section('4. MOTIVO DE INTEGRAR NA ASSOCIAÇÃO');row('Motivo',latest.motivo);
y+=5;doc.setFont('helvetica','bold');doc.text('DECLARAÇÃO',16,y);y+=7;doc.setFont('helvetica','normal');doc.setFontSize(9);const dec='Declaro que as informações fornecidas são verdadeiras e comprometo-me a respeitar os estatutos, normas e princípios da associação.';doc.text(doc.splitTextToSize(dec,178),16,y);y+=17;doc.text('Data do cadastro: '+latest.dataCadastro,16,y);y+=16;doc.text('Assinatura do membro: __________________________',16,y);doc.setDrawColor(...red);doc.line(14,285,196,285);doc.setFontSize(8);doc.setTextColor(100);doc.text('Ficha gerada digitalmente a partir dos dados fornecidos pelo membro.',105,291,{align:'center'});doc.save('ficha-cadastro-membro.pdf')});
document.getElementById('adminInfo').addEventListener('click',()=>{const p=document.getElementById('adminMsg');p.hidden=!p.hidden});
