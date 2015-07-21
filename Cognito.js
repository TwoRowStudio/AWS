// JavaScript source code

// JavaScript Document
// Initialize the Amazon Cognito credentials provider
function initialize(clientID,redirectURL) {
    window.onAmazonLoginReady = function () {
        amazon.Login.setClientId(clientID);
    };
    (function (d) {
        var a = d.createElement('script'); a.type = 'text/javascript';
        a.async = true; a.id = 'amazon-login-sdk';
        a.src = 'https://api-cdn.amazon.com/sdk/login1.js';
        d.getElementById('amazon-root').appendChild(a);
    })(document);


    document.getElementById('LoginWithAmazon').onclick = function () {
        options = { scope: 'profile', interactive: 'auto', popup: false };
        amazon.Login.setUseCookie(true);
        amazon.Login.authorize(options, redirectURL, function (response) {
            console.log(response);
            return false;
        });
    }
}
function matchIdentities (loginResponse, IDPool){
  var cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30',region:'us-east-1'});
  var cognitoIdParams = {
	  IdentityPoolId : IDPool,
	  Logins : {'www.amazon.com':loginResponse.access_token}
  };
  var userProfile;
  userProfile = retrieveProfile(loginResponse)
  .done (function (response) {
	   AWS.config.credentials.Logins = {'www.amazon.com' : loginResponse.access_token};
	   console.log (AWS.config.credentials);
	   cognitoidentity.getId(cognitoIdParams, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     {
			  console.log(data);
			  AWS.config.credentials.identityId = data;
			  AWS.config.credentials.params.RoleSessionName = response.profile.PrimaryEmail;
	  		console.log('name: '+response.profile.Name+' token: '+loginResponse.amazonToken);	
			  getAccessTokens();
		  }// successful response
		});
  });
}

function getAccessTokens(){
	var sts = new AWS.STS();
	var STSParams = {
		RoleArn: AWS.config.credentials.params.roleArn,
		RoleSessionName: AWS.config.credentials.params.RoleSessionName,
		WebIdentityToken:AWS.config.credentials.Logins['www.amazon.com'],
		ProviderId: 'www.amazon.com'
	};
	sts.assumeRoleWithWebIdentity(STSParams, function(err,data){
		if (err) console.log(err);
		else {
			AWS.config.credentials = sts.credentialsFrom(data);
		}
	});
}

function retrieveProfile (loginResponse) {
	var profile = new $.Deferred();
	amazon.Login.retrieveProfile (loginResponse.access_token, function(response){
		  profile.resolve(response);
	});
	return profile.promise();
}