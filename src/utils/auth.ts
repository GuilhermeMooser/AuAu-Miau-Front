import { parseCookies, destroyCookie, setCookie } from "nookies";
import { Login } from "@/types/login";

export const authenticate = (login: Login) => {
  setCookie(null, "login", JSON.stringify(login), {
    maxAge: 1 * 24 * 60 * 60,
    path: "/",
    domain: "localhost",
  });
};

export const logout = () => {
  destroyCookie(null, "login", {
    path: "/",
    domain: "localhost",
  });
};

export const getAuth = () => {
  const { login } = parseCookies();
  if (login) {
    const auth: Login = JSON.parse(login);
    return auth;
  }

  return null;
};
