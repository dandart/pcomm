import User from '../lib/model/user';
import passwordhash from 'password-hash';

export async function LoginCtrl(req, res) {
    let user = await User.findOne({username: req.body.username});

    if (!user)
        return res.status(401).send({error: 'Invalid Credentials'});

    if (!passwordhash.verify(req.body.password, user.password))
        return res.status(401).send({error: 'Invalid Credentials'});

    req.session.user = user;

    return res.status(200).send({
        isLoggedIn: true,
        username: user.username
    });
};

export async function RegisterCtrl(req, res) {
    let user = await User.findOne({username: req.body.username});

    if (user) {
        return res.status(400).send({error:'User exists'});
    }

    user = new User({
        username: req.body.username,
        password: passwordhash.generate(
            req.body.password,
            {
                algorithm: 'sha512'
            }
        )
    });

    try {
        await user.save();
    } catch(err) {
        console.log(err);
        return res.status(500).send({error: 'Error saving new user'});
    }

    return res.status(201).send('');
};

export function LogoutCtrl(req, res) {
    req.session.reset();
    return res.status(200).send({
        isLoggedIn: false
    });
};

export function StatusCtrl(req, res) {
    if ('undefined' !== typeof req.session.user)
        return res.send({
            isLoggedIn: true,
            username: req.session.user.username
        });
    return res.send({
        isLoggedIn: false,
        username: null
    });
};
