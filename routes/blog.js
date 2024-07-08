const express = require('express');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.post('/comment', async function (req, res) {
    const userComment = req.body;
    const enteredTitle = userComment.title;
    const enteredContent = userComment.content;

    const newComment = {
        title: enteredTitle,
        content: enteredContent,
    };
    const comments = await db.getDb().collection('comments').insertOne(newComment);

    try {
        const comments = await db
            .getDb()
            .collection('comments')
            .find({})
            .toArray();
        res.render('comment', { comments }); // Render a template (e.g., 'comments.ejs')
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/signup', async function (req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredConfirmEmail = userData['confirm-email'];
    const enteredPassword = userData.password;



    const hashedPassword = await bcrypt.hash(enteredPassword, 12);

    const user = {
        email: enteredEmail,
        password: hashedPassword,
    };

    await db.getDb().collection('users').insertOne(user);
    res.redirect('/login');
});


router.post('/login', async function (req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredPassword = userData.password;
    console.log(userData, enteredEmail, enteredPassword);

    const existingUser = await db
        .getDb()
        .collection('users')
        .findOne({ email: enteredEmail });

    if (!existingUser) {
        return res.redirect('/login');
    }

    const passwordAreEqual = await bcrypt.compare(
        enteredPassword,
        existingUser.password
    );

    if (!passwordAreEqual) {
        console.log('Could not log in, check the credential before trying again');
        return res.redirect('/login');
    }

    req.session.user = {id: existingUser._id, email: existingUser.email};
    req.session.isAuthenticated = true;
    req.session.save(function() {
        res.redirect('/comment');
    });
});



router.get('/comment/:id/comments', async function (req, res) {
    const postId = new ObjectId(req.params.id);
    const comments = await db
        .getDb()
        .collection('comments')
        .find({ postId: postId }).toArray();
    res.json(comments);
});

// router.get('/comments', async function(req, res) {
//     try {
//         const comments = await db
//             .getDb()
//             .collection('comments')
//             .find({}) // Filter by postId if needed
//             .toArray();
//         res.json(comments);
//     } catch (error) {
//         console.error('Error fetching comments:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


router.get('/comment', async (req, res) => {

    if (!req.session.isAuthenticated) {
        return res.status(401).render('401');
    }
    try {
        const comments = await db
            .getDb()
            .collection('comments')
            .find({})
            .toArray();
        res.render('comment', { comments }); // Render a template (e.g., 'comments.ejs')
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', function(req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/login');
});










module.exports = router;










