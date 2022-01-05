// load up the express framework and body-parser helper
const express = require('express');


// create an instance of express to serve our end points
const app = express();
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//file system
const fs = require('fs');
const { response } = require('express');




var data1 = require('./data/users.json');




const routes = require('./routes/routes.js')(app, fs);

// set the view engine to ejs
// app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {

    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        var data1 = JSON.parse(data);

        // console.log(data)
    });

    var users = data1;
    // console.log(data)
    var tagline = "User Info";

    res.render('pages/index', {
        users: users,
        tagline: tagline
    });
});



// addUser page
app.get('/addUser', function(req, res) {
    res.render('pages/addUser');
});
app.post('/processPost', urlencodedParser, function(req, res) {


    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

        // console.log(data)
    });

    var users = data1;
    //console.log(JSON.stringify(data));
    var array = [];
    var count = 0;
    // JSON.parse(data).forEach(function(item) {
    //     // array.push(item);
    //     console.log(item);
    // });

    for (var i in data1) {
        array.push(data1[i]);
        count++;
        console.log(i);
    }

    count = array.length + 1;
    const response = {
        id: count,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    };
    // console.log(array);
    try {
        array.push(response);
        console.log(array)
        fs.writeFileSync('./data/users.json', JSON.stringify(array))
            //file written successfully
    } catch (err) {
        console.error(err)
    }
    // console.log(newList);
    res.end(JSON.stringify(response));
    // console.log(req, "request");
});




//edit User page
app.get('/editUser/:id', function(req, res) {
    var userData;

    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

        // console.log(data)
    });

    var users = data1;
    // console.log(req.params.id);
    var id = req.params.id;
    for (const i in data1) {
        if (data1[i]["id"] == id) {
            userData = data1[i];
        }
        // array.push(data[i]);
        // console.log(data[i]);
    }
    res.render('pages/editUser', userData);
});


// patch- edit user

app.post('/processPatch/:id', urlencodedParser, function(req, res) {
    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

        // console.log(data)
    });

    var users = data1;

    var id = req.params.id;
    const response = {
        id: id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    };
    // console.log(JSON.stringify(data));
    var array = [];
    // JSON.parse(data).forEach(function(item) {
    //     // array.push(item);
    //     console.log(item);
    // });


    for (const i in data1) {
        if (data1[i]["id"] == id) {
            var index = data1.indexOf(data1[i]);
            //            data.splice(index, 1);
            array.push(response);
        } else
            array.push(data1[i]);
        // console.log(data[i]);
    }

    // console.log(array);
    try {

        fs.writeFileSync('./data/users.json', JSON.stringify(array))
            //file written successfully
    } catch (err) {
        console.error(err)
    }
    // console.log(newList);
    res.end(JSON.stringify(response));
    // console.log(req, "request");
});

// delete user

app.get('/processDelete/:id', urlencodedParser, function(req, res) {
    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

        // console.log(data)
    });

    var users = data1;

    var id = req.params.id;

    // console.log(JSON.stringify(data));
    var array = [];
    // JSON.parse(data).forEach(function(item) {
    //     // array.push(item);
    //     console.log(item);
    // });


    for (const i in data1) {
        if (data1[i]["id"] != id) {

            array.push(data1[i]);
        }

        // console.log(data[i]);
    }

    // console.log(array);
    try {

        fs.writeFileSync('./data/users.json', JSON.stringify(array))
            //file written successfully
    } catch (err) {
        console.error(err)
    }
    // console.log(newList);
    res.end(JSON.stringify({ "Message": "Successfully Deleted" }));
    // console.log(req, "request");
});

// launch server
app.listen(8080);
console.log('Server is listening on port 8080');