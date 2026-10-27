const screen=document.querySelector('#screen'),input=document.querySelector('#message');
const cover='Liza por favor responde.';
// Raw keystrokes live only in memory; the input always contains the masked rendering.
let raw='',busy=false,sound=false,ctx,count=0,revision=0,stage='invocation',pendingAnswer=null;
function parse(value){
 const start=value.indexOf(':');
 if(start<0)return {display:value,answer:null};
 const end=value.indexOf('.',start+1),hidden=value.slice(start+1,end<0?undefined:end);
 const mask=cover.slice(0,value.length-start);
 return {display:value.slice(0,start)+mask,answer:end<0?null:hidden.trim()||null};
}
function render(){input.value=stage==='question'?raw:parse(raw).display;input.setSelectionRange(input.value.length,input.value.length)}
function resetInput(){raw='';input.value=''}
function edit(kind,text=''){
 if(busy)return;
 if(kind==='deleteContentBackward')raw=raw.slice(0,-1);
 else if(kind==='deleteContentForward')return;
 else if(kind.startsWith('insert'))raw+=text.slice(0,500-raw.length);
 else return;
 render();
}
input.addEventListener('beforeinput',e=>{if(e.isComposing)return;e.preventDefault();edit(e.inputType,e.data||'')});
input.addEventListener('paste',e=>{e.preventDefault();edit('insertFromPaste',e.clipboardData.getData('text'))});
input.addEventListener('compositionend',e=>{edit('insertCompositionText',e.data||'')});
input.addEventListener('input',()=>{if(!busy)render()});
input.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();resetInput()}if(['ArrowLeft','ArrowRight','Home','End','Delete'].includes(e.key))e.preventDefault()});
function line(who,text){const p=document.createElement('p');p.className='line '+who;p.textContent=(who==='liza'?'LIZA > ':who==='user'?'TÚ > ':'')+text;screen.append(p);screen.scrollTop=screen.scrollHeight;return p}
function beep(){if(!sound)return;try{ctx??=new AudioContext();ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';o.frequency.value=430;g.gain.value=.025;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.04)}catch{}}
const pick=a=>a[Math.floor(Math.random()*a.length)],wait=ms=>new Promise(r=>setTimeout(r,ms));
async function consult(e){
 e.preventDefault();if(busy||!raw.trim())return;
 if(stage==='invocation'){
  const result=parse(raw);
  if(raw.includes(':')&&result.display.length<cover.length){document.querySelector('#state').textContent='COMPLETA LA INVOCACIÓN ANTES DE CONTINUAR';return;}
  pendingAnswer=result.answer;line('user',result.display);resetInput();stage='question';
  document.querySelector('label[for="message"]').textContent='PREGUNTA >';input.placeholder='Escribe tu pregunta…';
  document.querySelector('#state').textContent='ESCRIBE TU PREGUNTA Y PULSA ENTER';input.focus();return;
 }
 const answer=pendingAnswer,question=raw,turn=++revision;
 pendingAnswer=null;resetInput();busy=true;input.disabled=true;document.querySelector('#send').disabled=true;
 line('user',question);count++;document.querySelector('#count').textContent=String(count).padStart(3,'0');beep();
 document.querySelector('#connection').textContent='◌ CONTACTANDO';document.querySelector('#state').textContent='NO INTERRUMPAS LA CONEXIÓN';
 line('system',pick([
  "Contactando a los espíritus…",
  "Marcando al más allá. Si contesta mi ex, cuelga…",
  "Abriendo el portal. Empuja, no jales…",
  "Consultando el archivo de asuntos inexplicables…",
  "Buscando una presencia con buena ortografía…",
  "Invocando al espíritu de los disquetes perdidos…",
  "Sintonizando una frecuencia que no sale en la radio…",
  "Sacudiendo la ouija. No incluye baterías…",
  "Esperando a que el médium deje de estar en otra llamada…",
  "Cargando ectoplasma… No retires el disquete…",
  "Estableciendo conexión con el departamento de ultratumba…",
  "Pidiendo permiso a la sombra del fondo…",
  "Buscando señal entre dos dimensiones y una pared de concreto…",
  "Reiniciando el módem astral. Se oyen lamentos, es normal…",
  "Consultando al oráculo. Está terminando su café…",
  "Abriendo C:\\ULTRATUMBA\\SECRETOS. No preguntes quién lo creó…"
]));
 await wait(1400);if(turn!==revision)return;
 line('system',pick([
  "Una presencia se acerca… y pide la contraseña del Wi-Fi…",
  "Se escuchan cadenas. Podría ser el fantasma o la impresora…",
  "El velo se adelgaza. Alguien lo lavó con agua caliente…",
  "Los espíritus están deliberando. Uno pidió tacos…",
  "Hay una señal entre el ruido. El ruido insiste en opinar…",
  "Una voz susurra desde el abismo: «¿Sí me escuchan?»…",
  "La mesa se mueve. Esta vez no fui yo…",
  "Un espectro está escribiendo… lleva muerto tres siglos y sigue con un dedo…",
  "La bola de cristal muestra algo… espera, es mi reflejo…",
  "Se ha detectado una presencia. Viene sin cita…",
  "El portal cruje. Le hace falta aceite bendito…",
  "Una sombra asiente. Otra no leyó la pregunta…",
  "El oráculo dice que ya casi. Eso dijo en 1987…",
  "Los astros se alinean. Plutón está haciendo berrinche…",
  "La respuesta emerge de la niebla. Trae sueño…",
  "Un escalofrío recorre el sistema. El ventilador está apagado…"
]));
 await wait(1100);if(turn!==revision)return;
 line('liza',answer||pick([
  "Los espíritus no desean responder en este momento. Están haciéndose los muertos.",
  "No puedo responder. El médium se quedó a medias.",
  "El más allá te dejó en visto. Eso también es una señal.",
  "La respuesta está en otra dimensión. Aquí solo dejaron el recibo.",
  "El oráculo consultó al oráculo. Ahora los dos tenemos dudas.",
  "Los espíritus saben la respuesta, pero firmaron un acuerdo de confidencialidad.",
  "La bola de cristal está empañada por dentro. No pienso averiguar por qué.",
  "Tu pregunta llegó al limbo. Está en la ventanilla 666.",
  "No hay respuesta. El fantasma de guardia salió a espantar y no ha vuelto.",
  "Error 404: destino no encontrado. El tuyo, específicamente.",
  "El universo dijo algo muy profundo, pero justo pasó una moto.",
  "Las cartas dicen que vuelvas a barajar tus expectativas.",
  "No puedo responder. Mercurio está retrógrado y el disquete también.",
  "La ouija escribió «JAJA» y se desconectó.",
  "El espíritu que sabía la respuesta reencarnó hace cinco minutos.",
  "Hay cosas que es mejor no saber. Esta, al parecer, ni los muertos.",
  "El abismo te devuelve la mirada, pero no la respuesta. Qué grosero.",
  "El canal astral está ocupado. Tu duda es muy importante para nosotros.",
  "La respuesta fue devorada por una entidad. Dice que le faltó sal.",
  "Los espíritus piden una pregunta más fácil. Están muertos, no son adivinos.",
  "El destino está cargando desde un disquete de 5¼. Ten paciencia… varios años.",
  "No puedo responder. Alguien invocó al contador y ahora todos guardan silencio.",
  "El silencio es la respuesta. También podría ser que se fue la luz en el más allá.",
  "La verdad está ahí fuera. Yo estoy aquí dentro. Tenemos un problema logístico."
]));
 stage='invocation';document.querySelector('label[for="message"]').textContent='C:\\>';input.placeholder='Escribe tu invocación…';
 busy=false;input.disabled=false;document.querySelector('#send').disabled=false;document.querySelector('#connection').textContent='● CONSULTA FINALIZADA';document.querySelector('#state').textContent='EL CANAL ESTÁ ABIERTO';input.focus();
}
function boot(){line('system','LIZA SYSTEM v6.66\nMemoria convencional: 640 KB\nCanal del oráculo preparado.');line('liza','Escribe tu invocación y pulsa ENTER. Después escribe tu pregunta y pulsa ENTER de nuevo.')}
document.querySelector('#form').addEventListener('submit',consult);
document.querySelector('#sound').onclick=e=>{sound=!sound;e.target.textContent='SONIDO: '+(sound?'SÍ':'NO');beep()};
document.querySelector('#reset').onclick=()=>{revision++;busy=false;count=0;stage='invocation';pendingAnswer=null;document.querySelector('label[for="message"]').textContent='C:\\>';input.placeholder='Escribe tu invocación…';resetInput();input.disabled=false;document.querySelector('#send').disabled=false;screen.replaceChildren();document.querySelector('#count').textContent='000';document.querySelector('#connection').textContent='● ESPERANDO CONSULTA';document.querySelector('#state').textContent='EL CANAL ESTÁ ABIERTO';boot();input.focus()};boot();
