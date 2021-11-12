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

// Funciones para entradas

function input_seguir() {
  return prompt(
    "Ingrese lo que quiera hacer. Opciones: \n C: Continuar \n X: Dejar de correr el programa"
  );
}
function input_medio() {
  return prompt(
    "Ingrese donde lo que quiera hacer. Opciones: \n E: Efectivo \n B: Banco \n MP: Mercado Pago"
  );
}
function input_operacion() {
  return prompt(
    "Ingrese lo que quiera hacer. Opciones: \n G: Para una ganancia \n P: Para una perdida"
  );
}

//Función que imprime el ticket final

function printFinal(objeto1, objeto2, objeto3) {
  s1 =
    "Su dinero en efectivo disponible es: " +
    objeto1.disponible +
    "\nSus operaciones fueron:\n" +
    objeto1.operaciones.join("\n") +
    "\n" +
    "\n";

  s2 =
    "Su dinero disponible en el banco es: " +
    objeto2.disponible +
    "\nSus operaciones fueron:\n" +
    objeto2.operaciones.join("\n") +
    "\n" +
    "\n";

  s3 =
    "Su dinero disponible en el MercadoPago es: " +
    objeto3.disponible +
    "\nSus operaciones fueron:\n" +
    objeto3.operaciones.join("\n") +
    "\n" +
    "\n";

  return s1 + s2 + s3;
}

//Funciones que se conectan con el HTML

function htmlDisponible() {   // Imprimo el dinero disponible en cada medio
  document.getElementById("efectivo-disp").innerHTML =
    "Dinero disponible: " + efectivo.disponible;
  document.getElementById("banco-disp").innerHTML =
    "Dinero disponible: " + banco.disponible;
  document.getElementById("mercadoPago-disp").innerHTML =
    "Dinero disponible: " + mercadoPago.disponible;
}

function htmlOperaciones() {  // Imprimo las últimas 5 operaciones realizadas en cada medio
  let li;

  for (let i = 0; i < efectivo.operaciones.length; i++) {
    // Cargo lista efectivo
    li = document.createElement("li");
    li.innerHTML = efectivo.operaciones[i];
    document.getElementById("efectivo-op").appendChild(li);
  }
  for (let i = 0; i < banco.operaciones.length; i++) {
    // Cargo lista banco
    li = document.createElement("li");
    li.innerHTML = banco.operaciones[i];
    document.getElementById("banco-op").appendChild(li);
  }
  for (let i = 0; i < mercadoPago.operaciones.length; i++) {
    // Cargo lista MercadoPago
    li = document.createElement("li");
    li.innerHTML = mercadoPago.operaciones[i];
    document.getElementById("mercadoPago-op").appendChild(li);
  }
}

//main()

var efectivo;
var banco;
var mercadoPago;

if (
  localStorage.getItem("efectivo") != null &&
  prompt("¿Desea resetear su información?\nS:Si\nN:No") == "Si"
) {
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

var aux = 0;
var medio; // E: Efectivo | B: Banco | MP: MercadoPago
var operacion; // G: Ganancia | P: Perdida
var descripcion; // Descripción de la operación
var descripcionExt;

while (input_seguir() == "C") {
  medio = input_medio();
  operacion = input_operacion();
  descripcion = prompt("Ingrese una descripción de la operación");
  aux = parseInt(prompt("Ingrese el monto a registrar:"), 10);

  if (operacion == "G") {
    // Ganancia
    descripcionExt = "G | " + descripcion + " | Monto: " + aux;
    if (medio == "E") {
      // Efectivo
      efectivo.suma(aux, descripcionExt);
    } else if (medio == "B") {
      // Banco
      banco.suma(aux, descripcionExt);
    } else {
      // MercadoPago
      mercadoPago.suma(aux, descripcionExt);
    }
  } else {
    // Perdida
    descripcionExt = "P | " + descripcion + " | Monto: " + aux;
    if (medio == "E") {
      // Efectivo
      efectivo.resta(aux, descripcionExt);
    } else if (medio == "B") {
      // Banco
      banco.resta(aux, descripcionExt);
    } else {
      // MercadoPago
      mercadoPago.resta(aux, descripcionExt);
    }
  }
  alert(
    "Operación registrada\nSu dinero en efectivo disponible es: " +
      efectivo.disponible +
      "\nSu dinero disponible en el banco es: " +
      banco.disponible +
      "\nSu dinero disponible en el MercadoPago es: " +
      mercadoPago.disponible
  );
}

htmlDisponible();
htmlOperaciones();

localStorage.setItem("efectivo", JSON.stringify(efectivo));
localStorage.setItem("banco", JSON.stringify(banco));
localStorage.setItem("mercadoPago", JSON.stringify(mercadoPago));

alert("Ejecucion finalizada.\n" + printFinal(efectivo, banco, mercadoPago));