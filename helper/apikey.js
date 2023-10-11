const apiKeys = {
    // Replace these with your actual API keys and associated client names/IDs
    'a1b2c33d4e5f6g7h8i9jakblc': 'Client 1',
    '71b2c53d455f16g3h19j4123c': 'Client 2',
  };
  
  const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('key');
    //console.log(!!apiKey);
    if (!apiKey || !apiKeys[apiKey]) {
        
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Attach the client information to the request for later use
    //req.clientName = apiKeys[apiKey];
    next();
  }

module.exports = authenticateApiKey;

