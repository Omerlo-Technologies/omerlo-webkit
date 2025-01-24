import { json, type RequestHandler } from "@sveltejs/kit";
import { clearAuthorizationCookies } from 'omerlo-webkit/reader/server';

export const DELETE: RequestHandler = ({ cookies }) => {
  clearAuthorizationCookies(cookies);
  return json(201);
}
