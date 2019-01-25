'use strict';

module.exports = function(app){
    var todoListController = require('../controllers/todoListController');

    app.route('/register')
        .post(todoListController.registerNewUser);

    app.route('/authorize')
        .get(todoListController.authorizeMe);

    app.route('/login')
        .post(todoListController.login);

    //OTP calls
    app.route('/registerPhone')
        .post(todoListController.registerPhoneNumner);

    app.route('/getCellData')
        .get(todoListController.getOTPandVerify);

    app.route('/getEmployeeData').get(todoListController.getAllEmployeeData);

    app.route('/getAllEvents').get(todoListController.getAllEventsData);

    



};
