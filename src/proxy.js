import { NextResponse } from "next/server";

const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN || "Br9K1KSx3MZuF6fp5Oyz";
const PRERENDER_TIMEOUT_MS = 4000;

export async function proxy(request) {

  const userAgent = request.headers.get("user-agent");

  const bots = [
    "googlebot",
    "yahoo! slurp",
    "bingbot",
    "yandex",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "developers.google.com/+/web/snippet",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "redditbot",
    "applebot",
    "whatsapp",
    "flipboard",
    "tumblr",
    "bitlybot",
    "skypeuripreview",
    "nuzzel",
    "discordbot",
    "google page speed",
    "qwantify",
    "pinterestbot",
    "bitrix link preview",
    "xing-contenttabreceiver",
    "chrome-lighthouse",
    "telegrambot",
    "OAI-SearchBot",
    "ChatGPT",
    "GPTBot",
    "Perplexity",
    "ClaudeBot",
    "Amazonbot",
    "integration-test",
  ];

  const IGNORE_EXTENSIONS = [
    ".js",
    ".css",
    ".xml",
    ".less",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
    ".doc",
    ".txt",
    ".ico",
    ".rss",
    ".zip",
    ".mp3",
    ".rar",
    ".exe",
    ".wmv",
    ".avi",
    ".ppt",
    ".mpg",
    ".mpeg",
    ".tif",
    ".wav",
    ".mov",
    ".psd",
    ".ai",
    ".xls",
    ".mp4",
    ".m4a",
    ".swf",
    ".dat",
    ".dmg",
    ".iso",
    ".flv",
    ".m4v",
    ".torrent",
    ".woff",
    ".ttf",
    ".svg",
    ".webmanifest",
  ];

  const isBot =
    userAgent && bots.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));
  const isPrerender = request.headers.get("X-Prerender");
  const pathname = new URL(request.url).pathname;
  const extension = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 1);

  if (
    isPrerender ||
    !isBot ||
    (extension.length && IGNORE_EXTENSIONS.includes(extension))
  ) {
    return NextResponse.next();
  }

  const newURL = `http://service.prerender.io/${request.url}`;
  const newHeaders = new Headers(request.headers);
  newHeaders.set("X-Prerender-Token", PRERENDER_TOKEN);
  newHeaders.set("X-Prerender-Int-Type", "NextJS");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PRERENDER_TIMEOUT_MS);

  try {
    const res = await fetch(new Request(newURL, {
      headers: newHeaders,
      redirect: "manual",
      signal: controller.signal,
    }));
    clearTimeout(timeoutId);

    // Si prerender.io retourne une erreur, servir la page normalement
    if (res.status >= 400) {
      return NextResponse.next();
    }

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set("X-Redirected-From", request.url);

    const { readable, writable } = new TransformStream();
    res.body.pipeTo(writable).catch(() => {});

    return new NextResponse(readable, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/).*)'],
};
