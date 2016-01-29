var SamlStrategy = require('passport-saml').Strategy
var oid2name = require('./oid2name');

module.exports = function (passport, config) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new SamlStrategy(
    {
      path: config.passport.saml.path,
      entryPoint: config.passport.saml.entryPoint,
      issuer: config.passport.saml.issuer
    },
    function(profile, done) {
      var user = {};
      console.error('PROFILE BEFORE');
      console.dir(profile);
      oid2name(profile);
      console.error('PROFILE AFTER');
      console.dir(profile);
      user = {
        id : profile.eduPersonPrincipalName,
        email : profile.email,
        displayName : profile.cn || profile.displayName,
        firstName : profile.givenName,
        lastName : profile.sn,
        groups : profile.eduPersonEntitlement ? profile.eduPersonEntitlement.sort() : [],
        affiliations: profile.eduPersonScopedAffiliation ? profile.eduPersonScopedAffiliation.sort() : [],
      };
      console.error('USER');
      console.dir(user);
      return done(null, user);
    }
  ));

}
