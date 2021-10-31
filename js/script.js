

// Parameters
var mutation_rate = 0.003;
var mutants = 1;
var start_zone = 12;
var end_zone = 100;
var seed = null;

var original_filename = "output";
var original_fileextesion = "txt";

function updateForm()
{

  // Set global parameters, and validate values

  var input_seed = get("input_seed").value;

  if(input_seed != "")
  {
    seed = input_seed;
  }
  else
  {
    seed = new Date().getTime();
  }

  Math.seedrandom(seed);

  var input_rate = get("input_rate").value*1;
  if(input_rate == NaN || input_rate > 1 || input_rate < 0)
  {
    input_rate = 0.001;
  }

  get("input_rate").value = input_rate;


  var input_start = get("input_start").value*1;
  if(input_start == NaN || input_start > 100 || input_start < 0)
  {
    input_start = 12;
  }

  if(input_start > input_end)
  {
    input_start = input_end;
  }

  get("input_start").value = input_start;
  get("start_percentage").innerHTML = input_start;
  start_zone = input_start;

  var input_end = get("input_end").value*1;
  if(input_end === NaN || input_end > 100 || input_end < 0)
  {
    input_end = 100;
  }

  if(input_end < input_start)
  {
    input_end = input_start;
  }

  get("input_end").value = input_end;
  get("end_percentage").innerHTML = input_end;
  end_zone = input_end;

  var input_mutant = get("input_mutant").value*1;
  if(input_mutant === NaN || input_mutant < 0)
  {
    input_mutant = 1;
  }

  get("input_mutant").value = input_mutant;
  mutants = input_mutant;
}


function start_mutate()
{
  updateForm();
  loadFile();
}



function loadFile(e)
{

  var file = document.getElementById("input_file").files[0];
  if (file) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      var path = get("input_file").value.replace(/\\/g,"/").replace(/\/\//g,"/").split("/");
      var filename_complete_split = path[path.length-1].split(".");
      original_filename = filename_complete_split[0];
      if(filename_complete_split.length > 1)
      {
        original_fileextesion = filename_complete_split[1];
      }

      reader.onload = function(evt)
      {

           var u8 = new Uint8Array(evt.target.result);

           handleU8(u8);
      }

      reader.onerror = function(evt)
      {

          alert("Error reading file");
      }
  }
  else
  {
    alert("You did not upload a file!");
  }
}

function handleU8(u8)
{
  var list_mutants = [];

  for(var i = 0; i < mutants;i++)
  {
    list_mutants.push(mutate(u8, mutation_rate, start_zone, end_zone));
  }


  var filename = original_filename+" mutated "+getDateTime();
  var filextension = original_fileextesion;

  if(list_mutants.length == 1)
  {

    var blob = new Blob([list_mutants[0].buffer],
    {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename+"."+filextension);
  }
  else
  {
    var zip = new JSZip();
    for(var i = 0; i < mutants;i++)
    {

      filename_mutant =original_filename+" mutant #"+i;

      var blob = new Blob([list_mutants[i].buffer],
      {
        type: "text/plain;charset=utf-8"
      });

      // Add file to zip
      zip.file(filename_mutant+"."+filextension, blob)
    }

    zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
        saveAs(blob, original_filename+" mutations "+getDateTime()+".zip", blob); // 2) trigger the download
    }, function (err) {
        console.log("error",err)
    });


  }




}

function mutate(original_u8, mutation_rate, start_zone, end_zone)
{
  var u8 = new Uint8Array(original_u8);

  var start_byte = start_zone/100*u8.length;
  var end_byte = end_zone/100*u8.length;

  for(var i = 0; i < u8.length; i++)
  {
      if(Math.random() < mutation_rate)
      {
        if(i >= start_byte && i <= end_byte)
        {

            u8[i] = rand(0,255);
        }
      }
  }
  return u8;
}



function getDateTime() {
        var now     = new Date();
        // var year    = now.getFullYear();
        var year = now.toLocaleDateString('en', {year: '2-digit'})
        var month   = now.getMonth()+1;
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds();
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }
        var dateTime = hour+'_'+minute+'_'+second+" "+day+"_"+month+"_"+year;
        return dateTime;
    }


var decrypt_timer = 3000;
var decrypt_index = 0;
var decrypt_char = "▒";
setInterval( step_decrypt, decrypt_timer);

function step_decrypt()
{
      var crypted = document.getElementsByClassName("crypted");
      for(var i in crypted)
      {
        var c = crypted[i];
        if(typeof c.getAttribute == "function")
        {
          var v = c.getAttribute('data-value');
          var d = atob(v);

          decrypt_index = (decrypt_index+1)%1000;

          d = d.replaceAt(decrypt_index%d.length, decrypt_char);
          c.innerHTML = d;
        }
      }
}


step_decrypt();
updateForm();


/*

  To

*/
