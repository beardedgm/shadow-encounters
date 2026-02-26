const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const PATREON_AUTH_URL = 'https://www.patreon.com/oauth2/authorize';
const PATREON_TOKEN_URL = 'https://www.patreon.com/api/oauth2/token';
const PATREON_API_URL = 'https://www.patreon.com/api/oauth2/v2';

// GET /api/patreon/link — returns the Patreon OAuth URL
router.get('/link', auth, (req, res) => {
  if (!process.env.PATREON_CLIENT_ID) {
    return res.status(503).json({ message: 'Patreon integration not configured' });
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PATREON_CLIENT_ID,
    redirect_uri: process.env.PATREON_REDIRECT_URI,
    scope: 'identity identity.memberships',
    state: jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '10m' }),
  });

  res.json({ url: `${PATREON_AUTH_URL}?${params}` });
});

// GET /api/patreon/callback — Patreon redirects here after authorization
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (!code || !state) {
      return res.redirect(`${clientUrl}/?patreon=error`);
    }

    // Exchange authorization code for access token
    const tokenRes = await fetch(PATREON_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.PATREON_CLIENT_ID,
        client_secret: process.env.PATREON_CLIENT_SECRET,
        redirect_uri: process.env.PATREON_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Patreon token exchange failed:', tokenData);
      return res.redirect(`${clientUrl}/?patreon=error`);
    }

    // Verify the signed state to get the trusted userId
    let userId;
    try {
      const decoded = jwt.verify(state, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (stateErr) {
      console.error('Patreon state verification failed:', stateErr.message);
      return res.redirect(`${clientUrl}/?patreon=error`);
    }

    // Get user identity with memberships (include campaign relationship for filtering)
    const identityRes = await fetch(
      `${PATREON_API_URL}/identity?include=memberships,memberships.campaign&fields[member]=patron_status,currently_entitled_amount_cents`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const identity = await identityRes.json();

    // Check if user is an active patron of this campaign
    const campaignId = process.env.PATREON_CAMPAIGN_ID;
    const isPatron = identity.included?.some(
      (inc) =>
        inc.type === 'member' &&
        inc.attributes.patron_status === 'active_patron' &&
        (!campaignId || inc.relationships?.campaign?.data?.id === campaignId)
    );

    // Update user record
    const user = await User.findById(userId);
    if (user) {
      user.patreonId = identity.data.id;
      user.patreonLinkedAt = new Date();
      user.tier = isPatron ? 'patron' : 'free';
      await user.save();
    }

    res.redirect(`${clientUrl}/?patreon=${isPatron ? 'success' : 'linked'}`);
  } catch (err) {
    console.error('Patreon callback error:', err);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/?patreon=error`);
  }
});

// POST /api/patreon/unlink — remove Patreon connection
router.post('/unlink', auth, async (req, res, next) => {
  try {
    req.user.patreonId = null;
    req.user.patreonLinkedAt = null;
    req.user.tier = 'free';
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
