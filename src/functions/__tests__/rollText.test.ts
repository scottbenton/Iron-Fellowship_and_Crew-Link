import { describe, expect, it } from "vitest";
import {
  ClockProgressionRoll,
  CustomDiceRoll,
  OracleTableRoll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { TrackTypes } from "types/Track.type";
import {
  getClockProgressionRollAnnouncement,
  getCustomDiceRollAnnouncement,
  getOracleRollAnnouncement,
  getRollDescription,
  getRollTitle,
  getStatRollAnnouncement,
  getTrackProgressRollAnnouncement,
  markdownToPlainText,
  withArticle,
} from "../rollText";

const base = {
  timestamp: new Date(0),
  characterId: null,
  uid: "uid",
  gmsOnly: false,
};

const statRoll: StatRoll = {
  ...base,
  type: ROLL_TYPE.STAT,
  rollLabel: "Edge",
  moveName: "Face Danger",
  action: 4,
  modifier: 2,
  challenge1: 3,
  challenge2: 8,
  result: ROLL_RESULT.WEAK_HIT,
};

describe("withArticle", () => {
  it("uses an before numbers said with a vowel sound", () => {
    expect(withArticle(7)).toBe("a 7");
    expect(withArticle(8)).toBe("an 8");
    expect(withArticle(11)).toBe("an 11");
    expect(withArticle(18)).toBe("an 18");
    expect(withArticle(84)).toBe("an 84");
    expect(withArticle(100)).toBe("a 100");
  });
});

describe("markdownToPlainText", () => {
  it("drops marks and makes each line a sentence", () => {
    expect(
      markdownToPlainText("* Role: **Scout**\n* Goal: [Find](id:x) the path")
    ).toBe("Role: Scout. Goal: Find the path");
  });

  it("leaves plain text alone", () => {
    expect(markdownToPlainText("Bolster")).toBe("Bolster");
  });
});

describe("getStatRollAnnouncement", () => {
  it("reads the whole roll, spaced and ended, when verbose", () => {
    expect(getStatRollAnnouncement(statRoll, true)).toBe(
      "Rolled Face Danger using stat Edge. On your action die you rolled a 4 plus 2, for a total of 6. On your challenge dice you rolled a 3 and an 8, for a Weak Hit."
    );
  });

  it("reads the totals and result when brief", () => {
    expect(getStatRollAnnouncement(statRoll, false)).toBe(
      "Rolled Face Danger using stat Edge. Your action total was 6 against 3 and 8, for a Weak Hit."
    );
  });

  it("names a match, adds, negative modifiers and the maximum total", () => {
    expect(
      getStatRollAnnouncement(
        {
          ...statRoll,
          moveName: undefined,
          action: 6,
          modifier: 4,
          adds: 1,
          challenge1: 5,
          challenge2: 5,
          result: ROLL_RESULT.HIT,
        },
        true
      )
    ).toBe(
      "Rolled Edge. On your action die you rolled a 6 plus 4 plus 1 add, for a total of 10, the maximum. On your challenge dice you rolled a 5 and a 5, for a Strong Hit, with a match."
    );
    expect(
      getStatRollAnnouncement({ ...statRoll, modifier: -1 }, true)
    ).toContain("rolled a 4 minus 1, for a total of 3.");
    expect(getStatRollAnnouncement({ ...statRoll, modifier: 0 }, true)).toContain(
      "rolled a 4, for a total of 4."
    );
  });

  it("says when negative momentum cancelled the action die", () => {
    const roll = { ...statRoll, action: 3, matchedNegativeMomentum: true };
    expect(getStatRollAnnouncement(roll, true)).toContain(
      "you rolled a 3, which matched your momentum of -3, so your action die was cancelled. With your modifiers alone, your total is 2."
    );
    expect(getStatRollAnnouncement(roll, false)).toContain(
      "Your action total was 2, with your action die cancelled by momentum, against 3 and 8"
    );
  });
});

describe("getOracleRollAnnouncement", () => {
  const oracleRoll: OracleTableRoll = {
    ...base,
    type: ROLL_TYPE.ORACLE_TABLE,
    rollLabel: "Action",
    roll: 44,
    result: "Bolster",
  };

  it("reads the roll and result", () => {
    expect(getOracleRollAnnouncement(oracleRoll, true)).toBe(
      "Rolled a 44 on the Action table and got: Bolster."
    );
    expect(getOracleRollAnnouncement(oracleRoll, false, true)).toBe(
      "Rolled Action and got: Bolster. A match."
    );
  });

  it("spaces several rolls and reads every column of the result", () => {
    expect(
      getOracleRollAnnouncement(
        {
          ...oracleRoll,
          rollLabel: "Character",
          roll: [12, 80],
          result: "* Role: Scout\n* Goal: Revenge",
          text2: "Name: Bram",
        },
        true
      )
    ).toBe(
      "Rolled 12, 80 on the Character table and got: Role: Scout. Goal: Revenge. Name: Bram."
    );
  });
});

describe("getTrackProgressRollAnnouncement", () => {
  it("names the track type in words", () => {
    const roll: TrackProgressRoll = {
      ...base,
      type: ROLL_TYPE.TRACK_PROGRESS,
      rollLabel: "Kith and kin",
      trackType: TrackTypes.BondProgress,
      trackProgress: 7,
      challenge1: 2,
      challenge2: 2,
      result: ROLL_RESULT.HIT,
    };
    expect(getTrackProgressRollAnnouncement(roll)).toBe(
      "Rolled progress for Bond Progress Kith and kin. Your progress was 7 against a 2 and a 2, for a Strong Hit, with doubles."
    );
  });
});

describe("getClockProgressionRollAnnouncement", () => {
  const clockRoll: ClockProgressionRoll = {
    ...base,
    type: ROLL_TYPE.CLOCK_PROGRESSION,
    rollLabel: "Storm",
    oracleTitle: "Likely",
    roll: 33,
    result: "Yes",
    match: true,
  };

  it("says a match advances two segments", () => {
    expect(getClockProgressionRollAnnouncement(clockRoll, true)).toBe(
      "Rolled a 33 for clock Storm against oracle Likely, a match. Your clock progressed by two segments."
    );
  });

  it("ends every outcome as a sentence", () => {
    expect(
      getClockProgressionRollAnnouncement(
        { ...clockRoll, result: "No", match: false },
        false
      )
    ).toBe("Your clock Storm did not progress.");
  });
});

describe("getCustomDiceRollAnnouncement", () => {
  it("reads each die, the modifier and the total", () => {
    const roll: CustomDiceRoll = {
      ...base,
      type: ROLL_TYPE.CUSTOM_DICE,
      rollLabel: "2d6-1",
      notation: "2d6-1",
      dieSides: 6,
      dieValues: [3, 5],
      modifier: -1,
      total: 7,
    };
    expect(getCustomDiceRollAnnouncement(roll)).toBe(
      "Rolled 2d6-1. Got 3, 5 minus 1, for a total of 7."
    );
    expect(getRollDescription(roll)).toBe("2d6-1. Rolled 3, 5 minus 1. Total 7.");
    expect(getRollTitle(roll)).toBe("2d6-1");
  });
});

describe("getRollDescription", () => {
  it("describes everything a stat roll card shows", () => {
    expect(
      getRollDescription({ ...statRoll, challenge2: 3, action: 1 })
    ).toBe(
      "Face Danger, using Edge. Action die 1 plus 2, total 3. Challenge dice 3 and 3. Weak Hit. Match. One on the action die."
    );
    expect(getRollTitle(statRoll)).toBe("Face Danger");
  });

  it("says when momentum was burned", () => {
    expect(
      getRollDescription({
        ...statRoll,
        momentumBurned: 9,
        result: ROLL_RESULT.HIT,
      })
    ).toContain("Burned 9 momentum in place of the action total. Strong Hit.");
  });

  it("describes an oracle roll with its category and match", () => {
    expect(
      getRollDescription(
        {
          ...base,
          type: ROLL_TYPE.ORACLE_TABLE,
          rollLabel: "Theme",
          oracleCategoryName: "Core",
          roll: 66,
          result: "Fear",
        },
        { oracleMatch: true }
      )
    ).toBe("Core, Theme. Rolled 66. Fear. Match.");
  });
});
