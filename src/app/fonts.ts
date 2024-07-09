import { M_PLUS_Rounded_1c, Lato } from "next/font/google";

const mplus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export { mplus, lato };
