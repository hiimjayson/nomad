export function share(params: { title: string; url: string }) {
  if (navigator.share) {
    navigator.share(params);
  } else {
    navigator.clipboard.writeText(params.url);
  }
}
