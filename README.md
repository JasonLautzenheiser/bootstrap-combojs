# Bootstrap ComboJS

As many others before me, we needed a good combobox js component for a project at work.  We found many good ones, but none that completely fit the bill.  One of the closest
was bootstrap-combobox by Daniel Farrell.  It had most of what we needed but there was one main issue;  **It was no longer being maintained.  Pull requests were no longer being accepted and we needed a few changes more immediately.  There are many forks, but none contained what we completely needed and the changes were a bit scattered across many forks.**

We could have created another fork and in fact I did at first, but forks tend to get lost here on GitHub (and there are over 250 of the main project) and a lot of great improvements tend to get lost.  o
I decided to create a new repository, rewrite some of the code and start adding features.  This repo is the result of that.

Full credit goes to Daniel Farrell for much of this code, ideas and design.  I've made many improvements and will continue to do so, but his version is very functional and will serve the purposes for many.

## How to use it

The dependencies are the Bootstrap stylesheet(CSS).  Include it and then the stylesheet(CSS) and javascript.

Then just activate the plugin on a normal select box(suggest having a blank option first):

    <select class="combobox">
      <option></option>
      <option value="PA">Pennsylvania</option>
      <option value="CT">Connecticut</option>
      <option value="NY">New York</option>
      <option value="MD">Maryland</option>
      <option value="VA">Virginia</option>
    </select>

    <script type="text/javascript">
      $(document).ready(function(){
        $('.combobox').combobox();
      });
    </script>

### Options

When activating the plugin, you may include an object containing options for the combobox

    $('.combobox').combobox({bsVersion: '2'});

 `menu`: Custom markup for the dropdown menu list element.

 `item`: Custom markup for the dropdown menu list items.

 `matcher`: Custom function with one `item` argument that compares the item to the input. Defaults to matching on the query being a substring of the item, case insenstive

 `sorter`: Custom function that sorts a list `items` for display in the dropdown

 `highlighter`: Custom function for highlighting an `item`. Defaults to bolding the query within a matched item

 `template`: Custom function that returns markup for the combobox.

 `openOnElementClick`: if `true` the dropdown menu will appear when clicking on the input box.  Defaults to `false`

 `fullWidthMenu`: if `true` the dropdown menu will be the full width of the input.  Defaults to `false`
 
 `placeholder`: Set the placeholder attribute of the input box, removed the `data-placeholder`  Defaults to an empty string.

 `bsVersion`: Version of bootstrap being used. This is used by the default `template` function to generate markup correctly. Defaults to '3'. Set to '2' for compatibility with Bootstrap 2

## Dependencies
Uses the latest 1.X version of jQuery and the 3.X of bootstrap.

## Live Example

### Bootstrap 2.0 Version
http://dl.dropbox.com/u/21368/bootstrap-combobox/index.html

### Bootstrap 3.0 Version
http://bootstrap-combobox-test.herokuapp.com/
