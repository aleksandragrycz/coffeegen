$(document).ready(function () {


  var coffeeTable;
  //Wywołanie funkcji po załadowaniu strony (puste zapytanie - podstawowe kawy)
  sendCoffeeRequest();

  // Zmienne z dodatkami checkboxów
  var creamCheckbox = $('#cream');
  var foamCheckbox  = $('#foam');
  var syropCheckbox = $('#syrop');
  var hotMilkCheckbox = $('#hotmilk');
  var steamedMilkCheckbox = $('#steamedmilk');
  var lemonCheckbox = $('#lemon');
  var chocoSyropCheckbox = $('#chocosyrop');
  var iceCreamCheckbox = $('#icecream');
  var whiskyCheckbox = $('#whisky');

  // Zmienne z pojemnościami checkboxów
  var capacity90 = $('#c90');
  var capacity145 = $('#c145');
  var capacity160 = $('#c160');
  var capacity250 = $('#c250');


    //Obiekt z polskimi nazwami dodatków
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

      //Funkcja do generowania widoku listy kaw

      function createCoffeeTableElement(coffeeObject) {


      var p_name = $('<p></p>', {class: 'clickMore'});
      p_name.text(coffeeObject['name']);
      // Dodajemy obsługę kliknięcia paragrafu z nazwą kawy
      p_name.click(showCoffee);

      var p_capacity = $('<p></p>');
      p_capacity.text(coffeeObject['capacity'] + ' ml');

      var img = $('<img />', {src: 'cups/' + coffeeObject['name'].replace(/\s/g, '_') + '.png', alt: coffeeObject['name'], class: 'clickMore'});
      // Dodajemy obsługę kliknięcia obrazka
      img.click(showCoffee);

      var td_name = $('<td></td>');
      var td_capacity = $('<td></td>');
      var td_img = $('<td></td>');


      var td_addonsList = $('<td></td>');
      var tr = $('<tr></tr>');
      var bean_img = $('<img />', {src: 'icons/bean.png', alt: 'ico', title: 'Espresso: ' + coffeeObject['espresso']});

      td_addonsList.append(bean_img);


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

  //Funkcja generowania widoku pojedynczej kawy

  function createCoffeeView(coffeeObject) {

      //Podłączamy funkcję powrotu do widoku tabeli z wynikami wyszukiwania z widoku pojedynczej kawy
      var back = $('<div></div>', {id: 'back', title: 'Wróć do listy napojów kawowych'}).click(
      function(){
      //console.log("Back works!");
        $('#coffeeView').fadeOut(
          function(){
            $('#coffees').fadeIn();
          });
      });

      //----------FOTO----------
      //Przygotowujemy element img przekształcając nazwę kawy z bazy danych na nazwę odpowiadającą odpowiedniej grafice
      var img = $('<img />', {src: 'cups/' + coffeeObject['name'].replace(/\s/g, '_') + '_big' + '.png', alt: 'coffee'});
      var picture = $('<div></div>', {id: 'picture'});
      picture.append(back);
      picture.append(img);


      //----------INFO----------
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

      //----------PRZEPIS----------
      var recipe = $('<div></div>', {id: 'recipe'});
      var section_recipe = $('<section></section>');

          for (var i=0; i < coffeeObject['recipie'].length; i++){
          var recipe_text = coffeeObject['recipie'][i];
          var recipe_img = $('<img />', {src: 'icons/step' + [i+1] + '.png'});
          var recipe_p = $('<p>' + recipe_text + '</p>');
          recipe_p.prepend(recipe_img);
          section_recipe.append(recipe_p);
          }

      recipe.append(section_recipe);

      //----------ALL IN ONE----------
      var coffeeView = $('#coffeeView');
      coffeeView.empty();
      coffeeView.append(picture);
      coffeeView.append(info);
      coffeeView.append(recipe);

      return coffeeView;
  }

    //Funkcja interpretująca otrzymaną odpowiedź z servera
    function gotCoffees(data) {

      var table = $('#coffees table');
        
      //Obsługa błędów - błąd servera
      if (data['result'] === 'error') {
        console.log('Błąd servera!!');
        table.empty();

        var p_error=('<p>Nastąpił błąd serwera. Spróbuj ponownie.</p>');

        var tr_error =$('<tr></tr>');
        var td_error=$('<td></td>', {id: 'td_false'});

        td_error.append(p_error);
        tr_error.append(td_error);
        $('#coffees table').append(tr_error);

        // Ukrywamy wszystkie divy rodzeństwa #coffees
        $('#content #coffees').siblings().hide();
        // Pokazujemy samego diva coffees
        $('#content #coffees').show();

      //Obsługa błędów - brak elementów do wyświetlenia (nie spełniają warunków zapytania)
      }else if(data['result'] === false){
        console.log('Nie ma kaw!');

        table.empty();

        var p_false=$('<p>Nie znaleziono napojów kawowych spełniających podane kryteria.</p>');
        var tr_false =$('<tr></tr>');
        var td_false=$('<td></td>', {id: 'td_false'});

        td_false.append(p_false);
        tr_false.append(td_false);
        $('#coffees table').append(tr_false);

        // Pokazujemy samego diva coffees
        $('#content #coffees').show();

      }else{

        // Pobieramy listę kaw otrzymaną z serwera i przypisujemy do zmiennej coffeeTable
        coffeeTable = data['result'];
      
      
        // Ukrywamy wszystkie divy rodzeństwa #coffees
        $('#content #coffees').siblings().hide();
        // Pokazujemy samego diva coffees
        $('#content #coffees').show();
      
      
      // Czyścimy listę kaw na stronie z elementów które tam teraz są (stare zapytania)
      table.empty();

      // Pętla do generowania tabeli z kawami (iteracja po każdej kawie)
      for (var i = 0; i < coffeeTable.length; i++) {
        var coffee = coffeeTable[i];
        var coffeeTableElement = createCoffeeTableElement(coffee);
        coffeeTableElement.hide();
        table.append(coffeeTableElement);
        coffeeTableElement.fadeIn('slow');
      }
      }


    }

  //Funkcja do wysyłania zapytania o wszystkie kawy
  function sendAllCoffeeRequest() {
    
    var url = '/all-coffees';
    $.getJSON(url, gotCoffees);
    //Czyszczenie checkboxów - bo przechodzimy do widoku wszystkich kaw
    CleanCheckbox();
  }

  // Funkcja do wysyłania zapytania (po tym jak użytkownik zaznaczy/odznaczy checkboxa)
  function sendCoffeeRequest() {
    
    $('#coffees').siblings().hide();
    $('#coffees').fadeIn();

    // criteriaName to wspolna nazwa na addony i pojemnosci
    function check(criteriaName) {

      var checkboxSelector = '#' + criteriaName;
      var checkbox = $(checkboxSelector);

      var checked = checkbox.attr('checked');

      if (checked !== undefined) {
        // Checkbox jest zaznaczony
        return true;
      } else {
        // Checkbox nie jest zaznaczony
        return false;
      }
    }

    var criteria = {
      cream:       check('cream'),
      foam:        check('foam'),
      syrop:       check('syrop'),
      steamedmilk: check('steamedmilk'),
      icecream :   check('icecream'),
      chocosyrop:  check('chocosyrop'),
      hotmilk:     check('hotmilk'),
      whisky:      check('whisky'),
      lemon:       check('lemon'),
      capacity90:  check('c90'),
      capacity145: check('c145'),
      capacity160: check('c160'),
      capacity250: check('c250')
    };

    // console.log(criteria);

    var url = '/coffees';
    

    $.getJSON(url, criteria, gotCoffees);

  }

  //Jeśli użytkownik kliknie(zaznaczy) checkboxa wtedy automatycznie wywoływana jest funkcja
  $('#left input').click(sendCoffeeRequest);

  // Śliczna animacja trybika w filiżance z wykorzystaniem dodatku transition
    function Rotation(){ 
          $('#top img').transition({rotate: '80deg'}, 2000);
          $('#top img').transition({rotate: '-10deg'}, 1000);
    }
    //Wywołanie ślicznej funkcji na mouseenter
    $('#top img').mouseenter(Rotation);

    //Funkcja - Czyszczenie checkboxów
    function CleanCheckbox(){
      $('#ing-box input').each(function(index, input) {

            if ($(input).attr('checked') && !$(input).attr('disabled'))
            {
            $(input).removeAttr('checked');
            }
            });

              $('#size-box input').each(function(index, input){
                  $(input).attr('checked', 'checked');
                  console.log("dziala?");
                });
    }

    //wywołanie funkcji po kliknięciu buttona czyszczenia + wywołanie funkcji endCoffeeRequest żeby lista nie została pusta
    $('#clean').click(function(){
      CleanCheckbox();
      sendCoffeeRequest();
    });


    //Wymiana divów w zależności od akcji - górne menu
    //TODO optymalizacja funkcji
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

    //Funkcja wyświetlenia pojedynczej kawy w zależności od wyboru(kliknięcia)
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
            // Jeśli to paragraf, to wyciągamy nazwę
            coffeeName = clickedElement.text();
          }

          console.log(coffeeName);

          //Pętla porównująca nazwę klikniętej kawy do aktualnych kaw w tabeli
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
