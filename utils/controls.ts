import global from "./globalState";

export function enableLink(enable: boolean) {
  const links = document.querySelectorAll(
    ".image-link"
  )! as NodeListOf<HTMLDivElement>;

  links.forEach((link) => {
    link.style.pointerEvents = enable ? "auto" : "none";
  });
}

export function hideAllOtherImages() {
  global.images.forEach((image, index) => {
    if (index === global.activeIndex) return;
    image.hide();
  });
}

export function enableLenis(enable: boolean) {
  if (enable) {
    global.lenis?.start();
  } else {
    global.lenis?.stop();
  }
}

export function setBackgroundColor(color: string) {
  document.documentElement.style.setProperty("--backgroundColor", color);
}
