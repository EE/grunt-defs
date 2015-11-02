for (var i = 0; i < 5; i++) {(function(){
    var j = i;
    setTimeout(function () {
        this.a = j;
    });
}).call(this);}
