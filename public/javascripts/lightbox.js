$(document).ready(function() {
  $("body").append("<div class='overlay'></div>");
  $("body").append("<div class='lightbox'></div>");
  
  $(".overlay").click(function() {
    removeLightbox();
  });
});

function removeLightbox() {
  $(".overlay").css("display", "none");
  $(".lightbox").css("display", "none");
  $(".lightbox").children().remove();
  $(document).unbind("keydown");
}



function lightbox(data, gallery) {
  $(".overlay").css("display", "block");
  $(".lightbox").css("display", "block");
  
  var image_data = data;
  var image_gallery = gallery;
  
  var html = "<a href='" + data.link + "' class='view_on_insta'>View on Instagram</a>";
  html += "<img src='" + data.images.standard_resolution.url + "' class='lightbox_image'>"
  html += "<p class='photo_author'>Photo by <a href='http://instagram.com/" + data.user.username + "'>" + data.user.username + "</p>";
  html += "<a class='add_to_collection'>Add to collection</a>";
  $(".lightbox").append(html);
  $(".lightbox img").load(function() {
    $(".lightbox").css("margin-top", - ($(".lightbox").height() / 2));
  });
  
  $(".lightbox").click(function() {
    removeLightbox();
    var next = gallery.getNextImage(data, gallery);
    if (next) {
      lightbox(next, gallery);
    }
  });
  
  $(".lightbox a").click(function(e) {
    e.stopPropagation();
  });
  
  $(".lightbox a.add_to_collection").click(function() {
    var url = '/collections/add/image/' + image_data.id;
    $.ajax(
      {
        type : 'GET',
        url : url, 
        success : function(data) {
          $(".lightbox").off();
          $(document).off();
          $(".lightbox").children().css('display', 'none');
          $(".lightbox").append(data);
          $(".lightbox").css("margin-top", - ($(".lightbox").height() / 2));
          $(window).on('resize', function() {
            $(".lightbox").css("margin-top", - ($(".lightbox").height() / 2));
          });
        }
      }
    );
  });
  
  $(document).keydown(function(e) {
    if(e.keyCode === 37) {
      removeLightbox();
      var prev = gallery.getPreviousImage(data, gallery);
      if (prev) {
        lightbox(prev, gallery);
      }
    }
    else if(e.keyCode === 39) {
      removeLightbox();
      var next = gallery.getNextImage(data, gallery);
      if (next) {
        lightbox(next, gallery);
      }
    }
    else if (e.keyCode === 27) {
      removeLightbox();
    }
  });
  
}