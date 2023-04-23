import global from "./globalState";

export function enablePointer(enable: boolean) {
  document.documentElement.style.pointerEvents = enable ? "auto" : "none";
}

export function enableScroll(enable: boolean) {
  if (enable) {
    global.lenis!.start();
  } else {
    global.lenis!.stop();
  }
}

export function enableLink(enable: boolean) {
  const links = document.querySelectorAll(
    ".image-link"
  )! as NodeListOf<HTMLDivElement>;

  links.forEach((link) => {
    link.style.pointerEvents = enable ? "auto" : "none";
  });
}

export function enableBack(enable: boolean) {
  const back = document.querySelector(".page-back") as HTMLAnchorElement;
  back.style.pointerEvents = enable ? "auto" : "none";
}

export function showAllImages() {
  global.images.forEach((image) => {
    image.show();
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

export function setFontColor(color: string) {
  document.documentElement.style.setProperty("--fontColor", color);
}
