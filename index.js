module.exports = plugin;

var toFn = require('to-function');

// Goals:
// 1. Default include organization on every page
// 2. Allow the 
// 2. Allow defaults for values to be designated for collections, ex: for articles,
// default fill in the title, type, body, author, etc. from the existing frontmatter
// instead of forcing people to fill that in everytime they write an article.
function plugin(options){
  return function(files, metalsmith, done){
    Object.keys(files).forEach(function(file){
      var data = files[file];
      var jsonLdOutput = [];

      // Set json-ld objects defined in universal defaults.
      if (options.defaults) {
        jsonLdOutput = jsonLdOutput.concat(options.defaults);
      }

      // Set json-ld objects defined for collections.
      var collectionJsonLdObjects = collectionDefaults(data, metalsmith, options);
      jsonLdOutput = jsonLdOutput.concat(collectionJsonLdObjects);

      // Set json-ld objects defined in frontmatter.
      if (data.jsonld) {
        Object.keys(data.jsonld).forEach(function(key) {
          jsonLdOutput.push(data.jsonld[key]);
        });
      }
      data.jsonld = jsonLdOutput;
    });
    done();
  };
}

function fillJsonLdValues(properties, data) {
  var jsonLdOutput = {};
  Object.keys(properties).forEach(function(key) {
    // Take care of schema items, which have literal provided defaults.
    if (key.indexOf('@') !== -1) {
      jsonLdOutput[key] = properties[key];
    }

    // Recurse if there's a nested structure.
    if (typeof properties[key] === 'object') {
      jsonLdOutput[key] = fillJsonLdValues(properties[key], data);
    }

    // Insert information from corresponding frontmatter tags.
    if (data[properties[key]]) {
      jsonLdOutput[key] = data[properties[key]];
    }
  });
  return jsonLdOutput;
}

function collectionDefaults(data, metalsmith, options) {
  var jsonLdOutput = [];
  var metadata = metalsmith.metadata();
  var keys = Object.keys(options.collections);
  // Iterate over all the paginate names and match with collections.
  var complete = keys.every(function(name) {
    var collection;
    try {
      collection = metadata.collections[name];
    } catch (error) {}

    // If there is a matching collection, then iterate through the
    // jsonLdObjects we want to attach default data for.
    if (collection) {
      options.collections[name].every(function(jsonLdObject) {
        var collectionJsonLdObject = fillJsonLdValues(jsonLdObject, data);
        jsonLdOutput.push(collectionJsonLdObject);
      });
    }
  });
  return jsonLdOutput;
}