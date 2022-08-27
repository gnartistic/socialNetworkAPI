const router = require( 'express' ).Router();
const apiRoutes = require( './api' );

router.use( '/api', apiRoutes );

router.use( ( req, res ) =>
{
    res.status( 404 ).send( "<h1> 🤯 I'm just as confused as you are about this 404 error, but it probably means that what youre looking for doesn't exist!</h1>" );
} );

module.exports = router;