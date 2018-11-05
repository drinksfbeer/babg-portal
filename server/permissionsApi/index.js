import api from '../permissionsApi';
import User from '../models/user';

const getUser = async ({ passwordHash }) => {
  return await User
    .findOne({ password: passwordHash });
};

export default {
  groups: {
    memberUsers: {
      voting: true, 
    },
  },
  
  permissionsByType: {
    voting: {
      add: {
        voting: true,
      },
    },
    plans: {
      assign: {
        assignPlan: true,
      }
    }
  },
  
  checkUserPermissions({ type, method, user }) {
    const permissionsForType = this.permissionsByType[type][method];
    let hasAllPermissions = true;
    
    const permissionsEntries = Object.entries(permissionsForType);

    permissionsEntries.forEach((entry) => {
      const key = entry[0];
      const value = entry[1];
      
      if (
        !user.permissions ||
        !user.permissions[key] ||
        user.permissions[key] !== value
      ) {
        hasAllPermissions = false;
      }
    });

    return hasAllPermissions;
  },
  
  async middleware({ req, res, next, type, method }) {
    const passwordHash = req.get('Authorization');
    req.user = await getUser({ passwordHash });
    
    const validPermissions = api.checkUserPermissions({
      type,
      method,
      user: req.user,
    });
    
    if (!validPermissions) {
      res
        .status(403)
        .json({ error: true, status: 403, message: 'Not authorized for this resource.' });
    } else {
      next();
    }
  },
};
