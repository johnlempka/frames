function ImageGetter(options, gallery) {
  
  this.gallery = gallery;
  
  for (key in options) {
    this[key] = options[key];
  }
  
  if(this.type === 'location') {
    this.url = 'https://api.instagram.com/v1/locations';
    this.url += '/' + this.location_id + '/media/recent';
    this.url += '?client_id=22e2598de33c4ee580a285d661123ad3';
    this.id = this.type + this.location_id;
  }
  
  if(this.type === 'tags') {
    this.url = 'https://api.instagram.com/v1/tags';
    this.url += '/' + this.tags[0] + '/media/recent';
    this.url += '?client_id=22e2598de33c4ee580a285d661123ad3';
    this.id = this.type + this.tags[0] + this.tags[1];
  }
  
  if(this.type === 'list') {
    this.url = 'https://api.instagram.com/v1/media';
    this.client_id = '?client_id=22e2598de33c4ee580a285d661123ad3';
    console.log(this.list);
  } 
  
}

ImageGetter.prototype.getMorePictures = function() {
  if (this.type === "tags") {
    console.log(this);
    this.gallery.apiCalls++;
    var self = this;
    if (this.url) {
      $.ajax(
        {
          type : 'GET',
          url : self.url, 
          dataType : 'jsonp',
          success : function(data) {
            if (data.pagination.next_url) {
              self.url = data.pagination.next_url;
              // getMorePictures(gallery);
              self.gallery.addGetMore();
            }
            else {
              self.url = null;
              self.gallery.removeGetMore();
            }
            
            for(var i = 0; i < data.data.length; i++) {
              if ($.inArray(self.tags[1], data.data[i].tags) !== -1) {
                self.gallery.addImage(data.data[i]);
              }
            }
          }
        }
      );
    }
  }
  else if (this.type === "list") {
    var self = this;
    for(var i = 0; i < this.list.length; i++) {
      $.ajax(
        {
          type : 'GET',
          url : this.url + '/' + this.list[i] + this.client_id,
          dataType : 'jsonp',
          success : function(data) {
            console.log(data);
            self.gallery.addImage(data.data);
          }
        }
      );
    }
  }
  else if (this.type === "location") {
    this.gallery.apiCalls++;
    var self = this;
    if (this.url) {
      $.ajax(
        {
          type : 'GET',
          url : self.url, 
          dataType : 'jsonp',
          success : function(data) {
            if (data.pagination.next_url) {
              self.url = data.pagination.next_url;
              // getMorePictures(gallery);
              self.gallery.addGetMore();
            }
            else {
              self.url = null;
              self.gallery.removeGetMore();
            }
            
            for(var i = 0; i < data.data.length; i++) {
              self.gallery.addImage(data.data[i]);
            }
          }
        }
      );
    }
  }
  
}