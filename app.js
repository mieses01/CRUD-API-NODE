const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const wikiSchema = {
  title: String,
  content: String
};

const articles = mongoose.model("article", wikiSchema);

app.route("/articles")
.get(function(req, res) {
  articles.find({}, function(err, article) {
    if (err) {
      res.send(err);
    } else {
      res.send(article);
    }
  })
})
.post(function(req, res) {

  title = req.body.title;
  content = req.body.content;

  articles.create({
    title: title,
    content: content
  }, function(err, small) {
    if (err) {
      res.send(err);
    } else {
      res.send("article created");
    }
  });
})
.delete(function(req, res) {
  articles.deleteMany({}, function(err) {
    if (err) {
      res.send("Error Borrando!");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req, res){
  articles.findOne({title : req.params.articleTitle},function(err,result){

    if (err) {
      res.send("Error Buscando !"+err);
    } else {
      res.send(result);
    }
  })

})
.put(function(req, res){

  const query = { title: req.params.articleTitle };

  articles.updateOne(query,{ title: req.body.title, content: req.body.content },{overwrite: true},function(err, result){
    if (err) {
      res.send("Error Buscando !"+err);
    } else {
      res.send(result);
    }
  })

})
.patch(function(req, res){

  const query = { title: req.params.articleTitle };
  req.body = {title: "Test"}

  articles.updateOne(query,{ $set: req.body },{overwrite: true},function(err, result){
    if (err) {
      res.send("Error Buscando !"+err);
    } else {
      res.send(result);
    }
  })

})
.delete(function(req, res){
  const query = {title: req.params.articleTitle};
  articles.deleteOne(query, function(err, result){
    if (err){
      res.send("Error eliminando !"+err);
    } else {
      res.send(result);
    }
  })
})

app.listen(3000, function() {
  console.log("Running in port 3000");
});
