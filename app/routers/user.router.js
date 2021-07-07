module.exports = function(app) {
    
       const user = require('../controllers/user.controller.js');
    
       // User manage
       app.post('/api/user', user.manageUser);
   
      //login
      app.post('/api/user/login',user.login);

      
   }