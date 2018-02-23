var exp = require("express");
var app = exp();
app.use(exp.static('public'));
var Urls=require("./models.js")
var mongoose = require("mongoose");
var bijective = require('./bijective.js');
const conn = mongoose.connect("mongodb://localhost/url-shortener");



// 짧은 주소를 받으면 리다이렉트
app.get('/:key', function(req, res){

  var id = bijective.decode(req.params.key);
  console.log("4:"+id);
  Urls.findOne({_id: id}, function (err, doc){
    if (doc) {
        console.log("5:"+doc);

        // count 증가시키기 구현하기
        Urls.findOneAndUpdate({_id:id},
            {$inc : { count : 1 }},
            function(err, result) {
                if (err) { return next(err) };
                res.redirect(result.url+"?visitCount:"+result.count);
        });

    } else {
        console.log("Invaild URL");
      res.redirect("/");
    }
  });

});


// 짧은 주소를 만들어서 저장
app.get('/url/:longUrl', function(req, res){

  Urls.findOne({url: req.params.longUrl}, function (err, doc){
    // 기등록된 주소일 경우
    if (doc){
        // 화면에 뿌릴 키값을 던진다
        console.log('1:'+{'key': bijective.encode(doc._id)});
      res.send({'key': bijective.encode(doc._id)});
    } else {

        //
      var newUrl = Urls({
        url: req.params.longUrl
      });

      console.log("2:"+newUrl);

      newUrl.save(function(err) {
        if (err) console.log(err);
        console.log("3:"+bijective.encode(newUrl._id));
        res.send({'key': bijective.encode(newUrl._id)});
      });
    }

  });

});


app.listen(3000, function(){

    console.log("http://localhost:3000/");

})
