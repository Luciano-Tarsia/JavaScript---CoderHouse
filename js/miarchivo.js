/* 
La idea de "Medio" es que cada instancia de la clase represente a un medio monetario
En mi caso esto es: Un objeto para dinero en efectivo, uno para dinero en el banco y otro para dinero en el MercadoPago
*/

class Medio {
  constructor(disponible) {
    this.disponible = disponible; // Disponible es un float
    this.operaciones = []; // Operaciones es una queue
  }

  suma(valor, operacion) {
    this.disponible = this.disponible + valor; // Aumento el monto de dinero disponible
    if (this.operaciones.length == 5) {
      //Guardo una descripción de la operación (De las últimas cinco operaciones)
      this.operaciones.shift();
    }
    this.operaciones.push(operacion);
  }

  resta(valor, operacion) {
    this.disponible = this.disponible - valor; // Dismunuyo el monto de dinero disponible
    if (this.operaciones.length == 5) {
      //Guardo una descripción de la operación (De las últimas cinco operaciones)
      this.operaciones.shift();
    }
    this.operaciones.push(operacion);
  }

  static fromJSON(serializedJson) {           // Sirve para usar localStorage
    return Object.assign(new Medio(), JSON.parse(serializedJson));
  }
}

//Funciones que se conectan con el .html

function htmlDisponible() {   // Imprimo el dinero disponible en cada medio
  document.getElementById("efectivo-disp").innerHTML =
    "Dinero disponible: " + efectivo.disponible;
  document.getElementById("banco-disp").innerHTML =
    "Dinero disponible: " + banco.disponible;
  document.getElementById("mercadoPago-disp").innerHTML =
    "Dinero disponible: " + mercadoPago.disponible;
}

function htmlOperaciones() {
  /*
  En esta función manipulo la lista de operaciones.
  Lo que hago es, dad la ul del objeto, borro cada li. Luego de borrarlos, los vuelvo a escribir.
  Esto lo hago porque al tocar el botón "reset", yo quiero que la lista esté vacía. Y si bien la queue
  de operaciones se vacía por haber sobreescrito el objeto, el html se mantiene intacto.
  */

  let li;

  //Efectivo
  let aux = document.getElementById("efectivo-op");
  while( aux.firstChild ){
    aux.removeChild( aux.firstChild );
  }
  for (let i = 0; i < efectivo.operaciones.length; i++) {
    $("#efectivo-op").prepend("<li>" + efectivo.operaciones[i] + "</li>");
  }

  //Banco
  aux = document.getElementById("banco-op");
  while( aux.firstChild ){
    aux.removeChild( aux.firstChild );
  }
  for (let i = 0; i < banco.operaciones.length; i++) {
    // Cargo lista banco
    $("#banco-op").prepend("<li>" + banco.operaciones[i] + "</li>");
  }

  //Mercado Pago
  aux = document.getElementById("mercadoPago-op");
  while( aux.firstChild ){
    aux.removeChild( aux.firstChild );
  }
  for (let i = 0; i < mercadoPago.operaciones.length; i++) {
    // Cargo lista MercadoPago
    $("#mercadoPago-op").prepend("<li>" + mercadoPago.operaciones[i] + "</li>");
  }
}

// -- handlers de eventos --

// Botón Reset
//let reset = document.getElementById("reset");

$("#reset").click( () => {

  efectivo = new Medio(
    parseInt(prompt("Ingrese la cantidad de dinero en efectivo disponible"), 10)
  );
  banco = new Medio(
    parseInt(prompt("Ingrese la cantidad de dinero disponible en su banco"), 10)
  );
  mercadoPago = new Medio(
    parseInt(
      prompt(
        "Ingrese la cantidad de dinero disponible en su cuenta de Mercado Pago"
      ),
      10
    )
  );

  htmlDisponible();
  htmlOperaciones();
  
  localStorage.setItem("efectivo", JSON.stringify(efectivo));
  localStorage.setItem("banco", JSON.stringify(banco));
  localStorage.setItem("mercadoPago", JSON.stringify(mercadoPago));
});

// Submit de operación en efectivo
let efectivoSubmit = document.getElementById("efectivo-submit");
efectivoSubmit.onclick = () => {
  let operacion = document.getElementById("efectivo-operacion").value;
  let monto = parseInt(document.getElementById("efectivo-monto").value,10);
  let descripcion = document.getElementById("efectivo-desc").value;
  let descripcionExt;

  if(operacion == "G"){
    descripcionExt = "G | " + descripcion + " | Monto: " + monto;
    efectivo.suma(monto, descripcionExt)
  }else{
    descripcionExt = "P | " + descripcion + " | Monto: " + monto;
    efectivo.resta(monto, descripcionExt)
  }

  htmlDisponible();
  htmlOperaciones();
  
  localStorage.setItem("efectivo", JSON.stringify(efectivo));
}

// Submit de operación en banco
let bancoSubmit = document.getElementById("banco-submit");
bancoSubmit.onclick = () => {
  let operacion = document.getElementById("banco-operacion").value;
  let monto = parseInt(document.getElementById("banco-monto").value,10);
  let descripcion = document.getElementById("banco-desc").value;
  let descripcionExt;

  if(operacion == "G"){
    descripcionExt = "G | " + descripcion + " | Monto: " + monto;
    banco.suma(monto, descripcionExt)
  }else{
    descripcionExt = "P | " + descripcion + " | Monto: " + monto;
    banco.resta(monto, descripcionExt)
  }

  htmlDisponible();
  htmlOperaciones();
  
  localStorage.setItem("banco", JSON.stringify(banco));
}

// Submit de operación en Mercado Pago
let mercadoPagoSubmit = document.getElementById("mercadoPago-submit");
mercadoPagoSubmit.onclick = () => {
  let operacion = document.getElementById("mercadoPago-operacion").value;
  let monto = parseInt(document.getElementById("mercadoPago-monto").value,10);
  let descripcion = document.getElementById("mercadoPago-desc").value;
  let descripcionExt;

  if(operacion == "G"){
    descripcionExt = "G | " + descripcion + " | Monto: " + monto;
    mercadoPago.suma(monto, descripcionExt)
  }else{
    descripcionExt = "P | " + descripcion + " | Monto: " + monto;
    mercadoPago.resta(monto, descripcionExt)
  }

  htmlDisponible();
  htmlOperaciones();
  
  localStorage.setItem("mercadoPago", JSON.stringify(mercadoPago));
}

//main()

var efectivo;
var banco;
var mercadoPago;

if (localStorage.getItem("efectivo") == null) {
  // Resteo la memoria
  efectivo = new Medio(
    parseInt(prompt("Ingrese la cantidad de dinero en efectivo disponible"), 10)
  );
  banco = new Medio(
    parseInt(prompt("Ingrese la cantidad de dinero disponible en su banco"), 10)
  );
  mercadoPago = new Medio(
    parseInt(
      prompt(
        "Ingrese la cantidad de dinero disponible en su cuenta de Mercado Pago"
      ),
      10
    )
  );
} else {
  // Sigo con la misma memoria
  efectivo = Medio.fromJSON(localStorage.getItem("efectivo"));
  banco = Medio.fromJSON(localStorage.getItem("banco"));
  mercadoPago = Medio.fromJSON(localStorage.getItem("mercadoPago"));
}

htmlDisponible();
htmlOperaciones();