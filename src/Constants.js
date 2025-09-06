import axios from "axios";

export const API_URL = import.meta.env.VITE_URL;

export let branches = [];

import defaultUserAvatar from "../src/assets/defaultAvatar/defaultAvatar.svg";

import b1 from "../src/assets/avatar/b1.svg";
import b2 from "../src/assets/avatar/b2.svg";
import b3 from "../src/assets/avatar/b3.svg";
import b4 from "../src/assets/avatar/b4.svg";
import b5 from "../src/assets/avatar/b5.svg";
import b6 from "../src/assets/avatar/b6.svg";
import b7 from "../src/assets/avatar/b7.svg";
import b8 from "../src/assets/avatar/b8.svg";
import b9 from "../src/assets/avatar/b9.svg";
import b10 from "../src/assets/avatar/b10.svg";
import bulldog from "../src/assets/avatar/bulldog.svg";
import g1 from "../src/assets/avatar/g1.svg";
import g2 from "../src/assets/avatar/g2.svg";
import g3 from "../src/assets/avatar/g3.svg";
import g4 from "../src/assets/avatar/g4.svg";
import g5 from "../src/assets/avatar/g5.svg";
import g6 from "../src/assets/avatar/g6.svg";
import g7 from "../src/assets/avatar/g7.svg";
import g8 from "../src/assets/avatar/g8.svg";
import g9 from "../src/assets/avatar/g9.svg";
import g10 from "../src/assets/avatar/g10.svg";

export const avatars = {
  b1,
  b2,
  b3,
  b4,
  b5,
  b6,
  b7,
  b8,
  b9,
  b10,
  bulldog,
  g1,
  g2,
  g3,
  g4,
  g5,
  g6,
  g7,
  g8,
  g9,
  g10,
};

import blue_tie_pants from "../src/assets/clothes/blue_tie_pants.svg";
import black_suit_tie from "../src/assets/clothes/black_suit_tie.svg";
import white_coat from "../src/assets/clothes/white_coat.svg";
import white_sweater from "../src/assets/clothes/white_sweater.svg";
import white_formal from "../src/assets/clothes/white_formal.svg";
import gray_necklace from "../src/assets/clothes/gray_necklace.svg";
import female_unform from "../src/assets/clothes/female_unform.svg";
import male_unform from "../src/assets/clothes/male_unform.svg";

export const clothes = {
  blue_tie_pants,
  black_suit_tie,
  white_coat,
  white_sweater,
  white_formal,
  gray_necklace,
  female_unform,
  male_unform,
};

export const avatarandclothes = {
  blue_tie_pants: { src: blue_tie_pants, type: "clothes" },
  black_suit_tie: { src: black_suit_tie, type: "clothes" },
  white_coat: { src: white_coat, type: "clothes" },
  white_sweater: { src: white_sweater, type: "clothes" },
  white_formal: { src: white_formal, type: "clothes" },
  gray_necklace: { src: gray_necklace, type: "clothes" },
  female_unform: { src: female_unform, type: "clothes" },
  male_unform: { src: male_unform, type: "clothes" },
  b1: { src: b1, type: "avatar" },
  b2: { src: b2, type: "avatar" },
  b3: { src: b3, type: "avatar" },
  b4: { src: b4, type: "avatar" },
  b5: { src: b5, type: "avatar" },
  b6: { src: b6, type: "avatar" },
  b7: { src: b7, type: "avatar" },
  b8: { src: b8, type: "avatar" },
  b9: { src: b9, type: "avatar" },
  b10: { src: b10, type: "avatar" },
  bulldog: { src: bulldog, type: "avatar" },
  g1: { src: g1, type: "avatar" },
  g2: { src: g2, type: "avatar" },
  g3: { src: g3, type: "avatar" },
  g4: { src: g4, type: "avatar" },
  g5: { src: g5, type: "avatar" },
  g6: { src: g6, type: "avatar" },
  g7: { src: g7, type: "avatar" },
  g8: { src: g8, type: "avatar" },
  g9: { src: g9, type: "avatar" },
  g10: { src: g10, type: "avatar" },
};

export const fetchBranches = async () => {
  try {
    const { data } = await axios.get(API_URL + "/getbranches");
    branches = data;
    return data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const fetchDeletedBranches = async () => {
  try {
    const { data } = await axios.get(API_URL + "/getDeleteBranches");
    branches = data;
    return data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

fetchBranches();

export const categories = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
  },
  {
    id: "developmental",
    name: "Developmetal Psychology",
  },
  {
    id: "psychological",
    name: "Psychological Assessment ",
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
  },
  {
    id: "general",
    name: "General Psychology",
  },
];

export const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const modes = [
  {
    mode: "mastery",
  },
  {
    mode: "competition",
  },
  {
    mode: "review",
  },
];

export const defaultAvatar = defaultUserAvatar;
