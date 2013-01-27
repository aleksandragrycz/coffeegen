$(document).ready(function () {

  // Najpierw przygotowujemy zmienne przechowujące obiekty jQuery
  // odnoszące się do checkboksów (dodatków do kawy).
  var creamCheckbox = $('#cream');
  var foamCheckbox  = $('#foam');
  var syropCheckbox = $('#syrop');
  var hotMilkCheckbox = $('#hotmilk');
  var steamedMilkCheckbox = $('#steamedmilk');
  var lemonCheckbox = $('#lemon');
  var hotWaterCheckbox = $('#hotwater');
  var chocoSyropCheckbox = $('#chocosyrop');
  var iceCreamCheckbox = $('#icecream');
  var whiskyCheckbox = $('#whisky');



  // Funkcja wywoływana kiedy użytkownik kliknie w checkboks 
  // dodatku do kawy (np. Bita śmietana).
  function sendCoffeeRequest() {

    // Funkcja, która przyjmuje jako parametr nazwę dodatku,
    // sprawdza czy korespondujący checkbox jest zaznaczony
    // i zwraca true, jeśli jest zaznaczony 
    // lub false, jeśli nie jest.
    function check(addonName) {
      // Tworzymy selektor dla checkboksa odpowiadającego
      // nazwie dodatku przekazanej jako parametr funkcji
      // (np. dla cream mamy #cream).
      var checkboxSelector = '#' + addonName;
      // Tworzymy zmienną przechowującą obiekt jQuery 
      // odnoszący się do danego checkboksa.
      var checkbox = $(checkboxSelector);
      // Sprawdzamy czy checkbox posiada atrybut 'checked'.
      // Jeśli checkbox posiada taki atrybut, będzie to oznaczało,
      // że checkbox jest zaznaczony. W przeciwnym wypadku,
      // poniższa zmienna będzie równa 'undefined', co oznacza,
      // że checkbox nie jest zaznaczony.
      var checked = checkbox.attr('checked');
      if (checked !== undefined) {
        // Checkbox jest zaznaczony.
        return true;
      } else {
        // Checkbox nie jest zaznaczony.
        return false;
      }
    }

    // Funkcja przyjmuje objekt reprezentujący pojedynczą 
    // kawę, a zwraca objekt jQuery reprezentujący 
    // pojedynczy element listy w pojemniku na kawy.
    //
    // Utworzony element listy ma postać:
    //
    // <li id="espresso">
    //  <div class="image"></div>
    //  <p>Espresso</p>
    // </li>
    function createCoffeeListElement(coffeeObject) {
      // Tworzymy objekt paragrafu, wypełniamy go treścią
      // (nazwą kawy - patrz przykład u góry).
      var p = $('<p></p>');
      p.text(coffeeObject['name']);
      // Tworzymy objekt div, ustawiając jako atrybut klasy
      // wartość 'image' (ponownie - patrz przykład u góry).
      var div = $('<div></div>', { class: 'image' });
      // Tworzymy element listy i ustawiamy mu atrybut
      // id o wartości równej nazwie kawy.
      var li  = $('<li></li>', { id: coffeeObject['name'] });
      // Zagnieżdżamy div wewnątrz li.
      li.append(div);
      // Zagnieżdżamy p wewnątrz li.
      li.append(p);
      // Po serii zagnieżdżeń otrzymujemy taki element jak 
      // w komentarzu nad funkcją.

      // Zwracamy obiekt elementu listy.
      return li;
    }

    // Funkcja wykonywana po otrzymaniu odpowiedzi z serwera
    // na żądanie AJAX'owe. Parametr data zawiera dane zwrócone
    // z serwera.
    function gotCoffees(data) {
      // Pobieramy listę kaw otrzymaną z serwera.
      var coffeeList = data['result'];

      // Lista kaw na stronie.
      var ul = $('#content ul');

      // Czyścimy listę kaw na stronie z elementów które tam teraz są.
      ul.empty();

      // Dla każdego obiektu kawy tworzymy element listy <li>
      // a następnie dodajemy go do listy na stronie.
      for (var i = 0; i < coffeeList.length; i++) {
        var coffee = coffeeList[i];
        var coffeeListElement = createCoffeeListElement(coffee);
        coffeeListElement.hide();
        ul.append(coffeeListElement);
        coffeeListElement.fadeIn('slow');
      }

    }
    // Tworzymy objekt, który ostatecznie wyślemy do serwera.
    // Jest to objekt przechowujący elementy postaci 
    // nazwa-dodatku : wartość-logiczna
    // gdzie wartość-wartość logiczna to true lub false
    // w zależności od tego, czy checkbox jest zaznaczony czy nie.
    var addons = {
      cream: check('cream'),
      foam:  check('foam'),
      syrop: check('syrop'),
      steamedmilk: check('steamedmilk'),
      icecream : check('icecream'),
      hotwater: check('hotwater'),
      chocosyrop: check('chocosyrop'),
      hotmilk: check('hotmilk'),
      whisky: check('whisky'),
      lemon: check('lemon')
    }

    // Wyświetlenie kontrolne w konsoli chrome objektu.
    console.log(addons);

    // URL pod który zostanie wysłane zapytanie AJAX'owe
    // z żądaniem zwrócenia kaw odpowiadających danym 
    // z objektu addons.
    var url = '/coffees';
    

    $.getJSON(url, addons, gotCoffees);

  }

  $('#left input').click(sendCoffeeRequest);


  // Moje moje moje moje moje moje moje moje moje


    function Rotation(){ 
          $('#top img').transition({rotate: '80deg'}, 2000);
          $('#top img').transition({rotate: '-10deg'}, 1000);
    }

    $('#top img').mouseenter(Rotation);

    //Czyszczenie checkboxów

    function CleanCheckbox(){
      $('#left input').each(function(index, input) {

            if ($(input).attr('checked') && !$(input).attr('disabled'))
            {
            $(input).removeAttr('checked');
            }

      });
    }

    $('#clean').click(CleanCheckbox);

});
