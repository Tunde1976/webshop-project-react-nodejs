export default function reducer (state, action) {
    switch (action.type) {
        case 'email': {
            return {
                email: action.email,
                password: state.password,
                
                emailError: state.emailError,
                passwordError: state.passwordError
            }
        }
        case 'password': {
            return {
                email: state.email,
                password: action.password,
                
                emailError: state.emailError,
                passwordError: state.passwordError
            }
        }
        case 'emailError': {
            return {
                email: state.email,
                password: state.password,
                
                emailError: action.emailError,
                passwordError: state.passwordError
            }
        }
        case 'passwordError': {
            return {
                email: state.email,
                password: state.password,
                
                emailError: state.emailError,
                passwordError: action.passwordError
            }
        }
        case 'reset': {
            return {
                email: "",
                password: "",
                emailError: null,
                passwordError: null
            }
        }
    }
    return state;
}
let emailErrorHelper;
let passwordErrorHelper