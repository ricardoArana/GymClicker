
const bMenu = document.getElementById("buttonMenu");//donde estan dentro todos los botones que se crean
const clickZone = document.getElementById("mainImg");//la zona donde se clickea
const Score = document.getElementById("score");//el contenedor de la puntuacion
const mainImg = document.getElementById("mainImg");
const imgSentadillas = document.querySelector(".imgSecundaria");
const passives = document.querySelector("#passives");
const imgMoviSexy = document.querySelector("#msexy");
const COSTMULTI=0.25;

let Game ={//donde se guardan los datos del juego
    pFuerza: 0,
    clickPower: 1,
    cost1kg : 20,
    numKg : 0,
    costProtes : 50,
    numProtes : 0,
    protesPower : 0.05,
    numCadenas : 0,
    costCadenas : 200,
    costAnime : 600,
    numAnime : 0,
    animePower : 0.5,
    costSentadillas : 1000,
    numSentadillas : 0,
    critico : 0,
    pasivo : 0,
    msexy : false,
    msexyCounter : 0,
    globalMultibuff: 1
} 
if( localStorage.length != 0){//te carga los datos guardados
    //hay que modificarlo ya que si se anyade algo nuevo estos datos faltarian asi que necesita ser arreglado
    loadData();
}

function loadData(){
    Game = JSON.parse(localStorage.getItem("Game"));
}

/*
* Esta funcion toma dos strings,el numero actual (uno de los valores num de Game),
* un coste inicial, una classe para el buton y una funcion como parametros
* la funcion es la que se ejecutaria en el onclick y decuelce el elemento
* button construido. 
*/
function createButton(upgradeName, description, numero, cost, bClass, onClickFunction){
    let b = document.createElement("button");
    let sp = document.createElement("span");
    let infBox = document.createElement("div");
    let p = document.createElement("p");
    let num = document.createElement("p");
    num.innerText = "Tienes: " + numero;
    num.style.color = "#ce5221";
    infBox.className ="infoBox";
    p.innerText = description;
    infBox.appendChild(p);
    infBox.appendChild(num);
    sp.innerText = cost ? Math.round(cost) : "";
    b.innerText = upgradeName;
    b.appendChild(sp);
    b.onclick = onClickFunction;
    b.className = bClass;
    b.appendChild(infBox);
    return b
}
function createPassive(img, name, description, cost, bClass, estado, onClickFunction){
    let b = document.createElement("button");
    let bImg = document.createElement("img");
    let sp = document.createElement("p");
    let infBox = document.createElement("div");
    let p = document.createElement("p");
    infBox.className ="infoBoxPassive";
    p.innerText = name + '\n' + description;
    if(estado){
        sp.innerText = "Comprado"
        sp.style.color = "Green";
    }else{
        sp.innerText = cost ? "cost: " + Math.round(cost) : "";
        sp.style.color = "#ce5221";
    }
    infBox.appendChild(p);
    infBox.appendChild(sp);
    b.className = bClass;
    bImg.src = img;
    b.appendChild(infBox);
    b.appendChild(bImg);
    b.onclick = onClickFunction;

    return b;
}

function conversionNumGrandes(num){
    let mil = num/1000;
    let million = mil/1000;
    let billion = million/1000000;
    let res = num;
    if(mil >= 1){
        res = mil.toFixed(1) + "mil";
    }
    if(million >= 1){
        res = million.toFixed(1) + "M";
    }
    if(billion >= 1){
        res = billion.toFixed(1) + "B";
    }
    return res;
}
function setScore(){//funcion que te actualiza los pFuerza
    Score.innerText= `Puntos de Fuerza: ${conversionNumGrandes(Game.pFuerza.toFixed(1))} (${(conversionNumGrandes(Game.pasivo*10).toFixed(1))}pF/s) `;
}

//cambia el color del coste
function insuficientePuntos(button, pagoEfectuado){
    pagoEfectuado ? button.childNodes[3].style.color = "green" : button.childNodes[3].style.color = "red";
    //anyadir animacion al pulsar alomejor
    setTimeout(() => {
        button.childNodes[3].style.color = "black";
    }, 1000);
}

function calcuClick(crit){
    res = Game.clickPower * Game.globalMultibuff;
    if(crit){
        res *= 100;
    }
    return res;
}

function popUpOnClick(event, crit) {
    let p = document.createElement('p');
    if(crit){
        p.innerHTML = "+" + (calcuClick(true)).toFixed(1);
        p.className = "popUpOnClickCrit";
    }else{
        p.innerHTML = "+" + (calcuClick(false)).toFixed(1);
        p.className = "popUpOnClick";
    }
    p.style.position = 'absolute';
    p.style.left     = event.clientX + 'px';
    p.style.top      = (event.clientY-40) + 'px';
    
    document.body.appendChild(p);
    setTimeout(()=>document.body.removeChild(p),1000);
  }

/*
esto seria un ejemplo de un boton basico que sube la fuerza 
asigana el valor del coste en el objeto Game
La variable CONSTMULTI sirve para incrementar el precio de la mejora
(Tener en cuenta que se ha cambiado para que ne le nombre haya que poner 
\ncost: para que se muestre el coste ya que asi tiene mas flexibilidad 
a la hora de que boton crear)
*/
buttonDeUnKg = createButton("Aumentar 1kg \ncost: ","Añade 1Kg de peso a tus ejercicios (+0.1 al pulsar)", 
                            Game.numKg, Game.cost1kg, "upgradeButtons", function(){
    let comp = Game.pFuerza>=Game.cost1kg;
    if(comp){//si tienes su coste te deja comprarlo
    Game.clickPower +=0.1;
    Game.pFuerza -=Game.cost1kg;
    Game.cost1kg += Game.cost1kg*COSTMULTI;
    Game.numKg++;
    buttonDeUnKg.childNodes[3].innerText = (Game.cost1kg).toFixed(0);
    buttonDeUnKg.childNodes[4].childNodes[1].innerText = "Tienes: " + Game.numKg;
}
    insuficientePuntos(buttonDeUnKg,comp);
});
buttonDeProtes = createButton("Batido de proteínas \ncost: ","Gracias a sus proteinas ahora ganas fuerza pasivamente (+0.5 PF/s)",
    Game.numProtes, Game.costProtes, "upgradeButtons", function(){
    let comp = Game.pFuerza>=Game.costProtes;
    if(comp){//si tienes su coste te deja comprarlo
        Game.numProtes++;
        Game.pFuerza -=Game.costProtes;
        Game.costProtes += Game.costProtes*COSTMULTI;
        buttonDeProtes.childNodes[3].innerText = (Game.costProtes).toFixed(0);
        buttonDeProtes.childNodes[4].childNodes[1].innerText = "Tienes: " + Game.numProtes;
    }
        insuficientePuntos(buttonDeProtes,comp);
});
buttonGuardar = createButton("Guardar","", "","", "dataButtons", function(){
    localStorage.setItem("Game", JSON.stringify(Game));
});
buttonReset = createButton("Reset","", "","", "dataButtons", function(){
    let conf = confirm("Estas seguro de que quieres resetear tu datos una vez borrados no se podran recuperar!!");
    if(conf){
        localStorage.clear();
        location.reload();
    }
})
buttonDeCadenas = createButton("Cadenas \ncost: ","Ahora levantas cadenas de hierro (+1.2 al pulsar)",
                                Game.numCadenas, Game.costCadenas, "upgradeButtons", function()
{
    let comp = Game.pFuerza>=Game.costCadenas;
    if(comp){//si tienes su coste te deja comprarlo
    Game.clickPower +=1.2;
    Game.pFuerza -=Game.costCadenas;
    Game.costCadenas += Game.costCadenas*COSTMULTI;
    Game.numCadenas++;
    buttonDeCadenas.childNodes[3].innerText = (Game.costCadenas).toFixed(0);
    buttonDeCadenas.childNodes[4].childNodes[1].innerText = "Tienes: " + Game.numCadenas;
    }
    insuficientePuntos(buttonDeCadenas,comp);
});
buttonDeMotivacionAnime = createButton("Leer Anime \ncost: ",
"Te motivas leyendo anime y ahora puedes hacer ejercicio mientras duermes (+5 PF/s)",
    Game.numAnime, Game.costAnime, "upgradeButtons", function(){
    let comp = Game.pFuerza>=Game.costAnime;
    if(comp){//si tienes su coste te deja comprarlo
        Game.numAnime++;
        Game.pFuerza -=Game.costAnime;
        Game.costAnime += Game.costAnime*COSTMULTI;
        buttonDeMotivacionAnime.childNodes[3].innerText = (Game.costAnime).toFixed(0);
        buttonDeMotivacionAnime.childNodes[4].childNodes[1].innerText = "Tienes: " + Game.numAnime;
    }
        insuficientePuntos(buttonDeMotivacionAnime,comp);
});

buttonDeSentadillas = createButton("Sentadillas \ncost: ",
                                    "Te clonas para hacer más ejercicos y ganar posibilidad de crítico (+0.1%). 500 mejoras máx",
    Game.numSentadillas, Game.costSentadillas, "upgradeButtons", function(){
    let comp = Game.pFuerza>=Game.costSentadillas;
    if(comp && Game.numSentadillas < 500){//si tienes su coste te deja comprarlo
        Game.numSentadillas ++;
        Game.critico += 0.1;
        Game.pFuerza -=Game.costSentadillas;
        Game.costSentadillas += (Game.costSentadillas*COSTMULTI)*2;
        buttonDeSentadillas.childNodes[3].innerText = (Game.costSentadillas).toFixed(0);
        buttonDeSentadillas.childNodes[4].childNodes[1].innerText = "Tienes: " + Game.numSentadillas;
        //1% de critico se llama en clickzone.onclick
    }
        
        insuficientePuntos(buttonDeSentadillas,comp);
});


//zona donde se agrega todos los botones
//IMPORTANTE el orden en que se agregan es en que aparecen!
bMenu.appendChild(buttonGuardar);
bMenu.appendChild(buttonReset);
bMenu.appendChild(buttonDeUnKg);
bMenu.appendChild(buttonDeProtes);
bMenu.appendChild(buttonDeCadenas);
bMenu.appendChild(buttonDeMotivacionAnime);
bMenu.appendChild(buttonDeSentadillas);

passiveSexy = createPassive("img/movimientoSexy1.png", "Movimiento Sexy", "El glorioso movimiento sexy hace que cada 1000 clicks actives tu poder sexy(x5 a tus clicks durante 30s)",
                            20000, "passiveButtons",Game.msexy , ()=>{
    let comp = Game.pFuerza>=20000 && !Game.msexy;
    if(comp){
        Game.msexy= true;
        Game.pFuerza -= 20000;
        console.log(passiveSexy.childNodes[0])
        passiveSexy.childNodes[0].childNodes[1].innerText = "Comprado";
        passiveSexy.childNodes[0].childNodes[1].style.color = "Green";
    }
})

passives.appendChild(passiveSexy);

clickZone.onclick  = (e) =>{

    setScore();
    let img = mainImg.src.split("/");
    let imgS = imgSentadillas.src.split("/");
    img[img.length-1] == "presbanca1.png" ? mainImg.src = "img/presbanca2.png" :  mainImg.src = "img/presbanca1.png";
    imgS[imgS.length-1] == "sentadillas1.png" ? imgSentadillas.src = "img/sentadillas2.png" :  imgSentadillas.src = "img/sentadillas1.png";
    //Critico:  
    if (((Math.random() * 100 + Game.critico).toFixed(0)) >= 100 && Game.critico > 0){
        Game.pFuerza += calcuClick(true);
        popUpOnClick(e, true);
    }
    else{
        Game.pFuerza += calcuClick(false);
        popUpOnClick(e, false);
    }
    //msexy
    if (Game.msexy) {
        Game.msexyCounter++;
        if(Game.msexyCounter >= 1000){
            Game.msexyCounter = 0;
            imgMoviSexy.style.display = "block";
            Game.globalMultibuff = 5;
            animationMSexy = setInterval(()=>{
                let imgM = imgMoviSexy.src.split("/");
                imgM[imgM.length-1]  == "movimientoSexy1.png" ? imgMoviSexy.src = "img/movimientoSexy2.png" :  imgMoviSexy.src = "img/movimientoSexy1.png";
            },100)
            
            setTimeout(() => {
                Game.msexyCounter = 0;
                imgMoviSexy.style.display = "none";
                Game.globalMultibuff = 1;
                clearInterval(animationMSexy);
            }, 30000);
        }
    }
    }
 

setInterval(() => {//bucle que se llama cada 0.5s. Calcula ganancias pasivas para poder mostrarlas al usuario. Usamos la variable pasivo 
    Game.pasivo = (Game.protesPower*Game.numProtes + Game.animePower*Game.numAnime);
    Game.pFuerza += Game.pasivo;
    setScore();
},100);

setInterval(()=>{//animaciones
    if(Game.numProtes > 0){
        let img = mainImg.src.split("/");
        img[img.length-1] == "presbanca1.png" ? mainImg.src = "img/presbanca2.png" :  mainImg.src = "img/presbanca1.png";  
    }
    if(Game.numSentadillas > 0){
        let img = imgSentadillas.src.split("/");
        img[img.length-1] == "sentadillas1.png" ? imgSentadillas.src = "img/sentadillas2.png" :  imgSentadillas.src = "img/sentadillas1.png";  
        imgSentadillas.style.display="block";
    }
},2000)

//recordatorio si algunos datos no te cargan bien prueba a hacer reset o localStorage.clear()
console.log("recordatorio si algunos datos no te cargan bien prueba a hacer reset o localStorage.clear()");