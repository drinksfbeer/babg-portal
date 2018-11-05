// import nodeMailer from '../services/nodeMailer'; // <-- unused

const User = require('../models/user');
const Member = require('../models/member');
const Itinerary = require('../models/itinerary');
const crud = require('./default/crud');
const prettyError = require('../helpers/prettyError');

// crud comes with index, create, show, update, delete functions
const usersController = crud(User);

// usersController.index = (req, res) => {
//   User
//     .find({
//       role: 'member',
//       memberUuid: { $exists: true },
//     })
//     .populate({
//       path: 'member',
//       populate: {
//         path: 'chapter',
//       },
//     })
//     .then((response) => {
//       res.json(response);
//     })
//     .catch((err) => {
//       return res.status(400).json({ err: 'unknown error' });
//     });
// };

// `id` is the `_id` of the requesting user
// different user roles will be queried for depending on the requesting user's role
// e.g., if `user.role` is `'master'`, the response will include all users
// if `user.role` is `'chapter'`, the response will include all users except for `'master'`s
usersController.index = async (req, res) => {
  const { id } = req.query;
  const acceptedRoles = ['master', 'chapter', 'member'];

  if (!id) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // obtain the requesting user's role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    const { role } = user;
    if (!role || !acceptedRoles.includes(role)) {
      return res.status(403).json({ err: 'user_role_invalid' });
    }

    // if user is a master admin, query for all master admins, chapter admins,
    // brewery admins (`'member'`), staff members, agents, and enthusiasts
    if (role === 'master') {
      // don't bother populating; since the client's `serveContainer` already
      // fetches everything, populating will just bloat the response payload
      // (except for members and staff cause removing it breaks the existing code)
      const masterAdmins = await User.find({ role: 'master' });
      const chapterAdmins = await User
        .find({
          role: 'chapter',
          chapterUuid: { $exists: true },
        });
      const membersAndStaff = await User
        .find({
          role: {
            $in: ['member', 'staff'],
          },
          memberUuid: { $exists: true },
        })
        .populate({
          path: 'member',
          populate: {
            path: 'chapter',
          },
        });
      const agents = await User.find({ role: 'agent' });
      const enthusiasts = await User
        .find({
          role: 'enthusiast',
          chapterUuid: { $exists: true },
        });

      return res.json([
        ...masterAdmins,
        ...chapterAdmins,
        ...membersAndStaff,
        ...agents,
        ...enthusiasts,
      ]);
    }

    // if user is a chapter admin, query for chapter admins in their chapter,
    // brewery admins in their chapter, staff members in those breweries,
    // and enthusiasts of their chapter
    if (role === 'chapter') {
      const { chapterUuid } = user;

      // we need to do some additional pre-processing: compile a list of
      // `memberUuid`s associated with the user's `chapterUuid` for querying all
      // user accounts attached to a member of the chapter
      const chapterMembers = await Member.find({ chapterUuid });
      const memberUuids = chapterMembers.map(member => member.uuid);

      const chapterAdmins = await User
        .find({
          role: 'chapter',
          chapterUuid,
        });
      const membersAndStaff = await User
        .find({
          role: {
            $in: ['member', 'staff'],
          },
          memberUuid: {
            $in: memberUuids,
          },
        })
        .populate({
          path: 'member',
          populate: {
            path: 'chapter',
          },
        });
      const enthusiasts = await User
        .find({
          role: 'enthusiast',
          chapterUuid,
        });

      return res.json([
        ...chapterAdmins,
        ...membersAndStaff,
        ...enthusiasts,
      ]);
    }

    // if the user is a brewery admin, query for brewery admins in their brewery
    // and staff members in their brewery
    if (role === 'member') {
      const { memberUuid } = user;

      const membersAndStaff = await User
        .find({
          role: {
            $in: ['member', 'staff'],
          },
          memberUuid,
        })
        .populate({
          path: 'member',
          populate: {
            path: 'chapter',
          },
        });

      return res.json(membersAndStaff);
    }
  } catch (error) {
    return res.status(500).json({ err: error });
  }

  return res.json([]);
};

usersController.token = async (req, res) => {
  const password = req.headers.authorization;
  User
    .findOne({ password })
    .populate({
      path: 'member',
      populate: {
        path: 'chapter',
      },
    })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(403).json({ err: 'not_authorized' });
      }
      if (!foundUser.member && foundUser.role === 'master') {
        foundUser.populateOrCreateMasterMember(populatedUser => res.json(populatedUser));
      } else {
        return res.json(foundUser);
      }
    })
    .catch((error) => {
      console.log(error); // eslint-disable-line
      res.status(400).json({ err: error });
    });
};

// user model unique authorization for login
usersController.authorize = (req, res) => {
  const {
    email,
    password,
    restrictRole = true,
    restrictedRoles = [ // TODO: when these roles are implemented, remove this logic
      'staff',
      // 'agent',
      'enthusiast',
    ],
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ err: 'missing_parameters' });
  }
  // console.log(email, password); // eslint-disable-line

  User
    .findOne({ email })
    .populate({
      path: 'member',
      populate: {
        path: 'chapter',
      },
    })
    .exec((err, foundUser) => { // eslint-disable-line
      if (err) {
        console.log('Error occured finding client', err); // eslint-disable-line
        return res.status(400).json({ err });
      }
      if (!foundUser) {
        console.log('User not found =>', email, '<='); // eslint-disable-line
        return res.status(400).json({ err: 'email_not_found' });
      }
      foundUser.authorize(password, (authErr, authorizedUser) => {
        if (authErr) {
          return res.status(401).json({ err: 'incorrect_password' });
        }

        // TODO: when all roles are implemented, remove this logic
        if (restrictRole) {
          if (restrictedRoles.includes(authorizedUser.role)) {
            return res.status(501).json({ err: 'unsupported_role' });
          }
        }

        if (!authorizedUser.member && authorizedUser.role === 'master') {
          authorizedUser.populateOrCreateMasterMember(populatedUser => res.json(populatedUser));
        } else {
          return res.json(authorizedUser);
        }
      });
    });
};

// overwrite create method with custom one to account for hashed password
usersController.create = async (req, res) => {
  const { adminId, pkg } = req.body;

  if (!adminId || !pkg || !pkg.email || !pkg.password || !pkg.role) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // first, verify that `adminId` is actually an admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    const { role: adminRole } = admin;
    if (!adminRole || !['master', 'chapter', 'member'].includes(adminRole)) {
      return res.status(403).json({ err: 'user_role_invalid' });
    }

    // then, verify that the admin can create the user with the requested role
    switch (adminRole) {
      case 'chapter': {
        if (!['chapter', 'member', 'staff', 'enthusiast'].includes(pkg.role)) {
          return res.status(404).json({ err: 'user_role_invalid' });
        }
        break;
      }

      case 'member': {
        if (!['member', 'staff'].includes(pkg.role)) {
          return res.status(403).json({ err: 'user_role_invalid' });
        }
        break;
      }

      default: break; // master admin can create a user with any role
    }

    // check if email is already in use
    const existingUser = await User.findOne({ email: pkg.email });
    if (existingUser) {
      return res.status(400).json({ err: 'email_in_use' });
    }

    // we're good, so continue with account creation
    const newUser = new User(pkg);
    newUser.hasRegistered = true;
    await newUser.setPasswordAsync(pkg.password);
    const savedUser = await newUser.save();

    if (['member', 'staff'].includes(savedUser.role)) {
      const populatedUser = await savedUser.populate({
        path: 'member',
        populate: {
          path: 'chapter',
        },
      });
      return res.json(populatedUser);
    }

    return res.json(savedUser);
  } catch (error) {
    console.log(error); // eslint-disable-line
    return res.status(500).json({ err: error });
  }
};

usersController.registerAgent = async (req, res) => {
  const { email, password, company } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ err: 'user_already_exists' });
    }

    const newUser = new User({
      email, company, role: 'agent', permissions: ['submit_events'], hasRegistered: true,
    });

    const modifiedUser = await newUser.setPasswordAsync(password);
    const savedUser = await modifiedUser.save();
    return res.json(savedUser);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// when user goes through email signup
usersController.register = async (req, res) => {
  const { pkg } = req.body;

  if (!pkg || !pkg.email || !pkg.password) {
    return res.status(400).json({ err: 'bad request' });
  }

  const { email, password } = pkg;

  const foundUser = await User
    .findOne({ email });

  if (!foundUser) {
    return res.status(401).json({ custom: 'This email has not been invited' });
  }

  if (foundUser.hasRegistered === true) {
    return res.status(401).json({ email: 'unique' });
  }

  foundUser.setPassword(password, (passwordErr, modifiedUser) => {
    const localModifiedUser = modifiedUser;

    if (passwordErr || !localModifiedUser) {
      return res.status(400).json({ err: passwordErr || 'cant set password' });
    }

    localModifiedUser.hasRegistered = true;

    localModifiedUser.save((saveErr, savedUser) => {
      if (saveErr || !savedUser) {
        return res.status(400).json(saveErr ? prettyError(saveErr) :
          { err: 'unknown saving error' });
      }

      return res.json(savedUser);
    });

    return null;
  });

  return null;
};

usersController.invite = (req, res) => {
  const { memberId, email, roleType } = req.body;

  const permissionsByRoleType = {
    traditionalMember: ['voting', 'forum'],
    superMember: ['voting', 'forum'],
    lightMember: ['voting', 'forum'],
  };

  new User({
    email,
    role: 'member',
    memberUuid: memberId,
    permissions: permissionsByRoleType[roleType],
    hasBeenInvited: true,
  }).setPassword('password', (passwordErr, newUser) => {
    if (passwordErr) return res.status(403).json(passwordErr);

    newUser.save((err, savedUser) => {
      if (err) {
        /* eslint-disable-next-line */
        console.log('Error occurred creating user', err);

        return res.status(400).json(prettyError(err));
      }

      // nodeMailer.sendInvite({ email });

      User.populate(savedUser, {
        path: 'member',
        populate: {
          path: 'chapter',
        },
      })
        .then(populatedUser =>
          res.json(populatedUser))
        .catch((err) => { // eslint-disable-line
          res.status(402).json({ err });
        });

      return null;
    });

    return null;
  });
};

usersController.update = async (req, res) => {
  const { adminId, _id, pkg } = req.body;

  if (!adminId || !_id || !pkg) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // first, verify that `adminId` is actually some kind of admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    const { role: adminRole } = admin;
    if (!adminRole || !['master', 'chapter', 'member'].includes(adminRole)) {
      return res.status(403).json({ err: 'user_role_invalid' });
    }

    // then, verify that the admin can update the user with the requested role
    if (pkg.role) {
      switch (adminRole) {
        case 'chapter': {
          if (!['chapter', 'member', 'staff', 'enthusiast'].includes(pkg.role)) {
            return res.status(404).json({ err: 'user_role_invalid' });
          }
          break;
        }

        case 'member': {
          if (!['member', 'staff'].includes(pkg.role)) {
            return res.status(403).json({ err: 'user_role_invalid' });
          }
          break;
        }

        default: break; // master admin can create a user with any role
      }
    }

    // check if email is already in use if passed in as part of the request
    if (pkg.email) {
      const existingUser = await User.findOne({ email: pkg.email });
      if (existingUser) {
        return res.status(400).json({ err: 'email_in_use' });
      }
    }

    // update password if part of the request
    // (done separately since it's hashed with bcrypt)
    if (pkg.password) {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ err: 'user_not_found' });
      }
      await user.setPasswordAsync(pkg.password);
      await user.save();
    }

    // proceed with updating the user
    const options = {
      new: true,
      runValidators: true,
    };
    let update = JSON.parse(JSON.stringify(pkg)); // deep-copy
    delete update.password; // since we did this previously
    if (_id === adminId) {
      // only certain settings are updated if the admin is updating themself
      update = pkg.email ? { email: pkg.email } : {};
    }

    const updatedUser = await User.findByIdAndUpdate(_id, update, options);

    if (['member', 'staff'].includes(updatedUser.role)) {
      const populatedUser = await updatedUser.populate({
        path: 'member',
        populate: {
          path: 'chapter',
        },
      });
      return res.json(populatedUser);
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

usersController.destroy = async (req, res) => {
  const { adminId, _id } = req.body;

  if (!adminId || !_id) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  if (adminId === _id) {
    return res.status(400).json({ err: 'user_cannot_delete_themself' });
  }

  try {
    // first, verify that `adminId` is actually some kind of admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'deleter_not_found' });
    }
    const { role: adminRole } = admin;
    if (!adminRole || !['master', 'chapter', 'member'].includes(adminRole)) {
      return res.status(403).json({ err: 'deleter_role_invalid' });
    }

    // then, query for the user that will be deleted
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ err: 'deletee_not_found' });
    }
    const { role } = user;

    // verify if the admin can actually delete the user
    switch (adminRole) {
      case 'chapter': {
        if (!['chapter', 'member', 'staff', 'enthusiast'].includes(role)) {
          return res.status(403).json({ err: 'deletee_role_invalid' });
        }
        break;
      }

      case 'member': {
        if (!['member', 'staff'].includes(role)) {
          return res.status(403).json({ err: 'deletee_role_invalid' });
        }
        break;
      }

      default: break; // master admins can delete anyone but themselves (checked earlier)
    }

    // if the user is an enthusiast, remove their itinerary (if any)
    if (role === 'enthusiast') {
      const foundItinerary = await Itinerary.findOne({ userId: _id });
      if (foundItinerary) {
        await Itinerary.findOneAndDelete({ userId: _id });
      }
    }

    // continue with the deletion
    const deletedUser = await User.findByIdAndRemove(_id);

    // return deleted user's `_id`
    return res.json({ _id: deletedUser._id });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = usersController;
