var express = require('express');
var router = express.Router();
var connection = require('../connection/connected');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'/*, { title: 'Express' }*/);
});

/* method get for my works */
router.get('/all_works', function(req, res) {
  let sql = 'SELECT * FROM works';

  connection.query(sql, function (err, rows) {

    if(err){
      res.json({'Error' : true, 'Message' : 'Error Execute Sql'});
    } else {
      res.json({'Error' : false, 'Message' : 'Success', 'all_works' : rows})
    }

  });
})

/* method for new work */
router.post('/new_work', function(req, res){
  let sql = 'INSERT INTO works (name, ready) VALUES (?, ?)';

  let body = [req.body.work, req.body.ready];

  connection.query(sql, body, function(err){

    if(err){
      res.json({'Error' : true, 'Message' : 'SQL Erro'});
    } else {
      res.json({'Error' : false, 'Message' : 'Add ' + req.body.work + ' success'});
    }

  });
})

/* method for update work */
router.put('/update_work', function(req, res){
  let sql = 'UPDATE works SET name = ?, ready = ? WHERE id = ?';

  let body = [req.body.name, req.body.ready, req.body.id];

  connection.query(sql, body, function(err){
    if(err){
      res.json({'Error' : true, 'Message' : 'Error in sql.'});
    } else {
      res.json({'Error' : false, 'Message' : req.body.name + ' success update.'});
    }
  });
})

/* method for delete item work */
router.delete('/delete_work', function(req, res){
  let sql = 'DELETE FROM works WHERE id = ?';

  let body = [req.body.id];

  connection.query(sql, body, function(err){
    if(err){
      res.json({'Error' : true, 'Message' : 'Error in SQL'});
    } else {
      res.json({'Error' : false, 'Message' : 'Delete success'});
    }
  });
});

module.exports = router;
