// module load
var mongoose = require("mongoose");

// build Schema
var SequenceSchema= mongoose.Schema({

    _id: {type:Number, default:0},

    seq: {type:Number, default:0}

});

var UrlsSchema = mongoose.Schema({

    _id: Number,

    url: String,

    count: {type:Number, default:0},

    created_at: Date

});



// schema에서 save 가 실행되기 전에 발생.
UrlsSchema.pre('save', function(next){
  var self = this;
  console.log(sequences);
  sequences.findOneAndUpdate({_id: 0}, {$inc: {seq: 1} }, {upsert: true}, function(error, result) {
    console.log("result 1:" + result);
    if (error) return next(error);
    self.created_at = new Date();
    self._id = result.seq;
    next();
  });
});


// build models
var urls = mongoose.model('urls', UrlsSchema);
var sequences = mongoose.model('sequence', SequenceSchema);

var init = new sequences({
    _id:0,
    seq:0
})

init.save(function(err, doc){
    if(err) return console.error(err);
    console.dir(doc);
});

module.exports = urls;
