// Najpierw włączamy kilka bibliotek potrzebnych 
// do wykonania naszego niecnego planu zagłady.

// Moduł http do operowania na zapytaniach i tworzenia obiektu serwera.
var http = require ('http');

// Moduł url do manipulacji danymi w URL'ach.
var url = require ('url');

// Moduł path do pracy ze ścieżkami plików.
var path = require ('path');

// Moduł fs (file system) do pracy z wczytywaniem / zapisem plików.
var fs = require ('fs');

// USTAWIENIA POŁĄCZENIA Z BAZĄ DANYCH
// -----------------------------------

// Moduł połączeń z bazą danych mongo-db.
var mongojs = require ('mongojs');

// Nazwa bazy danych.
var databaseName = 'coffees';

// Lista kolekcji z jakich będziemy korzystać.
var collections = ['recipies'];

// Obiekt służący do wykonywania zapytań.
var db = mongojs(databaseName, collections);





// Funkcja zwracająca content type na podstawie rozszrerzenia pliku.
function getContentType(fileName) {

  var contentTypes = {
     '.css': 'text/css',
      '.js': 'text/javascript',
     '.ico': 'image/vnd.microsoft.icon',
    '.html': 'text/html'
  }; 
  var extension = path.extname(fileName);
  console.log('Rozszerzenie pliku: ' + extension);
  
  return contentTypes[extension];
}

// Funkcja obsługująca zapytania z przeglądarki WWW.
function serverCallback (request, response) {
  
  /*
   *
   *  DEFINICJE FUNKCJI 
   * 
   */

  // Funkcja wywoływana po wczytaniu pliku do pamięci.
  // parametry:
  //   error - boolean zawierający informację czy przy wczytaniu był błąd
  //   contents - treść wczytanego pliku
  function afterRead (error, contents) {

    // Sprawdzamy czy wystąpiły błędy
    if (error) {
      // Wystąpił błąd z wczytaniem pliku.
      response.writeHead(500, {'content-type': 'text/html'});
      response.write('<h1>Błąd 500. Wystąpiły błędy we wczytaniu pliku</h1>');
      response.end();
    } else {

      var contentType = getContentType(fileName);
      console.log('Content-type: ' + contentType);

      // Jeśli udało się pomyślnie wczytać plik.
      response.writeHead(200, {
        'content-type': contentType 
      })
      response.write(contents);
      response.end();
    }
  }



  // Funkcja ładująca pliki z dysku.
  // parametry:
  //  fileName - nazwa pliku do wczytania
  function loadFile (fileName) {
    
    // Sprawdzamy czy plik istnieje.
    fs.exists(fileName, function (exists) {
      
      // Jeśli plik istnieje.
      if (exists) {
        // Wczytujemy plik o wskazanej nazwie.
        fs.readFile(fileName, afterRead);

      } else {
        response.writeHead(404, {'content-type':'text/html'});
        // Wysyłamy prosty tekst z informacją ze nie ma żądanego pliku.
        response.write('<h1>Błąd 404. Nie ma takiego pliku</h1>');
        response.end();
      }

    });

  }

  // Wyświetlamy jeden odstęp.
  console.log();



  // Pobieramy URL
  var requestUrl = request.url;
  console.log('URL: ' + requestUrl);

  // Pobieramy ścieżkę (tzw. pathname) z URL zapytania.
  var pathname = url.parse(request.url)['pathname'];
  console.log('Pathname: ' + pathname);




  // OBSŁUGA ZAPYTAŃ AJAX'owych
  // --------------------------
  
  // Czy przyszlo żądanie o kawy.
  if (pathname === '/coffees') {
    
    // Pobieramy z zapytania obiekt z listą dodatków.
    var addonsObject = url.parse(request.url, true)['query']; 
    console.log();
    console.log('Obiekt z dodatkami, przysłany AJAXem');
    console.log(addonsObject);

    // Przygotowujemy pustą tablicę.
    // Wypełnimy ją obiektami dodatków.
    // Listę tą wykorzystamy do wydobycia kaw z bazy danych.
    var addonList = [];

    // Iterujemy po obiekcie dodatków z URL.
    for (addon in addonsObject) 
    {

      // Jeśli dodatek ma wartość true (czyli checkboks danego dodatku został zaznaczony),
      // dodajemy go do listy. 
      if (addonsObject[addon] === 'true') 
      {
        // Budujemy kryterium zapytania do bazy, które czytamy tak:
        // Znajdź kawę która ma dodatek o nazwie addon.
        var singleCriterium = {"addons.name": addon};

        // Dodajemy kryterium do listy kryteriów.
        addonList.push(singleCriterium);
      }
    }
    console.log();
    console.log('Lista dodatków:');
    console.log(addonList);

    // Zwykła, niezobowiązująca deklaracja obiektu zapytania.
    var query;

    // Sprawdzamy, czy lista kryteriów nie jest pusta.
    // Jeśli będzie pusta, oznacza to, że przychodzące zapytanie
    // nie posiada żadnych parametrów w URL. A to z kolei oznacza,
    // że użytkownik nie zaznaczył żadnego checkboksa dodatku.
    // Ok, jeśli lista ktyteriów jest pusta, konstruujemy zapytanie,
    // które zwróci te dokumenty (kawy), które nie mają elementu
    // 'addons'. Wykorzystujemy do tego operator $exists.
    if (addonList.length === 0) 
    {
      query = { 
        addons: { 
          $exists: true 
        } 
      };
    }
    else 
    {
      // Jeśli na liście kryteriów znajdują się jakieś elementy,
      // formuujemy zapytanie w inny sposób.
      // Budujemy zapytanie wykorzystując operator $and i listę kryteriów.
      // Stosując operator $and, mówimy bazie, żeby zwróciła
      // kawy, które mają KAŻDY dodatek z listy dodatków.
      // Innymi słowy np.: I pianę I syrop I jebaną cytrynę.
      query = { 
        $and: addonList 
      };
    }

    // Posiadamy teraz obiekt zapytania. 
    // Możemy go śmiało wykorzystać do wydobycia dokumentów 
    // z bazy danych, z kolekcji recipies.
    db.recipies.find(query, function (error, documents) {

      // Przygotowujemy obiekt JSON.
      var data;


      // Sprawdzamy, czy przy wykonywaniu zapytania nie wystapil blad.
      if (error) 
      {
        // Jeśli wystąpił błąd, w odpowiedzi JSON'owej zwracamy
        // krótki string: 'error'.
        data = { result: 'error' };

        console.log('Wystąpił błąd zapytania do bazy danych.');
        return;
      } 
      else 
      {
        console.log();
        console.log('Wyniki zapytania:');
        console.log(documents);
      }


      // Jeśli okazuje się że lista zwroconych kaw jest pusta,
      // zwracamy w odpowiedzi JSON z wartoscia false.
      if (documents.length === 0)
      {
        data = { result: false };
      }
      else 
      {
        // Jeśli jednak baza zwróciła niepustą listę wyników:
        data = { result: documents };
      }

      // Przekształcamy go na string gotowy do odesłania przeglądarce.
      var jsonData = JSON.stringify(data);
      console.log();
      console.log('Dane JSON do wysłania:');
      console.log(jsonData);


      // Wysyłamy przeglądarce odpowiedź.
      response.writeHead(200, {'content-type': 'application/json'});
      response.write(jsonData);
      response.end();

    });

  } else {

    // Pobieramy z URL nazwę pliku za pomocą metody basename z modułu path.
    // czyli przykładowo ze ścieżki: /to/jest/sciezka/do/plik.txt 
    // zwrocona nazwa pliku mialaby postac: plik.txt.

    //var fileName = path.basename(requestUrl);
    var fileName = requestUrl.substring(1, requestUrl.length);

    // Jeśli ścieżką było: / ustalamy, że żądano pliku index.html.
    if (requestUrl === '/') {
      fileName = 'index.html';
    }
    console.log("Nazwa pliku: " + fileName);



    // Teraz możemy radośnie załadować nasz plik.
    loadFile(fileName);

  }

}


// Tworzymy obiekt serwera.
var server = http.createServer(serverCallback);

// Uruchamiamy serwer nasłuchując na porcie 3000.
server.listen(3000);

console.log('Serwer działa i słucha na porcie 3000');


