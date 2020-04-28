export const CLAIM_TYPES = {
  //
  // Summary:
  //     The URI for a claim that specifies the actor, .
  Actor: 'http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor',
  //
  // Summary:
  //     The URI for a claim that specifies the postal code of an entity, .
  PostalCode: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode',
  //
  // Summary:
  //     The URI for a claim that specifies the primary group SID of an entity, .
  PrimaryGroupSid: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid',
  //
  // Summary:
  //     The URI for a claim that specifies the primary SID of an entity, .
  PrimarySid: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid',
  //
  // Summary:
  //     The URI for a claim that specifies the role of an entity, .
  Role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  //
  // Summary:
  //     The URI for a claim that specifies an RSA key, .
  Rsa: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/rsa',
  //
  // Summary:
  //     The URI for a claim that specifies a serial number, .
  SerialNumber: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber',
  //
  // Summary:
  //     The URI for a claim that specifies a security identifier (SID), .
  Sid: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid',
  //
  // Summary:
  //     The URI for a claim that specifies a service principal name (SPN) claim, .
  Spn: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn',
  //
  // Summary:
  //     The URI for a claim that specifies the state or province in which an entity resides,
  //     .
  StateOrProvince: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/stateorprovince',
  //
  // Summary:
  //     The URI for a claim that specifies the street address of an entity, .
  StreetAddress: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress',
  //
  // Summary:
  //     The URI for a claim that specifies the surname of an entity, .
  Surname: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
  //
  // Summary:
  //     The URI for a claim that identifies the system entity, .
  System: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/system',
  //
  // Summary:
  //     The URI for a claim that specifies a thumbprint, . A thumbprint is a globally
  //     unique SHA-1 hash of an X.509 certificate.
  Thumbprint: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint',
  //
  // Summary:
  //     The URI for a claim that specifies a user principal name (UPN), .
  Upn: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
  //
  // Summary:
  //     The URI for a claim that specifies a URI, .
  Uri: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri',
  //
  // Summary:
  //     The URI for a claim that specifies the user data, .
  UserData: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata',
  //
  // Summary:
  //     The URI for a claim that specifies the version, .
  Version: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/version',
  //
  // Summary:
  //     The URI for a claim that specifies the webpage of an entity, .
  Webpage: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/webpage',
  //
  // Summary:
  //     The URI for a claim that specifies the Windows domain account name of an entity,
  //     .
  WindowsAccountName: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname',
  //
  // Summary:
  //     .
  WindowsDeviceClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim',
  //
  // Summary:
  //     The URI for a claim that specifies the Windows group SID of the device, .
  WindowsDeviceGroup: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup',
  //
  // Summary:
  //     .
  WindowsFqbnVersion: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion',
  //
  // Summary:
  //     .
  WindowsSubAuthority: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority',
  //
  // Summary:
  //     The URI for a claim that specifies the alternative phone number of an entity,
  //     .
  OtherPhone: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/otherphone',
  //
  // Summary:
  //     The URI for a claim that specifies the name of an entity, .
  NameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  //
  // Summary:
  //     The URI for a claim that specifies the name of an entity, .
  Name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  //
  // Summary:
  //     The URI for a claim that specifies the mobile phone number of an entity, .
  MobilePhone: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone',
  //
  // Summary:
  //     The URI for a claim that specifies the anonymous user, .
  Anonymous: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/anonymous',
  //
  // Summary:
  //     The URI for a claim that specifies details about whether an identity is authenticated,
  //     .
  Authentication: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication',
  //
  // Summary:
  //     The URI for a claim that specifies the instant at which an entity was authenticated,
  //     .
  AuthenticationInstant: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant',
  //
  // Summary:
  //     The URI for a claim that specifies the method with which an entity was authenticated,
  //     .
  AuthenticationMethod: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod',
  //
  // Summary:
  //     The URI for a claim that specifies an authorization decision on an entity, .
  AuthorizationDecision: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision',
  //
  // Summary:
  //     The URI for a claim that specifies the cookie path, .
  CookiePath: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/cookiepath',
  //
  // Summary:
  //     The URI for a claim that specifies the country/region in which an entity resides,
  //     .
  Country: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country',
  //
  // Summary:
  //     The URI for a claim that specifies the date of birth of an entity, .
  DateOfBirth: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth',
  //
  // Summary:
  //     The URI for a claim that specifies the deny-only primary group SID on an entity,
  //     . A deny-only SID denies the specified entity to a securable object.
  DenyOnlyPrimaryGroupSid: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid',
  //
  // Summary:
  //     The URI for a claim that specifies the deny-only primary SID on an entity, .
  //     A deny-only SID denies the specified entity to a securable object.
  DenyOnlyPrimarySid: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid',
  //
  // Summary:
  //     The URI for a claim that specifies a deny-only security identifier (SID) for
  //     an entity, . A deny-only SID denies the specified entity to a securable object.
  DenyOnlySid: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid',
  //
  // Summary:
  //     .
  WindowsUserClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim',
  //
  // Summary:
  //     The URI for a claim that specifies the Windows deny-only group SID of the device,
  //     .
  DenyOnlyWindowsDeviceGroup: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup',
  //
  // Summary:
  //     .
  Dsa: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/dsa',
  //
  // Summary:
  //     The URI for a claim that specifies the email address of an entity, .
  Email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  //
  // Summary:
  //     .
  Expiration: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration',
  //
  // Summary:
  //     .
  Expired: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/expired',
  //
  // Summary:
  //     The URI for a claim that specifies the gender of an entity, .
  Gender: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender',
  //
  // Summary:
  //     The URI for a claim that specifies the given name of an entity, .
  GivenName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
  //
  // Summary:
  //     The URI for a claim that specifies the SID for the group of an entity, .
  GroupSid: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid',
  //
  // Summary:
  //     The URI for a claim that specifies a hash value, .
  Hash: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/hash',
  //
  // Summary:
  //     The URI for a claim that specifies the home phone number of an entity, .
  HomePhone: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/homephone',
  //
  // Summary:
  //     .
  IsPersistent: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent',
  //
  // Summary:
  //     The URI for a claim that specifies the locale in which an entity resides, .
  Locality: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality',
  //
  // Summary:
  //     The URI for a claim that specifies the DNS name associated with the computer
  //     name or with the alternative name of either the subject or issuer of an X.509
  //     certificate, .
  Dns: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dns',
  //
  // Summary:
  //     The URI for an X.500 distinguished name claim, such as the subject of an X.509
  //     Public Key Certificate or an entry identifier in a directory services Directory
  //     Information Tree, .
  X500DistinguishedName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname',
};
