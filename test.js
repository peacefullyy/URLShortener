var exp = require("express");
var app = exp();
app.use(exp.static('public'));

var mongoose = require("mongoose");
const conn=mongoose.connect("mongodb://localhost/url-shortener");

var bijective = require('./bijective.js');

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(conn);



var UrlsSchema = mongoose.Schema({

    _id:Number,

    url: String,

    count: {type:Number, default:0},

    created_at: Date

});

UrlsSchema.pre('save', function(next){
    var self = this;
    sequences.findOneAndUpdate({_id: 0}, {$inc: {seq: 1} }, {upsert: true}, function(error, result) {
        console.log("result 1:" + result);
        if (error) return next(error);
        self.created_at = new Date();
        self._id = result.seq;
        next();
    });
});

UrlsSchema.plugin(autoIncrement.plugin, {model:'urls',field:'count'});
var urls = mongoose.model('urls', UrlsSchema);


// build Schema
var SequenceSchema= mongoose.Schema({

    _id: {type:Number, default:0},

    seq: Number

});

// build models
var sequences = mongoose.model('sequence', SequenceSchema);
