window.onload = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {             //Si estamos logueados
      showDashboardPage(); //Cambiar a la pagina de dasboard
      setupMessages();     //Dejar todo listo para mostrar mensajes. 

    } else {                //No estamos logueados
      showLoginPage();     //Cambiar a la pagina de login
    }
  });
};

/* ----Login---- */
function login() {
  const emailValue = document.getElementById("login-username").value;
  const passwordValue = document.getElementById("login-password").value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario con login exitoso");
    })
    .catch((error) => {
      console.log("Error de firebase > " + error.code);
      console.log("Error de firebase, mensaje > " + error.message);
    });
}

function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScope("user_birthday"); tienen que pedirle permiso a facebook
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      console.log("Login con facebook");
    })
    .catch((error) => {
      console.log("Error de firebase > " + error.code);
      console.log("Error de firebase, mensaje > " + error.message);
    });
  scope: 'email'//acceder al email del usuario

}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("Chao");
    })
    .catch();
}
/* -------FIN LOGIN------- */

/* -------router, login, register------ */
function showPerfilPage() {
  console.log('1');
  $('#login-page').hide();
  $('#perfil-page').show();
  $('#dashboard-page').hide();
  $('#register-page').hide();
}

function showRegisterPage() {
  console.log('2');
  $('#login-page').hide();
  $('#perfil-page').hide();
  $('#dashboard-page').hide();
  $('#register-page').show();
}

function showDashboardPage() {

  console.log('3');
  $('#login-page').hide();
  $('#perfil-page').hide();
  $('#dashboard-page').show();
  $('#register-page').hide();
}

function showLoginPage() {
  console.log('4');
  $('#login-page').show();
  $('#perfil-page').hide();
  $('#dashboard-page').hide();
  $('#register-page').hide();
}
/* -------fin router------ */

/* --------Register------- */
function register() {
  const emailValue = document.getElementById("register-email").value;
  const passwordValue = document.getElementById("register-password").value;

  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario registrado");
    })
    .catch((error) => {
      console.log("Error de firebase > " + error.code);
      console.log("Error de firebase, mensaje > " + error.message);
    });
}
/* -----Fin register----- */

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// funcion para el contador de "aportes"

let counter = 0;
function clickCounter() {
  counter += 1;
  document.getElementById("icon").innerHTML = counter;
  document.getElementById('registro').classList.add('d-none');
}

// https://www.youtube.com/watch?v=i3WdUCvCQSU&t=4s
//video sobre como postear imagenes de la galeria

// alert de terminos y condiciones
function termsAndConditions() {
  alert('Los terminos y condiciones de Femcy Tech se basan en una actitud respetuosa, abierta en el intercambio de ideas. NO se toleraran a personas de pensamiento o de comportamiento critico destructivo, se apoya el tipo de critica constructiva, es decir, aporte en los diversos temas y en la página en si.');
}


// Subir un post

// Agregar documento
function guardar() {
  var texto = document.getElementById('text').value;
  let name = "mi@mail.com";
  let d = new Date();
  let time = d.getHours() + ":" + d.getMinutes();
  let date = d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
  let title = document.getElementById('titulo').value;

  db.collection("post").add({
    name: name,
    title: title,
    texto: texto,
    date: date,
    time: time
  })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      console.log("text");
      console.log('sí se ha guardado');
      document.getElementById('text').value = '';
      document.getElementById('titulo').value = '';
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// Leer comentarios
var posteos = document.getElementById('muro');

db.collection("post").onSnapshot((querySnapshot) => {
  posteos.innerHTML = '';
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    posteos.innerHTML += `
        <div id="jumbotron" class="shadow p-2 mb-3 bg-light rounded">
        <div class="jumbotron jumbotron-fluid">
        <div class="container" id="jumbotron">
          <h5 class="display-5">${doc.data().title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${doc.data().name} a las: ${doc.data().time}</h6>
          <p class="lead">${doc.data().texto} <a href="#" class="card-link">ver más</a> </p>
          <button class="btn btn-danger btn-sm" onclick="myFunction(event, '${doc.id}')">Eliminar</button>
          <button class="btn btn-warning btn-sm" onclick="editar('${doc.id}', '${doc.data().title}', '${doc.data().texto}')">Editar</button> 
          <button type="button" id="iconLike" onclick="clickCounter()">
          <i id="icon" class="fas fa-archive"></i>
         </div>
       </div>
     </div>`

  });
});
// Borrar documentos
function eliminar(id) {
  db.collection("post").doc(id).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

function myFunction(event, id) {
  if (confirm("estas seguro??")) {
    eliminar(id);
  } else {
    console.log('no eliminar');
  }
}
// Editar documento
function editar(id, titulo, texto) {
  document.getElementById('titulo').value = titulo;
  document.getElementById('text').value = texto;
  var boton = document.getElementById('boton');
  boton.innerHTML = 'Editar';
  boton.onclick = function () {


    let editarPost = db.collection("post").doc(id);
    let title = document.getElementById('titulo').value;
    let texto = document.getElementById('text').value;

    return editarPost.update({
      title: title,
      texto: texto
    })
      .then(function () {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar';
        document.getElementById('titulo').value = '';
        document.getElementById('text').value = '';
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }
}