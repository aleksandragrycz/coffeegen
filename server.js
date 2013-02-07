// -------------------------------------------------------------------------------------------------
//    Włączenia niezbędnych standardowych modułów Node.js
// -------------------------------------------------------------------------------------------------


// Moduł http (HTTP) do operowania na żądaniach HTTP i tworzenia obiektu serwera.
var http = require('http');

// Moduł url (URL) do manipulacji danymi w adresach URL.
var url = require ('url');

// Moduł path (Path) do pracy ze ścieżkami plików.
var path = require ('path');

// Moduł fs (FileSystem) do pracy z wczytywaniem / zapisem plików.
var fs = require ('fs');

// -------------------------------------------------------------------------------------------------
//    Ustawienia połączenia z serwerem
// -------------------------------------------------------------------------------------------------

// Moduł mongojs
var mongojs = require ('mongojs');

var databaseName = 'coffees';
var collections = ['recipes'];

//Obiekt do wykonywania zapytań
var db = mongojs(databaseName, collections);

// -------------------------------------------------------------------------------------------------
//    Definicje funkcji
// -------------------------------------------------------------------------------------------------


// Funkcja pomocnicza zwracająca typ pliku
function getContentType(fileName) 
{
  // content: type
  var contentTypes = {
     '.css': 'text/css',
      '.js': 'text/javascript',
     '.ico': 'image/vnd.microsoft.icon',
    '.html': 'text/html',
     '.png': 'image/png'
  }; 

  // Wyznaczamy rozszerzenie pliku z nazwy pliku
  var extension = path.extname(fileName);

  // Zwracamy content-type
  return contentTypes[extension];
}


// Funkcja obsługująca żądania z przeglądarki WWW
function serverCallback (request, response) 
{

  var requestUrl = request.url;
  // console.log('URL: ' + requestUrl);

  var pathname = url.parse(request.url)['pathname'];
  // console.log('Pathname: ' + pathname);


  if (pathname === '/coffees') 
  {
    // Elegancko oddzielamy jedno zapytanie od drugiego za pomocą efektownej linii.
    // Dzięki temu debugowanie w konsoli staje się przyjemnością.
    console.log("\n ==============================================================");
    

    // ------------------------------------------------------------------------------
    // ETAP POBIERANIA DANYCH Z ZAPYTANIA
    // ------------------------------------------------------------------------------

    var urlData = url.parse(request.url, true);
    // console.log(urlData);

    var criteria = urlData.query; 
    // console.log(criteria);


    var addonList = [];
    var capacityList = [];
    
    //Pętla do sprawdzania jakie checkboxy zostały zaznaczone (finezyjna!)
    for (c in criteria) 
    {
      // Jeśli nazwa kryterium zaczyna się od 'capacity', to znaczy że kryterium 
      if (c.substring(0, 8) === 'capacity') 
      {

        // Sprawdzamy, czy dane kryterium ma zostać uwzględnione przy wyszukiwaniu wyników
        if (criteria[c] === 'true')
        {

          // Z nazwy kryterium wydobywamy wartość pojemności
          var capacityValue = c.replace('capacity', '');

          // Poniżej parsujemy string na liczbę w systemie dziesiętnym
          var capacityValueNumber = parseInt(capacityValue, 10);

          capacityList.push(capacityValueNumber);
        }
      }
      else 
      {
        // syrop: true
        var addonName = c;

        if (criteria[c] === 'true')
        {
          //Zmienna z obiektem dodatku
          var singleAddonName = { "addons.name": addonName };

          // Pushujemy obiekt na listę do wyszukiwania kaw
          addonList.push(singleAddonName);
        } 
      }

    } // koniec długiej pętli for

    console.log("\nLista pojemnosci:\n");
    console.log(capacityList);
    console.log("Lista dodatków:\n");
    console.log(addonList);

    var query;

    // Jeśli lista dodatków jest pusta zwracamy 'standardowe' kawy
    if (addonList.length === 0) 
    {
      query = { 
        $and: [
          { $or: [ { addons: { $exists: false } }, { "addons.name": 'hotwater'} ] },
          { capacity: { $in: capacityList } } 
        ] 
      };

      console.log("\nZapytanie: \n");
      console.log(JSON.stringify(query));
    }
    else 
    {
      // $and pozwala na zwrócenie KAŻDEJ kawy, która ma dany dodatek/dodatki
      query = { 
        $and: [
          { $and: addonList },
          { capacity: { $in: capacityList }}
        ]
      };

      console.log("\nZapytanie: \n");
      console.log(JSON.stringify(query));
    }


    // Zapytanie do bazy
    db.recipes.find(query, function (error, documents) {

      // Przygotowujemy obiekt JSON.
      var data;

      if (error) 
      {
        data = { result: 'error' };

        console.log('Wystąpił błąd zapytania do bazy danych.');
        return;
      } 

      // Zwracamy false jeśli mamy pusty dokument
      if (documents.length === 0)
      {
        data = { result: false };
      }
      else 
      {
        data = { result: documents };
      }

      var jsonData = JSON.stringify(data);
      console.log();
      console.log('Dane JSON do wysłania:');
      console.log(jsonData);

      response.writeHead(200, {'content-type': 'application/json'});
      response.write(jsonData);
      response.end();

    });

  } else if (pathname === '/all-coffees') {
    
    db.recipes.find(function (error, documents) {
      var data;
      
      if (error) {
        data = { result: 'error' };
        return;
      }

      if (documents.length === 0) {
        data = { result: false };
      } else {
        data = { result: documents };
      }

      var jsonData = JSON.stringify(data);
      response.writeHead(200, {'content-type': 'application/json'});
      response.write(jsonData);
      response.end();
    });

  } else {

    var fileName = requestUrl.substring(1, requestUrl.length);

    // Jeśli ścieżką było: / ustalamy, że żądano pliku index.html
    if (requestUrl === '/') 
    {
      fileName = 'index.html';
    }
    // console.log("Nazwa pliku: " + fileName);

    // Teraz możemy radośnie załadować nasz plik
    loadFile(fileName);

  }


  function handleData (error, contents) 
  {
 
    if (error) 
    {
      response.writeHead(500, {'content-type': 'text/html'});
      response.write('<h1>Błąd 500. Wystąpiły błędy we wczytaniu pliku</h1>');
      response.end();
    }
    else 
    {
      var contentType = getContentType(fileName);

      response.writeHead(200, { 'content-type': contentType });
      response.write(contents);
      response.end();
    }
  }


  function loadFile (fileName) 
  {
    // Sprawdzamy czy plik istnieje.
    fs.exists(fileName, function (exists) 
    {
      if (exists) 
      {
        fs.readFile(fileName, handleData);
      } 
      else 
      {
        response.writeHead(404, { 'content-type':'text/html' });
        response.write('<h1>Błąd 404. Nie ma takiego pliku</h1>');
        response.end();
      }
    });
  }

}


// Tworzymy obiekt serwera!!!
var server = http.createServer(serverCallback);

// Uruchamiamy serwer nasłuchując na porcie 3000
server.listen(3000);

console.log('Serwer działa i słucha na porcie 3000');


