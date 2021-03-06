//Se necesita añadir la api key de OMDB en la url de mas abajo.
//Ejercicio peliculas,series y juegos con Firebase Realtime Database.

//Configuracion e inicializacion de Firebase Realtime Database.
const firebaseConfig = {
  apiKey: "",
  authDomain: "mispeliculas-2.firebaseapp.com",
  databaseURL: "https://mispeliculas-2.firebaseio.com",
  projectId: "mispeliculas-2",
  storageBucket: "mispeliculas-2.appspot.com",
  messagingSenderId: "547832534056",
  appId: "1:547832534056:web:6b511dfe7dc846adfa911d"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

//Referencia a la coleccion de la base de datos.
const ref = firebase.database().ref("/Pelis")

//Arrays para las peliculas buscadas y la lista de peliculas guardadas para acceder a sus id y realizar comprobaciones 
let fetchList = []
let list = []

//Evento para crear la lista de peliculas añadidas
ref.on("value", snapshot => {
  list = []
  const films = snapshot.val()
  for (const key in films) {
    const name = films[key].Titulo
    list.push({key, name})
  }
})

//Fetch de la pelicula introducida en el input, añadido a evento del boton.
function search(){  
  let title = document.getElementById("textBox").value
  let url = `http://www.omdbapi.com/?s=${title}&apikey=APIKEY`  //**AÑADIR API KEY AQUI**
  fetch(url)
  .then(data => data.json())
  .then(res => {
    fetchList = res.Search
    let resultado = document.getElementById("resultado")
    resultado.style.visibility = "visible"
    resultado.innerHTML=""
    fetchList.forEach((element,index)=>{
      resultado.innerHTML += `<div><img src="${element.Poster}"><p>Titulo: ${element.Title} </br> Año: ${element.Year} </br> Tipo: ${element.Type}<button id="${index}">Agregar a lista</button></p></div>`;
    })
    addListeners()
    console.log(fetchList)
  })
  .catch(err => console.error(`Error: ${err}`))
}

const btn = document.getElementById("btn")
btn.addEventListener("click", search)

//Funcion para añadir los eventos a los botones de las peliculas buscadas.
function addListeners(){
  let botones = document.getElementById("resultado").querySelectorAll("button");
  let arrBotones = Array.from(botones);
  for(let i in arrBotones){
    arrBotones[i].addEventListener("click", function() {
      addFilm(fetchList[i]) 
    })
  }
}

//Funcion para comrpobar si exite ya la pelicula y pushearla o no
function addFilm(filmDetails) {
  let coincidencias = false
  list.map( item => {
    if(item.name === filmDetails.Title){
      coincidencias = true
    }
  })
  if(coincidencias){
    console.log('La peli ya esta añadida')
  } else {
    ref.push({
   Titulo: filmDetails.Title,
   Año: filmDetails.Year,
   Tipo: filmDetails.Type,
   Imagen: filmDetails.Poster,
   Info: `"No has agregado información."`
   })
   console.log(`"${filmDetails.Title}" ha sido añadida a tu lista.`)
 }
}

//Lectura de datos de la base y pintarlos en el HTML.
ref.on('value', (snapshot) => {
  document.getElementById("listaPelis").innerHTML = ""
  snapshot.forEach((childSnapshot) => {
    const element = childSnapshot.val()
    pintarPeli(element.Titulo)
  })
  addDeleteListeners()
  addUpdateListeners()
  addGetListeners()
})

//Funcion para pintar en el HTML.
function pintarPeli (titulo){
  let div = document.createElement("div")
  div.innerHTML = `<p>${titulo}</p><button class="get">Ver</button><button class="update">Editar</button><button class="delete">Borrar</button>`
  document.getElementById("listaPelis").append(div)
}

//Funcion de borrar para los botones "BORRAR".
function deleteFilm(){
  let id = event.target.parentElement.firstChild.textContent
  
  list.map(e => {
    if (e.name === id) {
      ref.child(e.key).remove()
    }
  })
}

//Agregar listeners a los botones "BORRAR".
function addDeleteListeners(){
  let botones = document.querySelectorAll(".delete")
  let arrBotones = Array.from(botones)
  arrBotones.forEach((element) => element.addEventListener("click", deleteFilm))
}

//Actualizar información sobre la película/serie.
function updateFilmName(){
  let id = event.target.parentElement.firstChild.textContent
  let update = prompt(`¿Quieres añadir informacion a ${id}?`)

  if(update){
    list.map(e => {
      if (e.name === id) {
        ref.child(e.key).update({Info:update})
      }
    })
    console.log(`Añadida información a la pelicula/serie ${id} => ${update}`)
  }
}

//Agregar listeners para los botones "EDITAR".
function addUpdateListeners(){
  let botones = document.querySelectorAll(".update")
  let arrBotones = Array.from(botones)
  arrBotones.forEach((element)=>element.addEventListener("click",updateFilmName))
}

//Leer los datos y mostrarlo por el HTML.
function getFilmData(){
  let id = event.target.parentElement.firstChild.textContent
  let key

  list.map(e => {
    if (e.name === id) {
      key = e.key
    }
  })

  let elemento = firebase.database().ref(`Pelis/${key}`) 
  let fixed = document.getElementById("datosPeli")
  elemento.once('value', (snapshot) => {
    let datos = snapshot.val()
    console.log(datos)
    fixed.innerHTML =""
    fixed.style.visibility = "visible"
    document.getElementById("borroso").style.visibility = "visible"
    fixed.innerHTML += `<img src="${datos.Imagen}"><p>Titulo: ${datos.Titulo} </br> Año: ${datos.Año} </br> Tipo: ${datos.Tipo} </br>Info: ${datos.Info}</p><button id="closeFixed"><img src="img/close24.png" alt="x" /></button>`
  })
  document.getElementById("closeFixed").addEventListener("click",function(){
    fixed.style.visibility = "hidden"
    document.getElementById("borroso").style.visibility = "hidden"
  })
}

//Agregar eventos para los botones "ver".
function addGetListeners(){
  let botones = document.querySelectorAll(".get")
  let arrBotones = Array.from(botones)
  arrBotones.forEach((element)=>element.addEventListener("click",getFilmData))
}
