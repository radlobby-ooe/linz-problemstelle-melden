# linz-problemstelle-melden
Location picker based on OpenStreetMap / OpenLayers v6 for getting user input on a specific geolocation. Based on several public OpenLayers examples found in the web.

This web application is used by http://linz.radlobby.at at, you can see it live at https://www.radlobby.at/linz/problemstelle-melden

It displays a map and allows the user to pick a location. The user can open a google form which will get the picked position pre-filled or mail the position with custom text with associated default mail application.  

We did not focus on parametrizing/generalize the application for very very easy re-use. Maybe you can re-use it, but you might have to understand what happens in the source files and have to compile the application with https://www.npmjs.com/  

## Build: ##
 
The files described in `Source files` section below are source files. They can **not** used directly!

You have to install https://www.npmjs.com/ and compile it with npm tool to use them.

First please understand what happens in the source files, then **adapt the source files for your requirements**, see specific descriptions.   

Finally to build, open a shell in the main folder and execute the following commands:  

```
npm install
npm ci
npm run build 
```

This will compile the files and create files to use in a dist folder, e.g.

```
index.html
list.965e45c7.png
list-g-f.160661f5.png
mail.da9586d1
main.3f84e912.css
main.9987b0b0.js
data/poi.png
```

These files are your compiled web application. index.html is the entry page, it uses the other javascript, css and icon files with the scrambled names.

## Source files:

### index.html + button-icons

index.html is the page with an element where the map will be rendered.

It registers for callbacks pickerSet/pickerUnset to display/hide buttons.

Click on buttons will get picker location (if set) and call two Google forms with parameter for picked location. We used an option to pre-fill the google form with an URL parameter, search the web for `fill Google Forms with URL parameters` how to do this. 
 
3rd Option: Send mail with picked location.
You have to customize you URLs of Google Forms + texts there.

Contains some special handling, e.g. open form page in new window on mobile web browsers (Google forms with images will not be displayed e.g. in HTML iframes).

Uses 3 button icons stored in assets subfolder.
 
### main.json

OpenLayers Map. You can customize initial map position in section where map is defined:

```
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }) , vectorLayer ],
  target: 'map',
  view: new View({
    center: fromLonLat([14.28611, 48.30639]),
    zoom: 14,
  }),
});
```

Picker image is stored in dist/data/poi.png. You can customize it in section:

```
var iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    width: "38",
    height: "24",
    src: 'data/poi.png',
  }),
});
```

### package.json

Imports OpenLayers v6. See https://parceljs.org/ if you want to understand it. 

### dist/data/poi.png

The icon for the picker. See main.json description above.

