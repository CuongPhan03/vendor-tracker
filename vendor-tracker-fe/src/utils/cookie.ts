import Cookies from "js-cookie";

export function setCookie(name: string, value: string, expires?: Date) {
  return Cookies.set(name, value, {
    expires: expires ?? new Date(Date.now() + 60 * 60 * 1000),
    sameSite: "lax",
  });
}

export function getCookie(name: string) {
  return Cookies.get(name);
}

export function removeCookie(name: string) {
  return Cookies.remove(name);
}
