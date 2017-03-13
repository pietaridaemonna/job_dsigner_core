var ldap = require('ldapjs');
ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;
var client = ldap.createClient({
      url: 'ldap://batman.com/cn='+username+', ou=users, ou=compton, dc=batman, dc=com',
      timeout: 5000,
      connectTimeout: 10000
});
var opts = {
  filter: '(&(objectclass=user)(samaccountname='+username+'))',
  scope: 'sub',
  //attributes: ['objectGUID']
  // This attribute list is what broke your solution
  attributes: ['objectGUID','sAMAccountName','cn','mail','manager','memberOf']
};

console.log('--- going to try to connect user ---');

try {
    client.bind(username, password, function (error) {
        if(error){
            console.log(error.message);
            client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
        } else {
            console.log('connected');
            client.search('ou=users, ou=compton, dc=batman, dc=com', opts, function(error, search) {
                console.log('Searching.....');

                search.on('searchEntry', function(entry) {
                    if(entry.object){
                        console.log('entry: %j ' + JSON.stringify(entry.object));
                    }
                    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
                });

                search.on('error', function(error) {
                    console.error('error: ' + error.message);
                    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
                });

                // don't do this here
                //client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
            });
        }
    });
} catch(error){
    console.log(error);
    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
}