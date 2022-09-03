const { User, Thought, Reaction } = require( '../models' );

const thoughtController = {

    // GET /api/thoughts
    getAllThoughts ( req, res )
    {
        Thought.find( {} )
            .populate( { path: 'reactions', select: '-__v' } )
            .select( '-__v' )
            .then( dbThoughtData => res.json( dbThoughtData ) )
            .catch( err =>
            {
                console.log( err );
                res.status( 500 ).json( err );
            } )
    },
    // GET /api/thoughts/:id
    getThoughtById ( { params }, res )
    {
        Thought.findOne( { id: params.id } )
            .populate( { path: 'reactions', select: '-__v' } )
            .select( '-__v' )
            .then( dbThoughtData =>
            {
                if( !dbThoughtData ) {
                    res.status( 404 ).json( { message: 'No thought found with this id' } );
                    return;
                }
                res.json( dbThoughtData );
            } )
            .catch( err =>
            {
                console.log( err );
                res.status( 400 ).json( err );
            } );
    },
    // POST /api/thoughts
    createThought ( { body }, res )
    {
        Thought.create( body ).then( dbThoughtData =>
        {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
                .then( dbUserData =>
                {
                    if( !dbUserData ) {
                        res.status( 404 ).json( { message: 'No uder found with this id' } );
                        return;
                    }
                    res.json( dbUserData );
                } )
                .cacth( err => res.json( err ) );
        } )
            .catch( err => res.status( 400 ).json( err ) );
    },
    // PUT /api/thoughts/:id
    updateThought ( { params, body }, res )
    {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
            .then( dbThoughtData =>
            {
                if( !dbThoughtData ) {
                    res.status( 404 ).json( { message: 'No thought found with this id' } ); return;
                }
                res.json( dbThoughtData );
            } )
            .catch( err => res.status( 400 ).json( err ) );
    },
    // DELETE /api/thoughts/:id
    deleteThought ( { params }, res )
    {
        Thought.findOneAndDelete( { _id: params.id } )
            .then( dbThoughtData =>
            {
                if( !dbThoughtData ) {
                    res.status( 404 ).json( { message: 'No thought found with this id' } ); return;
                }
                User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.id } }
                )
                    .then( () =>
                    {
                        res.json( { message: 'Successfully Deleted the thought' } );
                    } )
                    .catch( err => res.status( 500 ).json( err ) );
            } )
            .catch( err => res.status( 500 ).json( err ) );
    },
    // POST /api/thoughts/:id/reactions
    addReaction ( { params, body }, res )
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then( dbThoughtData =>
            {
                if( !dbThoughtData ) {
                    res.status( 404 ).json( { message: 'No thought found with this id' } );
                    return;
                }
                res.json( dbThoughtData );
            } )
            .catch( err => res.status( 500 ).json( err ) );
    },
    // DELETE /api/thoughts/:id/reactions
    deleteReaction ( { params, body }, res )
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
            .then( dbThoughtData =>
            {
                if( !dbThoughtData ) {
                    res.status( 404 ).json( { message: 'No thought found with this id' } );
                    return;
                }
                res.json( { message: 'Successfully deleted the reaction' } );
            } )
            .catch( err => res.status( 500 ).json( err ) );
    },
};

module.exports = thoughtController;