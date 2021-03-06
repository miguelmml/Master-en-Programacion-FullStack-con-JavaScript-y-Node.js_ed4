/** 
 * @file exercise to get data of pollution and meteorology in Madrid.
 * @author Miguel Martin-Maestro Lopez
 * @version 1.1.0
*/

/** 
 * @function IIFE
 * @description fetch to get Madrid pollution data
*/
(function(){
  fetch("http://airemad.com/api/v1/pollution")
  .then(function(response){
    return response.json();
  })
  .then(function(data){

    var contaminacion = data[1];

    for(var clave in contaminacion){
      if( clave != "id" && clave != "name"){

        var datosContaminacion = contaminacion[clave].parameter + " = " + contaminacion[clave].values[0].valor +" "+ String.fromCharCode(181) + "g/m3 medido mediante " + contaminacion[clave].technique;                
        var p = document.createElement("p");
        p.append(datosContaminacion);
        var salto = document.createElement("br")
        p.append(salto);
        document.getElementById("resultadoPolucion").append(p);
      }
    }    
  })
  .catch(function(error){console.error('Error:', error)
  });
})();

/** 
 * @function IIFE
 * @description fetch to get the meteorology data of madrid
*/
(function (url){
  fetch("http://airemad.com/api/v1/weather/P001")
  .then(function(response){
    return response.json();
  })
  .then(function(data){

    var listaMetereologia = data.list;

    for(i = 0; i < listaMetereologia.length; i++){
      if(listaMetereologia[i].dt_txt.slice(11) == "21:00:00"){                

        var p = document.createElement("p");
        p.innerHTML = "Fecha: " + listaMetereologia[i].dt_txt.slice(0,10) + "<br/>" + listaMetereologia[i].main.temp + "°C "+ "<br/>" + "Min " +  listaMetereologia[i].main.temp_min + " | " + "Max " + listaMetereologia[i].main.temp_max + "<br/>" + "Hum " + listaMetereologia[i].main.humidity + "%" + " | " + "Press " + listaMetereologia[i].main.pressure + "psi" + "<br/>" + "Viento " + listaMetereologia[i].wind.deg + "º" + " | " + listaMetereologia[i].wind.speed + "km/h";

        var img = document.createElement("img");
        img.src = "http://openweathermap.org/img/wn/" + listaMetereologia[i].weather[0].icon + "@2x.png";
      
        img.style.backgroundColor = "skyblue";
        img.style.borderRadius = "100%";

        var div = document.createElement("div");
        div.classList.add("wrapperMet");
        document.getElementById("resultadoTiempo").append(div);

        div.append(img);
        div.append(p);
    }
    }        
  })
  .catch(function(error){console.error('Error:', error)
  });
})();


var camaras = ["06303","06304","06305","06306","06308","09303","07306","09307","01313","09301","01314","06301","07302","05308","05304","05306","04312","01320","01301","04305","04307","04306","03303","02304","01306","01305","01304","01302","01317","01318","07308","01321","04310","07301","07305","07307","04308","01303","10302","11307","04302","04303","11304","03306","03307","20308","01308","01309","01310","01311","08317","02308","09309","09310","10309","15302","15301","08309","17301","08313","16308","10307","13305","14303","18303","08316","08315","15305","01307","03301","11302","13301","09302","13304","18301","04304","02310","11310","01312","04309","15304","04311","07303","02305","09304","09305","10305","11309","05303","13302","08310","08311","08303","06309","06310","08312","15303","05307","09306","03302","12302","08318","16306","08308","16301","20306","20307","16305","16304","16303","08307","08306","08305","06302","04313","06307","02303","02306","14302","14301","16302","13303","10306","03304","05305","08301","09311","08314","20302","07304","04314","04315","15307","06311","20303","20304","20305","20301","02301","02302","12301","11303","12309","12304","12307","12306","12305","12303","12308","01316","01315","21301","05309","10308","05301","05302","03305","04301","15306","08302","08304","11301","18304","16307","01323","01322","04316","20309","01331","01332","01319","01330","14304","07309","10304","09312","13306","01324","11305","02307","18305","20311","20310","05311","05312","18306","05310","21302","17302","20313","11306","15308","08319","13307","02311","16309","14305","18302","04317","08320","09313","08321","15310","16310","15309","01333","15311","09314","11311","04318","19301","03308","10310","11312","19302","11313","17303","15312","13308","15313","16311","06312","04319","05314","08322","10311","12310","01334","05315","02309","08323","14306","08324","11314","08325","09315","10312","13310","01335","03309","04320","04321","04322","05316","06313","07310","08326","08327","08328","08329","08330","09316","09317","09318","10313","11315","11316","11317","13311","13312","13313","13314","14307","14308","15314","15315","16312","16313","16314","17304","18307","21303","19303"];

/** 
 * @function IIFE
 * @description fetch to get the traffic camera view of madrid
*/
(function(){
  var camara = camaras[Math.round(Math.random()*(camaras.length - 0) + 0)];
  var urlCamara = "http://informo.munimadrid.es/cameras/Camara" + camara +".jpg";
  
  var img = document.createElement("img");
  img.setAttribute("src",urlCamara);
  img.setAttribute("id","imgCam");
  document.getElementById("resultadoCam").append(img);
})();

