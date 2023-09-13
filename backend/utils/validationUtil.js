export { validateNotEmpty, validateEmail, validatePassword, validateLogin  };

function validateNotEmpty(input) {
    if (input === null || input === "") {
        return false;
    }
    return true;
}

function validateEmail(input) {

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!input.match(validRegex)) {
        return false;
    }
    return true;
}

function validatePassword(input) {

    const validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    
    if (!input.match(validRegex)) {
        return false;
    }
    return true;
}

function validateLogin(input) {
    
    if (input === null || input === "") {
        return false;
/*     }
    if (input === null || input === "") {
        return false; */
    }
    return true;
}