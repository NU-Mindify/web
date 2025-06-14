import axios from "axios"

export const API_URL = import.meta.env.VITE_URL


export let branches = []

import b1 from "../src/assets/avatar/b1.svg"
import b2 from "../src/assets/avatar/b2.svg"
import b3 from "../src/assets/avatar/b3.svg"
import b4 from "../src/assets/avatar/b4.svg"
import b5 from "../src/assets/avatar/b5.svg"
import b6 from "../src/assets/avatar/b6.svg"
import b7 from "../src/assets/avatar/b7.svg"
import b8 from "../src/assets/avatar/b8.svg"
import b9 from "../src/assets/avatar/b9.svg"
import b10 from "../src/assets/avatar/b10.svg"
import bulldog from "../src/assets/avatar/bulldog.svg"
import g1 from "../src/assets/avatar/g1.svg"
import g2 from "../src/assets/avatar/g2.svg"
import g3 from "../src/assets/avatar/g3.svg"
import g4 from "../src/assets/avatar/g4.svg"
import g5 from "../src/assets/avatar/g5.svg"
import g6 from "../src/assets/avatar/g6.svg"
import g7 from "../src/assets/avatar/g7.svg"
import g8 from "../src/assets/avatar/g8.svg"
import g9 from "../src/assets/avatar/g9.svg"
import g10 from "../src/assets/avatar/g10.svg"

export const avatars = [
  b1, b2,
  b3, b4,
  b5, b6,
  b7, b8,
  b9, b10,
  bulldog,
  g1, g2,
  g3, g4,
  g5, g6,
  g7, g8,
  g9, g10,
]


export const fetchBranches = async () => {
  try {
    const { data } = await axios.get(API_URL + "/getbranches")
    branches = data
    return data
  } catch (error) {
    console.error("Error fetching branches:", error)
    return []
  }
}




fetchBranches()

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
  }
]

export const levels = [1,2,3,4,5,6,7,8,9,10]

export const modes = [
  {
    mode: "mastery"
  },
  {
    mode: "competition"
  },
  {
    mode: "review"
  }
]

export const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/055/581/121/non_2x/default-profile-picture-icon-avatar-photo-placeholder-illustration-vector.jpg"