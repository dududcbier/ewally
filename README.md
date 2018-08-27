# README
This project was created as a submission for a challenge made by Ewally.  Students were asked to create a Node.js API for verifying payment slips' numbers. Two kinds of payment slips were taken into account in this project: [bank payment slips](http://www.bb.com.br/docs/pub/emp/empl/dwn/Doc5175Bloqueto.pdf) and [utility company payment slips](http://www.febraban.org.br/7Rof7SWg6qmyvwJcFwF7I0aSDf9jyV/sitefebraban/Codbar4-v28052004.pdf).

### Dependencies
* Docker
* Docker Compose

### Running the project
To start the API, simply run:

``` docker-compose up ```

The server will be listening on localhost:3000/

### About the API
The API has a single endpoint: '/' (blank) and expects a POST request.
The body should contain an object with a 'typedLine' field containing the numbers typed by the user.

Example:

``` curl -H "Content-Type: application/json" -X POST -d '{"typedLine":"00190.50095 40144.816069 06809.350314 3 37370000000100"}' http://localhost:3000/ ```

should return the following json: 

```json 
{
    "isValid": true,
    "value": 1,
    "expirationDate": "2007-12-31T00:00:00.000Z",
    "barcode": "00193373700000001000500940144816060680935031",
    "type": "Bank"
} 
```





