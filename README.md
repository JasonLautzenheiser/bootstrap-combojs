# Bootstrap ComboJS

As many others before me, we needed a good combobox js component for a project at work.  We found many good ones, but none that completely fit the bill.  One of the closest
was bootstrap-combobox by Daniel Farrell.  It had most of what we needed but there was one main issue;  **It was no longer being maintained.  Pull requests were no longer being accepted and we needed a few changes more immediately.  There are many forks, but none contained what we completely needed and the changes were a bit scattered across many forks.**

We could have created another fork and in fact I did at first, but forks tend to get lost here on GitHub (and there are over 250 of the main project) and a lot of great improvements tend to get lost.  o
I decided to create a new repository, rewrite some of the code and start adding features.  This repo is the result of that.

Full credit goes to [Daniel Farrell](https://github.com/danielfarrell/bootstrap-combobox) for much of this code, ideas and design.  I've made many improvements and will continue to do so, but his version is very functional and will serve the purposes for many.

## How to use it

The dependencies are the Bootstrap stylesheet(CSS).  Include it and then the stylesheet(CSS) and javascript.

Then just activate the plugin on a normal select box(suggest having a blank option first):

    <select class="combo">
      <option></option>
      <option value="PA">Pennsylvania</option>
      <option value="CT">Connecticut</option>
      <option value="NY">New York</option>
      <option value="MD">Maryland</option>
      <option value="VA">Virginia</option>
    </select>

    <script type="text/javascript">
      $(document).ready(function(){
        $('.combo').combojs();
      });
    </script>

### Callbacks

All public methods include an optional parameter for a callback function that can be called.

    $("#testID").combojs("loaditems", ['january', 'february', 'march', 'april', 'may', 'june', 'july'], function() {alert('Hi Adam');});

### Options

When activating the plugin, you may include an object containing options for the combobox

    $('.combo').combojs({fullWidthMenu: true});

 `allowEnterToOpen`: if `true` enter will open the dropdown, false will not.  Default to `false`

 `allowEscapeToClose`: if `true` escape will close the dropdown, false will not.  Default to `true`
 
 `animation`: if `true` then the popup is animated with slideDown and slideUp, default to `false`
 
 `animationDuration`: duration of animation, defaults to 400 (milliseconds)

 `clearElementOnOpen`: this will allow you to customize the behavior on open of combo.  `true` will clear the element, then open, `false` will open it as is (filtered to the current entry), defaults to `false`

 `fullWidthMenu`: if `true` the dropdown menu will be the full width of the input.  Defaults to `true`

 `hideDisabled`: if `true` then disabled options will be hidden from the dropdown.  Defaults to `false`
 
 `highlighter`: Custom function for highlighting an `item`. Defaults to bolding the query within a matched item

 `item`: Custom markup for the dropdown menu list items.

 `matcher`: Custom function with one `item` argument that compares the item to the input. Defaults to matching on the query being a substring of the item, case insenstive

 `menu`: Custom markup for the dropdown menu list element.

 `newOptionsAllowed`: if `true` the control will allow options that are not valid options in the dropdown.  Defaults to `false`

 `openOnElementClick`: if `true` the dropdown menu will appear when clicking on the input box.  Defaults to `true`

 `placeholder`: Set the placeholder attribute of the input box, removed the `data-placeholder`  Defaults to an empty string.

 `sorter`: Custom function that sorts a list `items` for display in the dropdown

 `template`: Custom function that returns markup for the combobox.

 
You may also include these options as data- options on the select element

    <select class="combo" data-fullwidthmenu='true' data-openonelementclick='true'>
      <option></option>
      <option value="PA">Pennsylvania</option>
      <option value="CT">Connecticut</option>
      <option value="NY">New York</option>
      <option value="MD">Maryland</option>
      <option value="VA">Virginia</option>
    </select>


### API

    $('.combo').combojs('toggle');  
    $('.combo').data("combojs").toggle();  
    

###### Clear
Removes any selected value from dropdown or textbox.

    $('.combo').combojs("clear");
    
##### Disable
disables the menu

    $('.combo').combojs("disable");

##### Enable
enables the menu

    $('.combo').combojs("enable");

##### Focus
set focus to the combo textbox

    $('.combo').combojs("focus");

##### FocusAndSelect
set focus to the combo textbox and select all the text.

    $('.combo').combojs("focusAndSelect");


##### Hide
Hides the dropdown if it's shown.

    $('.combo').combojs("hide");


##### Load Items
Load an array of items into the combobox, removing anything previously there.

    $('.combo').combojs('loaditems', ['January', 'February', 'March', 'April']);

##### Refresh
refresh the combo

    `$('.combobox').combojs('refresh');`


##### Remove
Removes items from the list:
* no parameter, remove all items:

  `$('.combobox').combojs('remove');`
    
* number parameter, remove that index of item in list (starting at 1): 

  `$('.combobox').combobox('remove',2);`

  
* number array, remove the items in the dropdown that match the indexes of items in the array

  `$('.combobox').combobox('remove',[2,3]);`


##### setValue
Set the value of the combo to the passed in value.

    $('.combobox').combobox('setValue', 'option1');    

##### show
Shows the dropdown if it's not already visible.

    $('.combobox').combobox('show');    


##### Toggle
Toggles between showing and hiding the dropdown menu

    $('.combo').combojs("toggle");
    
##### Values 
Returns the values of the combobox as an array.

    $('.combo').combojs("values", function(values) {alert(values.length);});
 
## Dependencies
Uses the latest 1.X version of jQuery and the 3.X of bootstrap.




