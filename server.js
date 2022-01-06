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


// index page renderring
app.get('/', function(req, res) {

    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        var data1 = JSON.parse(data);

    });

    var users = data1;
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

    });

    var users = data1;

    var array = [];
    var count = 0;

    for (var i in data1) {
        array.push(data1[i]);
        count++;

    }

    count = array.length + 1;
    const response = {
        id: count,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    };

    try {
        array.push(response);

        fs.writeFileSync('./data/users.json', JSON.stringify(array));
        // app.use('/', function(req, res) {
        //     res.redirect(301, 'pages/index');
        //     res.status(401).end();

        // })

    } catch (err) {
        console.error(err)
    }

    res.redirect('/');

});




//edit User page
app.get('/editUser/:id', function(req, res) {
    var userData;

    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

    });

    var users = data1;

    var id = req.params.id;
    for (const i in data1) {
        if (data1[i]["id"] == id) {
            userData = data1[i];
        }
    }
    res.render('pages/editUser', userData);
});


// patch- edit user

app.post('/processPatch/:id', urlencodedParser, function(req, res) {
    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

    });

    var users = data1;

    var id = req.params.id;
    const response = {
        id: id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    };

    var array = [];

    for (const i in data1) {
        if (data1[i]["id"] == id) {
            array.push(response);
        } else
            array.push(data1[i]);
    }

    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(array))
            //file written successfully
    } catch (err) {
        console.error(err)
    }

    res.redirect('/');


});

// delete user

app.get('/processDelete/:id', urlencodedParser, function(req, res) {
    fs.readFile('./data/users.json', function(err, data) {
        if (err) throw err;
        data1 = JSON.parse(data);

    });

    var users = data1;
    var id = req.params.id;
    var array = [];
    for (const i in data1) {
        if (data1[i]["id"] != id) {
            array.push(data1[i]);
        }
    }
    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(array))
            //file written successfully
    } catch (err) {
        console.error(err)
    }
    // res.end(JSON.stringify({ "Message": "Successfully Deleted" }));
    res.redirect('/');


});

// launch server
app.listen(8080);
console.log('Server is listening on port 8080');