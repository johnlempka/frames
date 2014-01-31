function Gallery(div, options) {
  this.images = {};
  this.indexedImages = [];
  this.div = div;
  this.imageGetter = new ImageGetter(options, this);
  this.type = this.imageGetter.type;
  this.id = this.imageGetter.id;
  this.apiCalls = 0;
}

Gallery.prototype.addGetMore = function() {
  if (!$("a#" + this.tag).length) {
    var self = this;
    this.div.append("<a id='" + this.tag + "' class='getMore'>Get More</a>");
    $("a#" + this.tag).click(function() {
      self.removeGetMore();
      self.imageGetter.getMorePictures(self);
    });
    var getMoreHeight = $("a.getMore").css("width");
    $("a.getMore").css("height", getMoreHeight);
    $(window).on('resize', function() {
      $('a.getMore').css('height', $('a.getMore').css('width'));
    });
  }
}

Gallery.prototype.removeGetMore = function() {
  if($("a#" + this.tag).length) {
    $("a#" + this.tag).remove();
  }
}

Gallery.prototype.addImage = function(image) {
  this.images[image.id] = image;
  this.indexedImages.push(image.id);
  var self = this;
  this.div.children(".gallery").append("<div class='image'><img src='" 
    + image.images.low_resolution.url + "' id='" + image.id + "'></div>");

  $("img#" + image.id).click(function() {
    var id = $(this).attr("id");
    lightbox(image, self);
  });
}

Gallery.prototype.getNextImage = function(image) {
  var thisImage = this.indexedImages.indexOf(image.id);
  return this.images[this.indexedImages[thisImage + 1]];
}

Gallery.prototype.getPreviousImage = function(image) {
  var thisImage = this.indexedImages.indexOf(image.id);
  return this.images[this.indexedImages[thisImage - 1]];
}


function gallery(div, options) {
    // var igApiUrlTags = 'https://api.instagram.com/v1/tags/mikekelley/media/recent?client_id=22e2598de33c4ee580a285d661123ad3';
    // var igClientId = 'client_id=22e2598de33c4ee580a285d661123ad3'
    
    var gallery = new Gallery(div, options);
    
    gallery.imageGetter.getMorePictures();
    
  }