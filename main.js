



//CONTADOR
var time = new Date();
var deltaTime = 0;

// SELECT-values
var idslide1A = document.getElementById("slide1A");
var idslide1B = document.getElementById("slide1B");
var idslide1C = document.getElementById("slide1C");
var idslide1D = document.getElementById("slide1D");
var idslide2A = document.getElementById("slide2A");
var idslide2B = document.getElementById("slide2B");
var idslide2C = document.getElementById("slide2C");
var idslide2D = document.getElementById("slide2D");
var idslide3A = document.getElementById("slide3A");
var idslide3B = document.getElementById("slide3B");
let textInput= document.getElementById("texto");
let word = document.getElementById('word-selected');







if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    wordSelected= document.querySelector(".word-selected");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
    
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    }else if(score == 10) {
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if(score == 20) {
        gameVel = 3;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    
    // wordSelected.style.display = "none";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


// TEXTO POR VOZ
document.getElementById('hablar').addEventListener("click",()=>{
    decir(document.getElementById("texto").value);
});

function decir(texto){
    speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
}

let slideIndex = 1;
showSlides(slideIndex)

function plusSlides(n){
    showSlides(slideIndex += n)
}
function currentSlide(n){
    showSlides(slideIndex = n)
}
function showSlides(n){
    let i;
    let slides = document.querySelectorAll(".mySlides");
    let quadrates = document.querySelectorAll(".quadrate"); 
    if(n > slides.length) slideIndex = 1
    if(n < 1) slideIndex = slides.length
    for(i = 0; i < slides.length; i++){
        slides[i].style.display = "none"
    }
    for(i = 0; i < quadrates.length;i++){
        quadrates[i].className = quadrates[i].className.replace("active","")
    }
    slides[slideIndex-1].style.display = "block";
    quadrates[slideIndex-1].className += " active";
}



// silabas

var silabaJS = {
    getSilabas: getSilabas
  };
  
  // Declaración de Variables
  var silaba = {
    palabra: undefined,         // (String) Palabra ingresada
    longitudPalabra: undefined, // (int)    Longitud de la palabra
    numeroSilaba: undefined,    // (int)    Número de silabas de la palabra
    silabas: undefined,         // (Array)  Array de objeto que contiene la silaba (caracter) y la posicion en la palabra
    tonica: undefined,          // (int)    Posición de la silaba tónica (empieza en 1)
    letraTildada: undefined,    // (int)    Posición de la letra tildada (si la hay)
    acentuacion: undefined,     // (int)    Tipo acentuacion de la palabra (Aguda, Grave, Esdrujula y Sobresdrujula)
    hiato: undefined,           // (Array)  Array de objeto que contiene hiato (si la hay)
    diptongo: undefined,        // (Array)  Array de objeto que contiene diptongo (si la hay)
    triptongo: undefined        // (Array)  Array de objeto que contiene triptongo (si la hay)
  };
  
  var encontroTonica = undefined; // (bool)   Indica si se ha encontrado la silaba tónica
  
  
  /**
   * Devuelve Objeto 'silaba' con los valores calculados
   *
   * @param {string} palabra
   * @returns {Object}
   */
   function getSilabas(palabra) {
    posicionSilabas(palabra);
    acentuacion();
    hiato();
    diptongoTriptongo();
    return JSON.parse(JSON.stringify(silaba));
  }
  
  
  /*********************************************************/
  /*********************************************************/
  //                  METODOS INTERNOS                     //
  /*********************************************************/
  /*********************************************************/
  
  /**
   * Realiza calculo de las sílabas
   *
   * @param {string} palabra
   * @returns {undefined}
   */
  function posicionSilabas(palabra) {
  
    silaba.palabra = palabra.toLowerCase().trim();
    silaba.silabas = [];
  
    silaba.longitudPalabra = silaba.palabra.length;
    encontroTonica = false;
    silaba.tonica = 0;
    silaba.numeroSilaba = 0;
    silaba.letraTildada = -1;
  
    // Variable que almacena silaba y la pocision de la silaba
    var silabaAux;
  
    // Se recorre la palabra buscando las sílabas
    for (var actPos = 0; actPos < silaba.longitudPalabra;) {
  
      silaba.numeroSilaba++;
      silabaAux = {};
      silabaAux.inicioPosicion = actPos;
  
      // Las sílabas constan de tres partes: ataque, núcleo y coda
      actPos = ataque(silaba.palabra, actPos);
      actPos = nucleo(silaba.palabra, actPos);
      actPos = coda(silaba.palabra, actPos);
  
      // Obtiene y silaba de la palabra
      silabaAux.silaba = silaba.palabra.substring(silabaAux.inicioPosicion, actPos);
  
      // Guarda silaba de la palabra
      silaba.silabas.push(silabaAux);
  
      if ((encontroTonica) && (silaba.tonica == 0))
        silaba.tonica = silaba.numeroSilaba; // Marca la silaba tónica
  
    }
  
    // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
    // las reglas de acentuación
    if (!encontroTonica) {
  
      if (silaba.numeroSilaba < 2) {
  
        silaba.tonica = silaba.numeroSilaba;  // Monosílabos
  
      } else {                                  // Polisílabos
  
        var letraFinal = silaba.palabra[silaba.longitudPalabra - 1];
        var letraAnterior = silaba.palabra[silaba.longitudPalabra - 2];
  
        if ((!esConsonante(letraFinal) || (letraFinal == 'y')) ||
          (((letraFinal == 'n') || (letraFinal == 's') && !esConsonante(letraAnterior)))) {
  
          silaba.tonica = silaba.numeroSilaba - 1;	// Palabra llana
  
        } else {
          silaba.tonica = silaba.numeroSilaba;		// Palabra aguda
        }
  
      }
    }
  
  }
  
  /**
   * Determina el ataque de la silaba de pal que empieza en pos y avanza
   * pos hasta la posición siguiente al final de dicho ataque
   *
   * @param {string} pal
   * @param {int} pos
   * @returns {int}
   */
  function ataque(pal, pos) {
  
    // Se considera que todas las consonantes iniciales forman parte del ataque
    var ultimaConsonante = 'a';
  
    while ((pos < silaba.longitudPalabra) && ((esConsonante(pal [pos])) && (pal [pos] != 'y'))) {
      ultimaConsonante = pal [pos];
      pos++;
    }
  
    // (q | g) + u (ejemplo: queso, gueto)
    if (pos < silaba.longitudPalabra - 1)
      if (pal [pos] == 'u') {
        if (ultimaConsonante == 'q')
          pos++;
        else if (ultimaConsonante == 'g') {
          var letra = pal [pos + 1];
          if ((letra == 'e') || (letra == 'é') || (letra == 'i') || (letra == 'í'))
            pos++;
        }
      }
    else { // La u con diéresis se añade a la consonante
      if ((pal[pos] === 'ü') || (pal[pos] == 'Ü'))
        if (ultimaConsonante == 'g')
          pos++;
    }
  
    return pos;
  }
  
  /**
   * Determina el núcleo de la silaba de pal cuyo ataque termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicho núcleo
   *
   * @param {string} pal
   * @param {int} pos
   * @returns {int}
   */
  function nucleo(pal, pos) {
  
    // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
    var anterior = 0;
    var c;
  
    // 0 = fuerte
    // 1 = débil acentuada
    // 2 = débil
  
    if (pos >= silaba.longitudPalabra)
      return pos; // ¡¿No tiene núcleo?!
  
    // Se salta una 'y' al principio del núcleo, considerándola consonante
    if (pal[pos] == 'y')
      pos++;
  
    // Primera vocal
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      switch (c) {
          // Vocal fuerte o débil acentuada
        case 'á':
        case 'Á':
        case 'à':
        case 'À':
        case 'é':
        case 'É':
        case 'è':
        case 'È':
        case 'ó':
        case 'Ó':
        case 'ò':
        case 'Ò':
          silaba.letraTildada = pos;
          encontroTonica = true;
          anterior = 0;
          pos++;
          break;
          // Vocal fuerte
        case 'a':
        case 'A':
        case 'e':
        case 'E':
        case 'o':
        case 'O':
          anterior = 0;
          pos++;
          break;
          // Vocal débil acentuada, rompe cualquier posible diptongo
        case 'í':
        case 'Í':
        case 'ì':
        case 'Ì':
        case 'ú':
        case 'Ú':
        case 'ù':
        case 'Ù':
        case 'ü':
        case 'Ü':
          silaba.letraTildada = pos;
          anterior = 1;
          pos++;
          encontroTonica = true;
          return pos;
          break;
          // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
          anterior = 2;
          pos++;
          break;
      }
    }
  
    // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
    var hache = false;
    if (pos < silaba.longitudPalabra) {
      if (pal[pos] == 'h') {
        pos++;
        hache = true;
      }
    }
  
    // Segunda vocal
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      switch (c) {
          // Vocal fuerte o débil acentuada
        case 'á':
        case 'Á':
        case 'à':
        case 'À':
        case 'é':
        case 'É':
        case 'è':
        case 'È':
        case 'ó':
        case 'Ó':
        case 'ò':
        case 'Ò':
  
          silaba.letraTildada = pos;
          if (anterior != 0) {
            encontroTonica = true;
          }
          if (anterior == 0) {    // Dos vocales fuertes no forman silaba
            if (hache)
              pos--;
            return pos;
          }
          else {
            pos++;
          }
  
          break;
          // Vocal fuerte
        case 'a':
        case 'A':
        case 'e':
        case 'E':
        case 'o':
        case 'O':
  
          if (anterior == 0) {    // Dos vocales fuertes no forman silaba
            if (hache)
              pos--;
            return pos;
          }
          else {
            pos++;
          }
  
          break;
  
          // Vocal débil acentuada, no puede haber triptongo, pero si diptongo
        case 'í':
        case 'Í':
        case 'ì':
        case 'Ì':
        case 'ú':
        case 'Ú':
        case 'ù':
        case 'Ù':
  
          silaba.letraTildada = pos;
  
          if (anterior != 0) {  // Se forma diptongo
            encontroTonica = true;
            pos++;
          }
          else if (hache)
            pos--;
  
          return pos;
  
          break;
          // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
        case 'ü':
        case 'Ü':
          if (pos < silaba.longitudPalabra - 1) { // ¿Hay tercera vocal?
            var siguiente = pal [pos + 1];
            if (!esConsonante(siguiente)) {
              var letraAnterior = pal[pos - 1];
              if (letraAnterior == 'h')
                pos--;
              return pos;
            }
          }
  
          // dos vocales débiles iguales no forman diptongo
          if (pal [pos] != pal [pos - 1])
            pos++;
  
          // Es un diptongo plano o descendente
          return pos;
      }
    }
  
    // ¿tercera vocal?
    if (pos < silaba.longitudPalabra) {
      c = pal[pos];
      if ((c == 'i') || (c == 'u')) { // Vocal débil
        pos++;
        return pos;  // Es un triptongo
      }
    }
  
    return pos;
  }
  
  /**
   * Determina la coda de la silaba de pal cuyo núcleo termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicha coda
   *
   * @param {string} pal
   * @param {int} pos
   * @returns {int}
   */
  function coda(pal, pos) {
    if ((pos >= silaba.longitudPalabra) || (!esConsonante(pal[pos])))
      return pos; // No hay coda
    else {
      if (pos == silaba.longitudPalabra - 1) // Final de palabra
      {
        pos++;
        return pos;
      }
  
      // Si sólo hay una consonante entre vocales, pertenece a la siguiente silaba
      if (!esConsonante(pal [pos + 1])) return pos;
  
      var c1 = pal[pos];
      var c2 = pal[pos + 1];
  
      // ¿Existe posibilidad de una tercera consonante consecutina?
      if ((pos < silaba.longitudPalabra - 2)) {
        var c3 = pal [pos + 2];
  
        if (!esConsonante(c3)) { // No hay tercera consonante
          // Los grupos ll, lh, ph, ch y rr comienzan silaba
  
          if ((c1 == 'l') && (c2 == 'l'))
            return pos;
          if ((c1 == 'c') && (c2 == 'h'))
            return pos;
          if ((c1 == 'r') && (c2 == 'r'))
            return pos;
  
          ///////// grupos nh, sh, rh, hl son ajenos al español(DPD)
          if ((c1 != 's') && (c1 != 'r') &&
            (c2 == 'h'))
            return pos;
  
          // Si la y está precedida por s, l, r, n o c (consonantes alveolares),
          // una nueva silaba empieza en la consonante previa, si no, empieza en la y
          if ((c2 == 'y')) {
            if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
              return pos;
  
            pos++;
            return pos;
          }
  
          // gkbvpft + l
          if ((((c1 == 'b') || (c1 == 'v') || (c1 == 'c') || (c1 == 'k') ||
            (c1 == 'f') || (c1 == 'g') || (c1 == 'p') || (c1 == 't')) &&
            (c2 == 'l')
          )
          ) {
            return pos;
          }
  
          // gkdtbvpf + r
  
          if ((((c1 == 'b') || (c1 == 'v') || (c1 == 'c') || (c1 == 'd') || (c1 == 'k') ||
            (c1 == 'f') || (c1 == 'g') || (c1 == 'p') || (c1 == 't')) &&
            (c2 == 'r')
          )
          ) {
            return pos;
          }
  
          pos++;
          return pos;
        }
        else { // Hay tercera consonante
          if ((pos + 3) == silaba.longitudPalabra) { // Tres consonantes al final ¿palabras extranjeras?
            if ((c2 == 'y')) { // 'y' funciona como vocal
              if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
                return pos;
            }
  
            if (c3 == 'y') { // 'y' final funciona como vocal con c2
              pos++;
            }
            else {	// Tres consonantes al final ¿palabras extranjeras?
              pos += 3;
            }
            return pos;
          }
  
          if ((c2 == 'y')) { // 'y' funciona como vocal
            if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
              return pos;
  
            pos++;
            return pos;
          }
  
          // Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan silaba (Bezos)
  
          if ((c2 == 'p') && (c3 == 't') ||
            (c2 == 'c') && (c3 == 't') ||
            (c2 == 'c') && (c3 == 'n') ||
            (c2 == 'p') && (c3 == 's') ||
            (c2 == 'm') && (c3 == 'n') ||
            (c2 == 'g') && (c3 == 'n') ||
            (c2 == 'f') && (c3 == 't') ||
            (c2 == 'p') && (c3 == 'n') ||
            (c2 == 'c') && (c3 == 'z') ||
            (c2 == 't') && (c3 == 's') ||
            (c2 == 't') && (c3 == 's')) {
            pos++;
            return pos;
          }
  
          if ((c3 == 'l') || (c3 == 'r') ||    // Los grupos consonánticos formados por una consonante
            // seguida de 'l' o 'r' no pueden separarse y siempre inician
            // sílaba
            ((c2 == 'c') && (c3 == 'h')) ||  // 'ch'
            (c3 == 'y')) {                   // 'y' funciona como vocal
            pos++;  // Siguiente sílaba empieza en c2
          }
          else
            pos += 2; // c3 inicia la siguiente sílaba
        }
      }
      else {
        if ((c2 == 'y')) return pos;
  
        pos += 2; // La palabra acaba con dos consonantes
      }
    }
    return pos;
  }
  
  /**
   * Determina si se forma hiato/s
   *
   * @returns {undefined}
   */
  function hiato() {
  
    var vocalFuerteAnterior = false; // Almacena el tipo de vocal (Fuerte o Debil)
    silaba.hiato = [];
  
    // La 'u' de "qu" no forma hiato
    if ((silaba.letraTildada > 1) && (silaba.palabra[silaba.letraTildada - 1] == 'u') && (silaba.palabra[silaba.letraTildada - 2] == 'q')) {
      silaba.hiato.push({
        tipoHiato: 'Hiato simple',
        silabaHiato: silaba.palabra[silaba.letraTildada] + '-' + silaba.palabra[silaba.letraTildada + 1]
      });
    }
  
    for (var i = 0; i < silaba.palabra.length; i++) {
  
      // Hiato Acentual
      if ('íìúù'.indexOf(silaba.palabra[i]) > -1) {
  
        if (((i > 0) && vocalFuerte(silaba.palabra[i - 1]))) {
          silaba.hiato.push({
            tipoHiato: 'Hiato acentual',
            silabaHiato: silaba.palabra[i - 1] + '-' + silaba.palabra[i]
          });
          vocalFuerteAnterior = false;
          continue;
        }
  
        if (((i < (silaba.longitudPalabra - 1)) && vocalFuerte(silaba.palabra[i + 1]))) {
          silaba.hiato.push({
            tipoHiato: 'Hiato acentual',
            silabaHiato: silaba.palabra[i] + '-' + silaba.palabra[i + 1]
          });
          vocalFuerteAnterior = false;
          continue;
        }
  
      }
  
      // Hiato Simple
      if (vocalFuerteAnterior && vocalFuerte(silaba.palabra[i])) {
        silaba.hiato.push({
          tipoHiato: 'Hiato simple',
          silabaHiato: silaba.palabra[i - 1] + '-' + silaba.palabra[i]
        });
      }
  
      // Hiato Simple con 'h' intermedio
      if (vocalFuerteAnterior && silaba.palabra[i] === 'h' && vocalFuerte(silaba.palabra[i + 1])) {
        silaba.hiato.push({
          tipoHiato: 'Hiato simple',
          silabaHiato: silaba.palabra[i - 1] + '-h' + silaba.palabra[i + 1]
        });
      }
  
      vocalFuerteAnterior = vocalFuerte(silaba.palabra[i]);
  
    }
  
  }
  
  /**
   * Determina si se forma triptongo/s y diptongo/s
   *
   * @returns {undefined}
   */
  function diptongoTriptongo() {
  
    silaba.diptongo = [];
    silaba.triptongo = [];
  
    // Vocal Debil = VD
    // Vocal Fuerte = VF
  
    var expresion;
  
    for (var i = 0; i < silaba.silabas.length; i++) {
  
      // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
      expresion = /((i|u)(a|e|o)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.triptongo.push({
          tipo: 'Triptongo',
          silaba: silaba.silabas[i].silaba.match(expresion)[0]
        });
        continue;
      }
  
      // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
      expresion = /((i|u)(a|e|o))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: 'Diptongo Creciente',
          silaba: silaba.silabas[i].silaba.match(expresion)[0]
        });
        continue;
      }
  
      // Diptongo Drececiente (VF - VD) : ((a|e|o)(i|u))
      expresion = /((a|e|o)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: 'Diptongo Drececiente',
          silaba: silaba.silabas[i].silaba.match(expresion)[0]
        });
        continue;
      }
  
      // Diptongo Homogeneo (VD - VD) : ((a|e|o)(i|u))
      expresion = /((a|e|o)(i|u))/g;
      if (silaba.silabas[i].silaba.match(expresion)) {
        silaba.diptongo.push({
          tipo: 'Diptongo Homogéneos',
          silaba: silaba.silabas[i].silaba.match(expresion)[0]
        });
      }
  
  
    }
  }
  
  /**
   * Determina el tipo de acentuacion de la palabra
   *
   * @returns {undefined}
   */
  function acentuacion() {
  
    switch (silaba.numeroSilaba - silaba.tonica) {
      case 0:
        silaba.acentuacion = 'Aguda';
        break;
      case 1:
        silaba.acentuacion = 'Grave (Llana)';
        break;
      case 2:
        silaba.acentuacion = 'Esdrújula';
        break;
      default:
        silaba.acentuacion = 'Sobresdrújula';
        break;
    }
  
  }
  
  /**
   * Determina si c es una vocal fuerte o débil acentuada
   *
   * @param {string} c
   * @returns {boolean}
   */
  function vocalFuerte(c) {
  
    switch (c) {
      case 'a':
      case 'á':
      case 'A':
      case 'Á':
      case 'à':
      case 'À':
      case 'e':
      case 'é':
      case 'E':
      case 'É':
      case 'è':
      case 'È':
      case 'í':
      case 'Í':
      case 'ì':
      case 'Ì':
      case 'o':
      case 'ó':
      case 'O':
      case 'Ó':
      case 'ò':
      case 'Ò':
      case 'ú':
      case 'Ú':
      case 'ù':
      case 'Ù':
        return true;
    }
    return false;
  
  }
  
  /**
   * Determina si c no es una vocal
   *
   * @param {string} c
   * @returns {boolean}
   */
  function esConsonante(c) {
  
    if (!vocalFuerte(c)) {
      switch (c) {
          // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
        case 'ü':
        case 'Ü':
          return false;
      }
  
      return true;
    }
  
    return false;
  }


const spellWord=(word)=>{
    let silabas = getSilabas(word);
    return silabas
}

window.addEventListener("load", ()=>{
   
   
    const selectSlidesValues=[ idslide1A,idslide1B,idslide1C, idslide1D,idslide2A,idslide2B,idslide2C,idslide2D,idslide3A,idslide3B];

    
    for (var i = 0; i < selectSlidesValues.length-1; i++) {
        selectText(selectSlidesValues[i]);
      
    }
});


const selectText=(element)=>{
    element.addEventListener('change',()=>{
        var selectedOption = element.options[element.selectedIndex].text;
        textInput.value = selectedOption;
        
           
       
        if(textInput.value !== undefined){
                let spell = spellWord(textInput.value);
                restart()
                word.innerHTML=""

                for (var i = 0; i < spell.silabas.length; i++) {
                   
                    const silabasSelected=spell.silabas[i].silaba
                    word.innerHTML+=silabasSelected+"-"
                    
                }
        }
        
    });
}

const restart= ()=>{
    document.getElementById('restart').addEventListener('click',()=>{
        console.log('ddd');
        window.location.reload()
    })
}