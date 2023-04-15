export interface ImageDataType {
  main: string;
  subtitle: string;
  imagePath: string;
  maskPath: string;
}

export const imageDatas: ImageDataType[] = [
  {
    main: "京都",
    subtitle: "錦市場",
    imagePath: "/img/1.jpg",
    maskPath: "/img/mask1.jpeg",
  },
  {
    main: "祇園",
    subtitle: "四条",
    imagePath: "/img/2.jpg",
    maskPath: "/img/mask2.jpeg",
  },
  {
    main: "嵐山",
    subtitle: "竹の道",
    imagePath: "/img/3.jpg",
    maskPath: "/img/mask3.jpeg",
  },
  {
    main: "京都",
    subtitle: "稲荷駅",
    imagePath: "/img/4.jpg",
    maskPath: "/img/mask4.jpeg",
  },
  {
    main: "京都",
    subtitle: "伏見稲荷大社",
    imagePath: "/img/5.jpg",
    maskPath: "/img/mask5.jpeg",
  },
];
