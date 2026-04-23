import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { findCharacter } from "../src/practica/findCharacter";

describe("findCharacter tests", () => {
  let startTime: number;

  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    startTime = performance.now();
  });

  afterEach(() => {
    const endTime = performance.now();
  });

  test("findCharacter should get 1 character", () => {
    return findCharacter("morty", "male", "alien", "alive").then((data) => {
      expect(data.length).toBe(1);
    });
  });

  test("findCharacter should get multiple characters with name filter", () => {
    return findCharacter("morty").then((data) => {
      expect(data.length).toBe(68);
    });
  });

  test("findCharacter should get multiple characters with gender filter", () => {
    return findCharacter("", "female").then((data) => {
      expect(data.length).toBe(148);
    });
  });

  test("findCharacter should get multiple characters with species filter", () => {
    return findCharacter("", "", "alien").then((data) => {
      expect(data.length).toBe(205);
    });
  });

  test("findCharacter should get multiple characters with 2 filters", () => {
    return findCharacter("morty", "", "", "unknown").then((data) => {
      expect(data.length).toBe(16);
    });
  });

  test("findCharacter should fail when there are no matching characters", () => {
    let results = ["No characters found", "Request failed"];
    return findCharacter("", "female", "", "unknown").catch((err) => {
      expect(results).toContain(err.message);
    });
  });

  test("findCharacter should fail if no filter is applied ", () => {
    return findCharacter().catch((err) => {
      expect(err.message).toBe("A filter must be applied");
    });
  });
});
