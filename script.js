var start = false;
var cols = 40; //nombre de colonne
var rows = 30;  //nombre de ligne
var matriceInit;
var pourcentage = 0.5; //50% de probabilité qu'une cellule soit en vie (vrai)
var vitesse = 0; //int
var resolution = 18; //agrandit la taille de la cellule à l'affichage
var posCanvasX = 0; //position x du canvas dans la fenêtre (en px)
var posCanvasY = 180; //position y du canvas dans la fenêtre (en px)
var cellLife = 0;
var cellDead = 0;
var lifeOrDead;
var nbrIteration = 0;
var keyPressV = 1;

var modeDayNight = false; //Boolean


function btnLente(){
    vitesse = 200;
}

function btnRapide(){
    vitesse = 0;
}

function btnMoyenne(){
    vitesse = 100;
}

function btnReset(){
    matriceInit = matrinematriceInit = matriceInitial(cols, rows);
    nbrIteration = 0;
}

function speed(miliseconds) { //fonction pour ralentir la boucle lors du déroulement du jeu || prend en paramètre un int
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

function btnStart(){
    start = true;
}

function btnStop(){
    start = false;
}

function mode(valueBtn) {
    document.getElementById('pText').innerHTML = " Mode : " + valueBtn;
    if(valueBtn == "Day & Night"){
        modeDayNight = true;
    }
    else{
        modeDayNight = false;
    }
}


function matriceInitial(cols , rows){ // INITIALISATION DE LA MATRICE || prend le nbr de colonnes et lignes en paramètre || retrourne un array
    let mat = new Array(cols);

    for (let i = 0; i < cols; i++) {
    mat[i] = new Array(rows);
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
        mat[i][j] = Math.random() < pourcentage;
        }
    }

    return mat;

}

function verifVois(v){ //vérifie si le voisin(x) existe ||prend en paramètre un array de la position X et Y du voisin || retourne le voisin si il existe 
    if (v[0] < cols && Math.sign(v[0])!= -1 ){
        if(v[1] < rows && Math.sign(v[1]!= -1)){
            //le voisin existe
            return true;
        }
        else{
            //le voisin n'existe pas
            return false;
        }
    }
}
function voisin(cellX, cellY, matrice){ //trouve les voisins de la cellule et donne le nbr de voisins en vie || prend en paramètre la position X,Y de la cellule et la matrice || retourne un entier

    /*
    [V8][V1][V2]
    [V7][X][V3]
    [V6][V5][V4]
    */
    var arrVoisins = []; //tableau qui va contenir les coordonnées de tous les voisins d'une cellule
    var voisinsEnVie = 0;

    var v1 = [cellX-1, cellY];
    var verifResult = verifVois(v1);
    if(verifResult){ arrVoisins.push(v1);};

    var v2 = [cellX-1, cellY+1];
    var verifResult = verifVois(v2);
    if(verifResult){arrVoisins.push(v2);};

    var v3 = [cellX, cellY+1];
    var verifResult = verifVois(v3);
    if(verifResult){arrVoisins.push(v3);};

    var v4 = [cellX+1, cellY+1];
    var verifResult = verifVois(v4);
    if(verifResult){arrVoisins.push(v4);};
    
    var v5 = [cellX+1, cellY];
    var verifResult = verifVois(v5);
    if(verifResult){arrVoisins.push(v5);};

    var v6 = [cellX+1, cellY-1];
    var verifResult = verifVois(v6);
    if(verifResult){arrVoisins.push(v6);};

    var v7 = [cellX, cellY-1];
    var verifResult = verifVois(v7);
    if(verifResult){arrVoisins.push(v7);};

    var v8 = [cellX-1, cellY-1];
    var verifResult = verifVois(v8);
    if(verifResult){arrVoisins.push(v8);};

    
    for(i=0 ; i < arrVoisins.length; i++){   
        var x = arrVoisins[i][0];
        var y = arrVoisins[i][1];
        var cell = matrice[x][y];
        //console.log("cell : ", cell);
        if(cell == true){
            voisinsEnVie++;
        }
    }
    
    return voisinsEnVie;
}

function calCell(matrice){ //retourne le nomdre de cellule en vie et morte (return array)
    var life = 0;
    var dead = 0;
    //console.log("matrice : ",matrice);
    for(i = 0; i<matrice.length; i++){
        for(j = 0; j<matrice[i].length; j++){
            //console.log(matrice[i][j]);
            if(matrice[i][j] == true){
                life++;
            }
            else if(matrice[i][j] == false){
                dead++;
            }
        }
    }
    return [life, dead];
}

function rulesOfLife(etat,nbrVois){
    
    if(modeDayNight){ //règle mode Day&Night
        if (etat == 0 && (nbrVois == 3 || nbrVois == 6 || nbrVois == 7 || nbrVois == 8) ) {
            return true;
        } 
        else if (etat == 1 && (nbrVois <= 2 ||nbrVois == 5)) {
            return false;
        }
        else {
             return etat;
        }
    }
    else{ //règles classique
        if (etat == 0 && nbrVois == 3) {
            return true;
            
        } 
        else if (etat == 1 && (nbrVois < 2 || nbrVois > 3)) {
             return false;
            
        } 
        else {
             return etat;
        }
    }
    
}

function mouseclick(event){//fonction appelée lors du click de la souris || Change l'etat de la cellule cible
    var posX = Math.trunc((event.clientX - posCanvasX) / resolution); //positionX de la souris au click
    var posY = Math.trunc((event.clientY- posCanvasY) / resolution);  //positionY de la souris au click

    if(event.path[0] == canvas ){ //si on click dans le canvas
      if (matriceInit[posX][posY] == true){
        matriceInit[posX][posY] = false;
      }
      else{
        matriceInit[posX][posY] = true;
      }
    }
  
}

function eventClavier(event){ //fonction appelée lorsque l'on appuie sur une touche du clavier
    switch (event.code){ //event.code contient le nom de la touche pressée
        case "KeyS": //Start
            start = true;
        break;
        case "KeyF": //Stop
            start = false;
        break;
        case "KeyR": //Reset
            matriceInit = matrinematriceInit = matriceInitial(cols, rows);
            nbrIteration = 0;
        break;
        case "KeyV": //Speed || keyPressV = 0 -> Rapide || // = 1 -> Moyenne || // = 2 -> Lente
            switch (keyPressV){
                case 0:
                    vitesse = 0;
                    keyPressV = 1;
                break;
                case 1: 
                    vitesse = 100;
                    keyPressV = 2;
                break;
                case 2: 
                    vitesse = 200;
                    keyPressV = 0;
                break;
            }
        break;
    }
}

///////////////////////////// AFFICHAGE || utilisation de P5.js ////////////////////////////////
function setup(){ //Initialisation du canvas et de la matrice
    var canvas = createCanvas(cols * resolution, rows * resolution);
    canvas.position(posCanvasX,posCanvasY);

    matriceInit = matriceInitial(cols, rows);

    
}

function draw(){
    ///// Affichage de la grille /////
    background(0);
    for (let i = 0; i < matriceInit.length; i++) {
        for (let j = 0; j < matriceInit[i].length; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (matriceInit[i][j] == true) {
            fill(255);
            stroke(0);
            rect(x, y, resolution - 1, resolution - 1);
            }
        }
    }

    //// Affichage nbr de cellule en vie et morte + nbr d'iteration /////
    lifeOrDead = calCell(matriceInit);
    cellLife = lifeOrDead[0];
    cellDead = lifeOrDead[1];
    document.getElementById("life").innerHTML=cellLife;
    document.getElementById("dead").innerHTML=cellDead;
    document.getElementById("iteration").innerHTML=nbrIteration; 
    ///////////////////////////////////////////////////
    
    window.addEventListener('click', mouseclick); //appelle la fonction "mouseclick" lors du click de la souris
    window.addEventListener('keydown', eventClavier); //appelle la fonction "eventClavier" lors d'appui d'une touche du clavier
    

    if(start == true ){ //si l'utilisateur appuye sur le btn start

        let newMatrice = matriceInitial(cols, rows);

        //parcourir la matrice puis changer l'état de la cellule en fonction de ces voisins
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                var etat = matriceInit[i][j];
                var nbrVois = voisin(i, j, matriceInit); //récup nbr de voisin en vie
                var returnEtat =rulesOfLife(etat, nbrVois); //valeur de la cellule après test des règles
                
                if(returnEtat == true){
                    newMatrice[i][j] = 1;- // prend la valeur "en vie"
                    cellLife++;
                    cellDead--;
                }
                else if(returnEtat == false){
                    newMatrice[i][j] = 0; // prend la valeur "morte"
                    cellLife--;
                    cellDead++;
                }
                
            }
            nbrIteration++;    
        }
        speed(vitesse); //modifie la vitesse 
        matriceInit = newMatrice;
        
        
    } 
    
}
