import { Item } from "@/gl/parts/Item";
import Lenis from "@studio-freight/lenis";

// global statuses not need to subscribe
interface GlobalType {
  images: Item[];
  activeIndex: number;
  lenis: Lenis | null;
  distance: number;
  imagesLength: number;
}

const global: GlobalType = {
  images: [],
  activeIndex: 0,
  lenis: null,
  distance: 1300,
  imagesLength: 5,
};

export default global;
