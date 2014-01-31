
/*
 * GET home page.
 */

var words = ['hi'];
exports.index = function(req, res){
  res.render('index', { title: '#tapotnyc', 'words' : words });
};