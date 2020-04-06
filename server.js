'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require("request-promise");

const PORT = process.env.PORT || 8000;

const getFlights = async (req, res) => {
    try {
        const data = JSON.parse((await request("https://journeyedu.herokuapp.com/slingair/flights")));
        res.send({status: 200, flights: data.flights});
    }
    catch (error) {
        console.log(error);
    }
}

const validateFlight = (req, res) => {
    const flight = req.params.flight;

    request(`https://journeyedu.herokuapp.com/slingair/flights/${flight}`)
        .then(JSON.parse)
        .then(data => {
            const seats = data[flight];
            res.send(seats);
        })
}

const createUser = async (req, res) => {
    try {
        let userData = req.body;
        let postData = {
            method: "POST",
            url: "https://journeyedu.herokuapp.com/slingair/users",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }
        const data = JSON.parse(await request(postData));
        res.send({status: 200, id: data.reservation.id});
    }
    catch (error) {
        console.log("NOPE" + error);
    }
}

const getUser = async (req, res) => {
    
    try {
        const { id } = req.params;
        
        const requestedData = JSON.parse(await request(`https://journeyedu.herokuapp.com/slingair/users/${id}`));
        await res.send({status: 200, userData: requestedData.data});
    }
    catch (error) {
        console.log(error);
    }

}

const getReservation = async (req, res) => {
    try {
        const { email } = req.params;
        const requestedData = JSON.parse(await request(`https://journeyedu.herokuapp.com/slingair/users/${email}`));
        await res.send({status: 200, id: requestedData.data.id});
    }
    catch (error) {
        console.log(error);
    }
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    
    // endpoints
    .get("/getFlights", getFlights)
    .get("/validate-flight/:flight", validateFlight)
    .post("/createUser", createUser)
    .get("/getUser/:id", getUser)
    .get("/getReservation/:email", getReservation)

    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));