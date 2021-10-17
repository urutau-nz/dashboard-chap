var cmap = [{"idx" : 0, "label" : "8+ km", "default": 8, "lower" : 8, "upper" : 10, "text" : "white", "fill" : '#440154'},
            {"idx" : 1, "label" : "6-8 km", "default": 6, "lower" : 6, "upper" : 8, "text" : "white", "fill" : '#404387'},
            {"idx" : 2, "label" : "4-6 km", "default": 4, "lower" : 4, "upper" : 6, "text" : "black", "fill" : '#29788E'},
            {"idx" : 3, "label" : "2-4 km", "default": 2, "lower" : 2, "upper" : 4, "text" : "black", "fill" : '#22A784'},
            {"idx" : 4, "label" : "0-2 km", "default": 0, "lower" : 0, "upper" : 2, "text" : "black", "fill" : '#79D151'}]

var cdest = {'1': "#40F", '2': "#FCF000", '3': "#FF5050"}

/* Returns the index of a distance's legend color.
Params:
  d - a decimal distance

Returns:
  Integer - index of color in cmap.
*/
function getColorIndex(d) {
  for (var vi in cmap) {
    if (d >= cmap[vi].lower) return vi;
  }
}
    

/* Returns a distance's legend color.
Params:
  d - a decimal distance

Returns:
  String - hex color
*/
function getColor(d) {
  for (var vi in cmap) {
    if (d >= cmap[vi].lower) 
      return cmap[vi].fill;
  }

  return '#BBB';
}
    
