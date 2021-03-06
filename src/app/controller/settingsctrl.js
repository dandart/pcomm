import User from '../lib/model/user';
import md5 from '../lib/md5';

export default async (req, res) => {
    let user = await User.findById(req.session.user._id);

    return res.send({networks: user.networks});
}

export async function email(req, res) {
    let user = await User.findById(req.session.user._id),
        post = req.body;

    if ('undefined' == typeof user.networks)
        user.networks = {};

    user.networks[md5('email'+post.emailaddress)] = {
        type: 'email',
        name: post.emailaddress,
        password: post.password,
        imap: post.imap,
        smtp: post.smtp
    };

    user.markModified('networks');
    await user.save();

    return res.send({networks: user.networks});
}

export async function xmpp(req, res) {
    let user = await User.findById(req.session.user._id),
        post = req.body;

    if ('undefined' == typeof user.networks)
        user.networks = {};

    user.networks[md5('rss'+post.server+post.name)] = {
        type: 'xmpp',
        server: post.server,
        name: post.name,
        password: post.password
    };

    user.markModified('networks');
    await user.save();

    return res.send({networks: user.networks});
};

export async function rss(req, res) {
    let user = await User.findById(req.session.user._id),
        post = req.body;

    if ('undefined' == typeof user.networks)
        user.networks = {};

    user.networks[md5('rss'+post.url)] = {
        type: 'rss',
        name: post.name,
        url: post.url
    };

    user.markModified('networks');
    await user.save();

    return res.send({networks: user.networks});
};

export async function deleteNetwork(req, res) {
    let user = await User.findById(req.session.user._id);
    delete user.networks[req.params.id];

    user.markModified('networks');
    await user.save();

    return res.send({networks: user.networks});
}
