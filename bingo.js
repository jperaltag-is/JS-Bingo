
const initialNumber = 1, finalNumber =75, matrixNumber=5;
const bingoNumbersByCard = matrixNumber*matrixNumber-1;//cantidad de espacios que hay en una tarjeta menos el gratuito

var numberMapper = {};//json para guardar números no repetidos
var sungNumbers = [];//números cantados
var nextNumber = '';//variable que ayudará a verificar si se desea seguir con el canto de números.
var counter = 0;//contador para generar IDs de jugadores.
var isWinner = false;
var idWinner = '';

var dataBingoCardMapper = {};//json para guardar las tarjetas de Bingo generadas.

/*Función para cantar un número de Bingo*/
function singBingoNumber(){
    var bingoNumber;
    
    do{
        bingoNumber = Math.round(Math.random() * 
        (initialNumber - finalNumber) + 
        finalNumber);
    
        if(!numberMapper[bingoNumber]){
            numberMapper[bingoNumber] = {
                'value': bingoNumber
            }
            sungNumbers.push(bingoNumber);
            return bingoNumber;
        }
    } while (numberMapper[bingoNumber])  //mientras el número aleatorio generado ya exista.
    
}

/*Función para obtener una tarjeta de Bingo.
  Recibe como parámetro el id del jugador*/ 
function getBingoCard(idPlayer){
    var bingoNumber;
    var bingoCard = [] ;
    var colB = [], colI = [], colN = [], colG = [], colO = [];

    var totalColumnsLength = 0;

    while(totalColumnsLength < bingoNumbersByCard){
        bingoNumber = singBingoNumber();

        if(bingoNumber>=1 && bingoNumber<=15 && colB.length < 5) {
            colB.push(bingoNumber);
            totalColumnsLength++;
        }
        if(bingoNumber>=16 && bingoNumber<=30 && colI.length < 5) {
            colI.push(bingoNumber);
            totalColumnsLength++;
        }
        if(bingoNumber>=31 && bingoNumber<=45 && colN.length < 4) {
            colN.push(bingoNumber);
            totalColumnsLength++;
        }
        if(bingoNumber>=46 && bingoNumber<=60 && colG.length < 5) {
            colG.push(bingoNumber);
            totalColumnsLength++;
        }
        if(bingoNumber>=61 && bingoNumber<=75 && colO.length < 5) {
            colO.push(bingoNumber);
            totalColumnsLength++;
        }
    }

    bingoCard = [colB, colI, colN, colG, colO] ;
    var dataBingoCard = {
        'idPlayer':idPlayer,
        'bingoCard': bingoCard,
        'flatBingoNumbers': bingoCard.flat()
    }
    dataBingoCardMapper[idPlayer] = {
        'dataBingoCard': dataBingoCard
    }
    numberMapper = {};
    sungNumbers = [];
    return dataBingoCard;
}

/* Función para verificar si la tarjeta de un Jugador es la Ganadora o no.
    Recibe como parámetro el id del Jugador */
function checkBingoCard(idPlayer){
    
    var cardNumbersByPlayer = dataBingoCardMapper[idPlayer].dataBingoCard.flatBingoNumbers;
    
    var result = {}

    for(let index = 0; index < cardNumbersByPlayer.length; index++){
        if(!sungNumbers.includes(cardNumbersByPlayer[index])){
            result[idPlayer] = {
                'message': "El id "+ idPlayer +" NO es el GANADOR",
                'state': false
            }
            return result
            break;
        }
    }
    result[idPlayer] = {
        'message': "El id "+ idPlayer +" SÍ es el GANADOR",
        'state': true
    }
    
    return result;
}


/******************************************************************/
/******PRUEBAS******/

/*CREAR NUEVAS TARJETAS BINGO*/
do{
    console.log(getBingoCard(counter++));
    nextNumber = prompt("Desea obtener una tarjeta? (S/N)")
} while (nextNumber.toLowerCase()=='s');


/**CANTAMOS LOS NÚMEROS BINGO Y AL MISMO TIEMPO VALIDAMOS LAS TARJETAS BINGO POR JUGADOR */
do{
    if(sungNumbers.length >= bingoNumbersByCard){//Si la cantidad de números cantados es mayor o igual a la cantidad de números que hay en una tarjeta
        //Verifico la tarjeta de cada jugador
        for(let idPlayer = 0; idPlayer < counter; idPlayer++ ){
            var resultCheckBingoCard = checkBingoCard(dataBingoCardMapper[idPlayer].dataBingoCard.idPlayer)[idPlayer]
           
            if(resultCheckBingoCard.state) {
                isWinner = true;
                idWinner = idPlayer;
                alert(resultCheckBingoCard.message);
                break;
            }
            
        }
        if(isWinner) break;
    }

    singBingoNumber()
    
} while (sungNumbers.length < finalNumber && !isWinner);

/**MOSTRAMOS EN EL NAVEGADOR TODO LO GENERADO */
document.write('TARJETAS BINGO: ');
for(let idPlayer = 0; idPlayer < counter; idPlayer++ ){
    document.write('<br>Números Jugador  (' + idPlayer + '): ');
    var card = JSON.stringify(dataBingoCardMapper[idPlayer].dataBingoCard.flatBingoNumbers)
    document.write('<br>' + card);
}

document.write('<br><br>NÚMEROS CANTADOS: <br>');
document.write(sungNumbers);
document.write('<br><br>GANADOR: Jugador (' + idWinner + ')');


