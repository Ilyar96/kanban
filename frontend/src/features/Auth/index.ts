// Login
export type { LoginSchema } from "./LoginByCredentials/model/types/loginSchema";
export { loginByUsername } from "./LoginByCredentials/model/services/loginByUsername/loginByUsername";
export { LoginForm } from "./LoginByCredentials/ui/LoginForm/LoginForm";
export {
	loginActions,
	loginReducer,
} from "./LoginByCredentials/model/slice/loginByCredentialsSlice";

export { getLoginUsernameOrEmail } from "./LoginByCredentials/model/selectors/getLoginUsernameOrEmail/getLoginUsernameOrEmail";
export { getLoginPassword } from "./LoginByCredentials/model/selectors/getLoginPassword/getLoginPassword";
export { getLoginIsLoading } from "./LoginByCredentials/model/selectors/getLoginIsLoading/getLoginIsLoading";
export { getLoginError } from "./LoginByCredentials/model/selectors/getLoginError/getLoginError";

// Register
export type { RegisterSchema } from "./RegisterByCredentials/model/types/registerSchema";
export { registerByCredentials } from "./RegisterByCredentials/model/services/registerByCredentials/registerByCredentials";
export { RegisterForm } from "./RegisterByCredentials/ui/RegisterForm/RegisterForm";
export {
	registerActions,
	registerReducer,
} from "./RegisterByCredentials/model/slice/registerByCredentialsSlice";

export { getRegisterUsername } from "./RegisterByCredentials/model/selectors/getRegisterUsername/getRegisterUsername";
export { getRegisterEmail } from "./RegisterByCredentials/model/selectors/getRegisterEmail/getRegisterEmail";
export { getRegisterPassword } from "./RegisterByCredentials/model/selectors/getRegisterPassword/getRegisterPassword";
export { getRegisterIsLoading } from "./RegisterByCredentials/model/selectors/getRegisterIsLoading/getRegisterIsLoading";
export { getRegisterError } from "./RegisterByCredentials/model/selectors/getRegisterError/getRegisterError";
