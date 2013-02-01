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
var collections = ['recipes'];

// Obiekt służący do wykonywania zapytań.
var db = mongojs(databaseName, collections);





// Funkcja zwracająca content type na podstawie rozszrerzenia pliku.
function getContentType(fileName) {

  var contentTypes = {
     '.css': 'text/css',
      '.js': 'text/javascript',
     '.ico': 'image/vnd.microsoft.icon',
    '.html': 'text/html',
     '.png': 'image/png'
  }; 
  var extension = path.extname(fileName);
  // console.log('Rozszerzenie pliku: ' + extension);
  
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
      // console.log('Content-type: ' + contentType);

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
  // console.log('URL: ' + requestUrl);

  // Pobieramy ścieżkę (tzw. pathname) z URL zapytania.
  var pathname = url.parse(request.url)['pathname'];
  // console.log('Pathname: ' + pathname);



  // -------------------------------------------------------------------------------
  // OBSŁUGA ZAPYTAŃ AJAX'owych
  // -------------------------------------------------------------------------------
  

  // Czy przyszlo żądanie o kawy.
  if (pathname === '/coffees') 
  {
    // Elegancko oddzielamy jedno zapytanie od drugiego za pomocą efektownej linii.
    // Dzięki temu debugowanie w konsoli staje się przyjemnością.
    console.log("\n ==============================================================");
    

    // ------------------------------------------------------------------------------
    // ETAP POBIERANIA DANYCH Z ZAPYTANIA
    // ------------------------------------------------------------------------------


    // Za pomocą metody parse z modułu url, parsujemy URL i uzyskujemy obiekt,
    // którego pola zawierają wszystkie informacje o częściach URL.
    // Dokumentacja modułu url i metody parse znajduje się tutaj: 
    // http://nodejs.org/api/url.html
    // ------------------------------------------------------------------------------
    var urlData = url.parse(request.url, true);
    
    // Wyświetlamy powyższy obiekt, uzyskany na drodze parsowania URL.
    // ------------------------------------------------------------------------------
    // console.log("\nObiekt urlData - wynik parsowania URL:\n");
    // console.log(urlData);

    // Spośród wszystkich pól powyższego obiektu, interesuje nas tylko jedno.
    // Jest to pole query, w którym przechowywany jest obiekt przygotowany 
    // w skrypcie i przesłany na drodze zapytania Ajaksowego.
    // ------------------------------------------------------------------------------
    var criteria = urlData.query; 

    // Wyświetlamy obiekt criteria, niejako odtworzony w postaci takiej, w jakiej 
    // wysłany został Ajaksem.
    // ------------------------------------------------------------------------------
    // console.log("\nObiekt z kryteriami, przysłany Ajaksem:\n");
    // console.log(criteria);


    // ------------------------------------------------------------------------------
    // ETAP PRZYGOTOWYWANIA ZAPYTANIA
    // ------------------------------------------------------------------------------


    // Przygotowujemy tablicę addonList, którą wypełnimy obiektami postaci:
    // { "addons.name": nazwa-dodatku }
    // ------------------------------------------------------------------------------
    var addonList = [];

    // Przygotowujemy też tablicę capacityList, którą wypełnimy obiektami postaci:
    // { "capacity": pojemnosc }
    // ------------------------------------------------------------------------------
    var capacityList = [];
    
    // Dla każdego elementu w obiekcie criteria sprawdzamy czy opisuje on kryterium
    // dodatku czy też kryterium pojemności. Łatwo je rozróżnić, ponieważ nazwy 
    // kryteriów pojemności zaczynają się od 'capacity'.
    // W poniższej pętli zmienna 'c' reprezentuje klucz w parze klucz:wartosc
    // pojedynczego kryterium.
    // ------------------------------------------------------------------------------
    for (c in criteria) 
    {

      // Jeśli nazwa kryterium zaczyna się od 'capacity', to znaczy że kryterium 
      // dotyczy pojemności, np. 'capacity90'.
      // ----------------------------------------------------------------------------
      if (c.substring(0, 8) === 'capacity') 
      {

        // Sprawdzamy, czy dane kryterium ma zostać uwzględnione przy wyszukiwaniu
        // kaw w bazie danych.
        // O tym, czy dodajemy dane kryterium do listy czy nie, decyduje 
        // wartość true lub false, odpowiadająca temu kryterium w obiekcie przysłanym
        // Ajaksem.
        // --------------------------------------------------------------------------
        if (criteria[c] === 'true')
        {

          // Z nazwy kryterium wydobywamy wartość pojemności.
          // Przykładowo, z nazwy 'capacity90' wyciągamy '90'.
          // ------------------------------------------------------------------------
          var capacityValue = c.replace('capacity', '');

          // Powyższa wartość jest stringiem, a my potrzebujemy liczby.
          // Poniżej parsujemy string na liczbę w systemie dziesiętnym.
          // ------------------------------------------------------------------------
          var capacityValueNumber = parseInt(capacityValue, 10);

          // Do listy kryteriów pojemności dodajemy łańcuch reprezentujący pojemność.
          // ------------------------------------------------------------------------
          capacityList.push(capacityValueNumber);
        }

      }
      // Jeśli nazwa kryterium nie zaczyna się od 'capacity', znaczy to że mamy 
      // do czynienia z kryterium dotyczącym dodatku do kawy.
      // ----------------------------------------------------------------------------
      else 
      {

        // Nazwa dodatku to klucz danego kryterium.
        // Przykład: 
        // syrop: true
        // --------------------------------------------------------------------------
        var addonName = c;

        // Jeśli kryterium dodatku do kawy ma zostać uwzględnione w wyszukiwaniu.
        // --------------------------------------------------------------------------
        if (criteria[c] === 'true')
        {
          // Budujemy obiekt reprezentujący kryterium dodatku zapytania do bazy, 
          // które czytamy tak: 
          // "Znajdź kawę, która na liście dodatków ma dodatek o nazwie addonName".
          // 
          // Przykład: { "addons.name" : "syrop" }
          // ------------------------------------------------------------------------
          var singleAddonName = { "addons.name": addonName };

          // Do listy kryteriów pojemności dodajemy właśnie utworzony obiekt.
          // ------------------------------------------------------------------------
          addonList.push(singleAddonName);
        } 
      }

    } // koniec pętli for


    // Kontrolnie wyświetlamy obie listy kryteriów - dla dodatków i pojemności.
    // ------------------------------------------------------------------------------
    console.log("\nLista pojemnosci:\n");
    console.log(capacityList);
    console.log("Lista dodatków:\n");
    console.log(addonList);


    // ------------------------------------------------------------------------------
    // ETAP BUDOWY ZAPYTANIA
    // ------------------------------------------------------------------------------


    // Zwykła, niezobowiązująca deklaracja obiektu zapytania.
    // ------------------------------------------------------------------------------
    var query;

    // Sprawdzamy, czy lista kryteriów dodatków jest puste. Jeśli tak, oznacza to, 
    // że przychodzące zapytanie nie posiada żadnych parametrów w URL. 
    // To oznacza, że użytkownik nie zaznaczył żadnego checkboksa dodatku.
    // W tej sytuacji, zwracamy te kawy, które nie mają elementu 'addons', albo mają
    // jako dodatek gorącą wodę ('hotwater').
    // Do sprawdzenia, czy kawa ma klucz 'addons', wykorzystamy operator $exists.
    // ------------------------------------------------------------------------------
    if (addonList.length === 0) 
    {

      query = { 
        $and: [
          { $or: [ { addons: { $exists: false } }, { "addons.name": 'hotwater'} ] },
          { capacity: { $in: capacityList } } 
        ] 
      };

      // Kontrolnie wyświetlamy utworzony obiekt zapytania.
      // ----------------------------------------------------------------------------
      console.log("\nZapytanie: \n");
      console.log(JSON.stringify(query));

    }
    else 
    {
      // Jeśli na liście kryteriów dodatków znajdują się jakieś elementy, budujemy 
      // zapytanie wykorzystując operator $and i listę kryteriów. 
      // Stosując operator $and, mówimy bazie, żeby zwróciła kawy, które mają KAŻDY 
      // dodatek z listy dodatków.
      // Innymi słowy np.: I pianę I syrop I jebaną cytrynę.
      // ----------------------------------------------------------------------------
      query = { 
        $and: [
          { $and: addonList },
          { capacity: { $in: capacityList }}
        ]
      };

      // Kontrolnie wyświetlamy utworzony obiekt zapytania.
      // ----------------------------------------------------------------------------
      console.log("\nZapytanie: \n");
      console.log(JSON.stringify(query));
    }


    // ------------------------------------------------------------------------------
    // ETAP WYKONANIA ZAPYTANIA
    // ------------------------------------------------------------------------------


    // Posiadamy teraz obiekt zapytania. 
    // Wykonujemy więc zapytanie, w odpowiedni sposób obsługując odpowiedź MongoDB,
    // za pomocą funkcji callbackowej.
    // ------------------------------------------------------------------------------
    db.recipes.find(query, function (error, documents) {

      // Przygotowujemy obiekt JSON.
      // ----------------------------------------------------------------------------
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

      // Jeśli okazuje się że lista zwroconych kaw jest pusta,
      // zwracamy w odpowiedzi JSON z wartoscia false.
      if (documents.length === 0)
      {
        data = { result: 'false' };
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

  } else if (pathname === '/all-coffees') {
    
    db.recipes.find(function (error, documents) {
      var data;
      
      if (error) {
        data = { result: 'error' };
        return;
      }

      if (documents.length === 0) {
        data = { result: 'false' };
      } else {
        data = { result: documents };
      }

      var jsonData = JSON.stringify(data);
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
    if (requestUrl === '/') 
    {
      fileName = 'index.html';
    }
    // console.log("Nazwa pliku: " + fileName);



    // Teraz możemy radośnie załadować nasz plik.
    loadFile(fileName);

  }

}


// Tworzymy obiekt serwera.
var server = http.createServer(serverCallback);

// Uruchamiamy serwer nasłuchując na porcie 3000.
server.listen(3000);

console.log('Serwer działa i słucha na porcie 3000');


