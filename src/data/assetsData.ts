import background from "../assets/bg.jpg";
import bb_chip from "../assets/bb-chip.png";
import bot_avatar_1 from "../assets/bot_avatar_1.jpg";
import bot_avatar_2 from "../assets/bot_avatar_2.jpg";
import bot_avatar_3 from "../assets/bot_avatar_3.jpg";
import bot_avatar_4 from "../assets/bot_avatar_4.jpg";
import bot_avatar_5 from "../assets/bot_avatar_5.jpg";
import bot_avatar_6 from "../assets/bot_avatar_6.jpg";
import bot_avatar_7 from "../assets/bot_avatar_7.jpg";
import bot_avatar_8 from "../assets/bot_avatar_8.jpg";
import card_back from "../assets/card_back3.png";
import card_back_2 from "../assets/card_back.png";
import card_back_3 from "../assets/card_back2.jpg";
import dealer_chip from "../assets/chip.png";
import clicker from "../assets/clicker.png";
import incognito_avatar from "../assets/incognito_avatar.jpg";
import range1 from "../assets/range1.png";
import range2 from "../assets/range2.png";
import sb_chip from "../assets/sb-chip.png";
import speech from "../assets/speech.png";
import clicker_chip from "../assets/clicker-chip.png";
import btn_red from "../assets/btn_red.png";
import btn_black from "../assets/btn_black.png";
import btn_green from "../assets/btn_green.png";
import btn_orange from "../assets/btn_orange.png";
import btn_blue from "../assets/btn_blue.png";
import sound_icon from "../assets/sound.png";
import no_sound_icon from "../assets/no-sound.png";
import music_icon from "../assets/music.png";
import no_music_icon from "../assets/no-music.png";
import rules from "../assets/rules.jpg";
import cards_rules from "../assets/cards-rules.png";
// @ts-ignore to avoid ts error of unknown module
import call_sound from "../assets/call.mp3";
// @ts-ignore to avoid ts error of unknown module
import raise_sound from "../assets/raise.mp3";
// @ts-ignore to avoid ts error of unknown module
import fold_sound from "../assets/fold.mp3";
// @ts-ignore to avoid ts error of unknown module
import check_sound from "../assets/check.mp3";
// @ts-ignore to avoid ts error of unknown module
import all_in_sound from "../assets/all-in.mp3";
// @ts-ignore to avoid ts error of unknown module
import shuffle from "../assets/shuffle.mp3";
import { Howl } from "howler";
import { TurnsEnum } from "../types";
const { call, raise, fold, check, allIn } = TurnsEnum

export const sounds = {
  [call]: new Howl({
    src: call_sound as string,
  }),

  [raise]: new Howl({
    src: raise_sound as string,
  }),

  [allIn]: new Howl({
    src: all_in_sound as string,
  }),

  [fold]: new Howl({
    src: fold_sound as string,
  }),

  [check]: new Howl({
    src: check_sound as string,
  }),
}

export const shuffle_sound = new Howl({
  volume: 0.8,
  src: shuffle as string,
});

// sounds.play()

export const assetsNames = [
  "background",
  "bb_chip",
  "bot_avatar_1",
  "bot_avatar_2",
  "bot_avatar_3",
  "bot_avatar_4",
  "bot_avatar_5",
  "bot_avatar_6",
  "bot_avatar_7",
  "bot_avatar_8",
  "card_back",
  "card_back_2",
  "card_back_3",
  "dealer_chip",
  "clicker",
  "incognito_avatar",
  "range1",
  "range2",
  "sb_chip",
  "speech",
  "clicker_chip",
  "btn_red",
  "btn_black",
  "btn_green",
  "btn_orange",
  "btn_blue",
  "sound_icon",
  "no_sound_icon",
  "music_icon",
  "no_music_icon",
  "rules",
  "cards_rules"
]

export const assetsUrls = [
  background,
  bb_chip,
  bot_avatar_1,
  bot_avatar_2,
  bot_avatar_3,
  bot_avatar_4,
  bot_avatar_5,
  bot_avatar_6,
  bot_avatar_7,
  bot_avatar_8,
  card_back,
  card_back_2,
  card_back_3,
  dealer_chip,
  clicker,
  incognito_avatar,
  range1,
  range2,
  sb_chip,
  speech,
  clicker_chip,
  btn_red,
  btn_black,
  btn_green,
  btn_orange,
  btn_blue,
  sound_icon,
  no_sound_icon,
  music_icon,
  no_music_icon,
  rules,
  cards_rules
]