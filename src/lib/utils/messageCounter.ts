// import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const MAX_FREE_MESSAGES = 3;
export const COOKIE_NAME = "guest_messages_count";

export function getMessageCount(cookieStore: ReadonlyRequestCookies) {
  const counter = cookieStore.get(COOKIE_NAME);
  return counter ? parseInt(counter.value) : 0;
}

export function incrementMessageCount(cookieStore: ReadonlyRequestCookies) {
  const currentCount = getMessageCount(cookieStore);
  cookieStore.set(COOKIE_NAME, (currentCount + 1).toString(), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  return currentCount + 1;
}

export function getRemainingMessages(cookieStore: ReadonlyRequestCookies) {
  const currentCount = getMessageCount(cookieStore);
  return Math.max(0, MAX_FREE_MESSAGES - currentCount);
}

export function hasRemainingMessages(cookieStore: ReadonlyRequestCookies) {
  return getRemainingMessages(cookieStore) > 0;
}
