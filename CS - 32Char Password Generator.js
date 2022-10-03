var newPass = generatePassword();

function generatePassword(){
	var MIN_LENGTH = 32;
	var MIN_CHAR_NEEDED = 4;

	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lower = "abcdefghijklmnopqrstuvwxyz";
	var number = "0123456789";
	var validSymbol = "!@#$%^&*()";

	var pwd = '';

	var limit = 10;
	var validPassword = false;

	do {
	pwd = '';

	for (var i = 0; i < MIN_LENGTH; i++){
		var selector = Math.floor(Math.random()*4+1);

		switch (selector){
			case 1 :
				pwd += getPwdChar(upper);
				break;
			case 2 :
				pwd += getPwdChar(lower);
				break;
			case 3 :
				pwd += getPwdChar(number);
				break;
			case 4 :
				pwd += getPwdChar(validSymbol);
				break;
		}
	}

	var validUpper = validatePwd(pwd, /[A-Z]/g, MIN_CHAR_NEEDED);
	var validLower = validatePwd(pwd, /[a-z]/g, MIN_CHAR_NEEDED);
	var validNumber = validatePwd(pwd, /[0-9]/g, MIN_CHAR_NEEDED);
	var validSymbol = validatePwd(pwd, /[\!\@\#\$\%\^\&\*\(\)]/g, MIN_CHAR_NEEDED);

	if (validUpper && validLower && validNumber && validSymbol){
		validPassword = true;
	}

	limit--;

	} while (!validPassword && limit > 0);

	return pwd;
}

function getPwdChar (dataSet){
	var charPos = Math.floor(Math.random()*(dataSet.length + 1));

	return dataSet.substring(charPos,charPos+1);
}


function validatePwd (pwd, pattern, minMatch){

	var count = pwd.match(pattern).length;

	if (count >= minMatch){
		return true;
	} else {
		return false;
	}
}
