$(document).ready(function () {

  // Wczytujemy podstawowe kawy jak tylko strona się wyświetli.
  sendCoffeeRequest();

  // Najpierw przygotowujemy zmienne przechowujące obiekty jQuery
  // odnoszące się do checkboksów (dodatków do kawy).
  var creamCheckbox = $('#cream');
  var foamCheckbox  = $('#foam');
  var syropCheckbox = $('#syrop');
  var hotMilkCheckbox = $('#hotmilk');
  var steamedMilkCheckbox = $('#steamedmilk');
  var lemonCheckbox = $('#lemon');
  var chocoSyropCheckbox = $('#chocosyrop');
  var iceCreamCheckbox = $('#icecream');
  var whiskyCheckbox = $('#whisky');



  // Funkcja wywoływana kiedy użytkownik kliknie w checkboks 
  // dodatku do kawy (np. Bita śmietana).
  function sendCoffeeRequest() {
    
      $('#coffees').siblings().hide();
      $('#coffees').fadeIn();

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


      function createCoffeeTableElement(coffeeObject) {

      var addons_names = {
        'foam': 'Piana mleczna',
        'steamedmilk': 'Spienione mleko',
        'lemon': 'Cytryna',
        'chocosyrop': 'Syrop czekoladowy',
        'syrop': 'Syrop',
        'cream': 'Bita śmietana',
        'hotmilk': 'Gorące mleko',
        'hotwater': 'Gorąca woda',
        'icecream': 'Lody waniliowe',
        'whisky': 'Whisky'
      };

      var p_name = $('<p></p>');
      p_name.text(coffeeObject['name']);

      var p_capacity = $('<p></p>');
      p_capacity.text(coffeeObject['capacity'] + ' ml');

      var img = $('<img />', {src: 'cups/' + coffeeObject['name'].replace(/\s/g, '_') + '.png', alt: 'coffee'});

      var td_name = $('<td></td>');
      var td_capacity = $('<td></td>');
      var td_img = $('<td></td>');

      //var addonsList = $('<img />', {src: 'icons/' + coffeeObject['addons'] + '.png', alt: 'icon'});
      var td_addonsList = $('<td></td>');
      var tr = $('<tr></tr>');
      var bean_img = $('<img />', {src: 'icons/bean.png', alt: 'ico', title: 'Espresso: ' + coffeeObject['espresso']});

      td_addonsList.append(bean_img);
       
      //console.log(coffeeObject);
      //console.log(coffeeObject['addons']);

      if (coffeeObject['addons']) {

          for (var i=0; i < coffeeObject['addons'].length; i++){
          var addon_name = coffeeObject['addons'][i].name;
          var addon_img = $('<img />', {src: 'icons/' + addon_name + '.png', alt: 'ico', title: addons_names[addon_name] + ':  ' + coffeeObject['addons'][i].amount});
          td_addonsList.append(addon_img);
          
      }


      
      //console.log(coffeeObject.addons[i].name);
      }


      td_img.append(img);
      td_name.append(p_name);
      td_capacity.append(p_capacity);
      //td_addonsList.append(addonsList);

      tr.append(td_img);
      tr.append(td_name);
      tr.append(td_addonsList);
      tr.append(td_capacity);

      return tr;
    }

    // Funkcja wykonywana po otrzymaniu odpowiedzi z serwera
    // na żądanie AJAX'owe. Parametr data zawiera dane zwrócone
    // z serwera.
    function gotCoffees(data) {
      // Pobieramy listę kaw otrzymaną z serwera.
      var coffeeTable = data['result'];

      // Lista kaw na stronie.
      var table = $('#coffees table');

      // Czyścimy listę kaw na stronie z elementów które tam teraz są.
      table.empty();

      // Dla każdego obiektu kawy tworzymy element listy <li>
      // a następnie dodajemy go do listy na stronie.
      for (var i = 0; i < coffeeTable.length; i++) {
        var coffee = coffeeTable[i];
        var coffeeTableElement = createCoffeeTableElement(coffee);
        coffeeTableElement.hide();
        table.append(coffeeTableElement);
        coffeeTableElement.fadeIn('slow');
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
      chocosyrop: check('chocosyrop'),
      hotmilk: check('hotmilk'),
      whisky: check('whisky'),
      lemon: check('lemon')
    }

    // Wyświetlenie kontrolne w konsoli chrome objektu.
    //console.log(addons);

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
      //Czyścimy tablice kaw po odhaczeniu checboxów
    }

    //wywołanie funkcji po kliknięciu buttona
    $('#clean').click(function(){
      CleanCheckbox();
      sendCoffeeRequest();
    });


    //Wymiana divów w zależności od akcji
    function changeDiv(event){
      $('#content div:visible').fadeOut(
        function(){
        var zmienna = $(event.currentTarget);
        console.log(zmienna);
        var dodatkowa = zmienna.attr('id').replace('Button', '');
        console.log(dodatkowa);
        var trzecia = $('#' + dodatkowa);
        trzecia.fadeIn();
        //CleanCheckbox();
        });
    }

    $('.ButtonClick').click(changeDiv);

});
