$(document).ready(function () {

  // Wczytujemy podstawowe kawy jak tylko strona się wyświetli.
  var coffeeTable;
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


    //Tablica z polskimi tootlipami
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

      function createCoffeeTableElement(coffeeObject) {


      var p_name = $('<p></p>', {class: 'clickMore'});
      p_name.text(coffeeObject['name']);
      // Dodajemy obsługę kliknięcia paragrafu z nazwą kawy.
      p_name.click(showCoffee);

      var p_capacity = $('<p></p>');
      p_capacity.text(coffeeObject['capacity'] + ' ml');

      var img = $('<img />', {src: 'cups/' + coffeeObject['name'].replace(/\s/g, '_') + '.png', alt: coffeeObject['name'], class: 'clickMore'});
      // Dodajemy obsługę kliknięcia obrazka
      img.click(showCoffee);

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
        }


      td_img.append(img);
      td_name.append(p_name);
      td_capacity.append(p_capacity);


      tr.append(td_img);
      tr.append(td_name);
      tr.append(td_addonsList);
      tr.append(td_capacity);

      return tr;
}

 function createCoffeeView(coffeeObject) {

      //wkładamy fotke do diva
      var img = $('<img />', {src: 'cups/' + coffeeObject['name'].replace(/\s/g, '_') + '_big' + '.png', alt: 'coffee'});
      var picture = $('<div></div>', {id: 'picture'});
      picture.append(img);



      //wkładamy informacje do info
      var info = $('<div></div>', {id: 'info'});
      var info_ul = $('<ul></ul>');

      var p_name = $('<p></p>');
      p_name.text(coffeeObject['name']);

      var p_capacity = $('<p></p>');
      p_capacity.text(coffeeObject['capacity'] + ' ml');


      var li_name = $('<li></li>', {title: 'Nazwa napoju'});
      var li_capacity = $('<li></li>', {title: 'Sugerowana pojemność filiżanki'});
      var li_addons = $('<li></li>', {title: 'Składniki napoju'});

      var bean_img = $('<img />', {src: 'icons/bean.png', alt: 'ico', title: 'Espresso: ' + coffeeObject['espresso']});
      var p_bean = $('<p></p>');
      p_bean.text('Espresso: ' + coffeeObject['espresso']*30 + ' ml');
      p_bean.prepend(bean_img);

      li_addons.append(p_bean);
       

        if (coffeeObject['addons']) {

            for (var i=0; i < coffeeObject['addons'].length; i++){
            var addon_name = coffeeObject['addons'][i].name;
            var addon_img = $('<img />', {src: 'icons/' + addon_name + '.png', alt: 'ico', title: addons_names[addon_name] + ':  ' + coffeeObject['addons'][i].amount});
            var addon_p = $('<p></p>');
            addon_p.text(addons_names[addon_name] + ': ' + coffeeObject['addons'][i].amount);
            addon_p.prepend(addon_img);
            li_addons.append(addon_p); 
            }
        }

      li_name.append(p_name);
      li_capacity.append(p_capacity);

      info_ul.append(li_name);
      info_ul.append(li_addons);
      info_ul.append(li_capacity);

      info.append(info_ul);

      //wkładamy przepis do diva
      var recipe = $('<div></div>', {id: 'recipe'});
      var section_recipe = $('<section></section>');

          for (var i=0; i < coffeeObject['recipie'].length; i++){
          var recipe_text = coffeeObject['recipie'][i];
          var recipe_p = $('<p>' + recipe_text + '</p>');
          section_recipe.append(recipe_p);
          }

      recipe.append(section_recipe);


      //składamy wszystko w jednego diva
      var coffeeView = $('#coffeeView');
      coffeeView.empty();
      coffeeView.append(picture);
      coffeeView.append(info);
      coffeeView.append(recipe);


      return coffeeView;
  }

    function gotCoffees(data) {
        
      var table;

      // Pobieramy listę kaw otrzymaną z serwera.
      coffeeTable = data['result'];
      

      // Lista kaw na stronie.
      table = $('#coffees table');
      
      // Ukrywamy wszystkie divy rodzeństwa #coffees
      $('#content #coffees').siblings().hide();
      // Pokazujemy samego diva coffees
      $('#content #coffees').show();
      
      
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

  function sendAllCoffeeRequest() {
    
    var url = '/all-coffees';
    $.getJSON(url, gotCoffees);
    CleanCheckbox();
    console.log('SEND KOFIE RIQEST')

  }

  // Funkcja wywoływana kiedy użytkownik kliknie w checkboks 
  // dodatku do kawy (np. Bita śmietana).
  function sendCoffeeRequest() {
    
    $('#coffees').siblings().hide();
    $('#coffees').fadeIn();


    function check(addonName) {

      var checkboxSelector = '#' + addonName;

      var checkbox = $(checkboxSelector);

      var checked = checkbox.attr('checked');
      if (checked !== undefined) {
        // Checkbox jest zaznaczony.
        return true;
      } else {
        // Checkbox nie jest zaznaczony.
        return false;
      }
    }

    
     

    // Funkcja wykonywana po otrzymaniu odpowiedzi z serwera
    // na żądanie AJAX'owe. Parametr data zawiera dane zwrócone
    // z serwera.
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
    };

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

    function showCoffee(event) {
      
      $('#content div:visible').fadeOut(
        function () {
          // Pobieramy kliknięty element
          var clickedElement = $(event.currentTarget);
          // Pobieramy nazwę klikniętego elementu 
          var tagName = clickedElement[0].tagName;

          // Zmienna na nazwę kawy.
          var coffeeName;

          // Sprawdzamy po nazwie czy kliknęliśmy w img czy w p
          if (tagName === 'IMG') {
            // Jeśli to obrazek pobieramy wartość jego atrybutu 'alt'
            coffeeName = clickedElement.attr('alt');
          } else {
            // Jeśli to paragraf, to nazwa kawy znajduje się pomiedzy tagami <p> i </p>
            coffeeName = clickedElement.text();
          }
          console.log(coffeeName);
          for (var i = 0; i < coffeeTable.length; i++) {
            if (coffeeTable[i].name === coffeeName) {

              createCoffeeView(coffeeTable[i]);
            }
          }

          $('#coffeeView').fadeIn();
        });
    }


    $('#all-coffeesButton').click(sendAllCoffeeRequest);
    $('#adviceButton').click(changeDiv);
    $('#helpButton').click(changeDiv);

    



});
