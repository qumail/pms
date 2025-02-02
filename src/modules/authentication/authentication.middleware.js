import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};


export const authenticateUserByRole = (roles) => {
  return (req, res, next) => {
    // Check if the token is provided in headers
    const token = req.headers['authorization']?.split(' ')[1];  // Assumes 'Bearer <token>'

    if (!token) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Check if user's role is in the allowed roles
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient role' });
      }

      // Save decoded user info to request object for future use
      req.user = decoded;
      next();
    });
  };
};

