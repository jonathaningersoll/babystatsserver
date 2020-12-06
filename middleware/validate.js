const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
module.exports = function(req, res, next){
	if(req.method == 'OPTIONS'){
	     next()
	}else{
          let token = req.headers.authorization;
          if(!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
          else{
               jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    var userId = decoded.id;
                    console.log(userId);
                    if(decoded){
                         console.log("Decoded token***********************************************************************",decoded);                                                      // print "decoded"
                         User.findOne(
                              {
                                   Where: {
                                        id: userId
                                   }
                              }
                         ).then(user => {
                              req.user = user;
                              console.log("Filled User: |||||||||||||||||||||||||||||| ",user);
                              next();
                         },
                         function(){
                              res.status(401).send({error: 'Not authorized'});
                         });
                    }else{
                         res.status(400).send({error: 'Not authorized'});
                    }
		     });
	     }
	}
}