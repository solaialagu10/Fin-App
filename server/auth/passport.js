const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
const {User} = require("../models/userModel");


passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        function (jwt_payload, done) {
            User.findOne({userName: jwt_payload.userName})
            .then((user) => {
                 return done(null,user._id);
            }).catch((err)=>{
                console.log("<><><>> error at passport "+err);
                return done(err);
            });
        }
    )
);



// function authorized(request, response, next) {
//     console.log("<><><>"+request);
//     const authHeader = request.headers["authorization"];
//     console.log("<><><>"+authHeader);
//     // Verify the token using the Userfront public key
//    jwt.verify(authHeader, process.env.JWT_SECRET, (err, auth) => {
//     console.log("<><><><< auth "+auth );
//     if (err) return response.sendStatus(403); // Return 403 if there is an error verifying
//     console.log("<><><><< auth "+JSON.stringify(auth ));
//     request.auth = auth;
//     next();
//   });
    // passport.authenticate('jwt', { session: false, }, async (error, token) => {
    //     if (error || !token) {
    //         response.status(401).json({ message: 'Unauthorized' });
    //     } 
    //     try {
    //         console.log("<><><"+token);
    //         const user = await User.findOne({
    //             where: { id: token.id },
    //         });
    //         request.user = user;
    //     } catch (error) {
    //         console.log("<><> error at authorized fun"+error);
    //         next(error);
    //     }
    // }) (request, response, next);   
// }