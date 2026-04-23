import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { listEpisodes } from "../src/practica/listEpisodes";

describe("listEpisodes tests", () => {
  let startTime: number;

  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    startTime = performance.now();
  });

  afterEach(() => {
    const endTime = performance.now();
  });
  test("listEpisodes should get one episode", () => {
    return listEpisodes([1]).then((data) => {
      expect(data[0]).toStrictEqual({
        name: "Pilot",
        air_date: "December 2, 2013",
      });
    });
  });

  test("listEpisodes should get multiple info of episodes", () => {
    return listEpisodes([1, 20]).then((data) => {
      expect(data[0]).toStrictEqual({
        name: "Pilot",
        air_date: "December 2, 2013",
      });
      expect(data[1]).toStrictEqual({
        name: "Look Who's Purging Now",
        air_date: "September 27, 2015",
      });
    });
  });

  test("listEpisodes should get multiple episodes", () => {
    return listEpisodes([1, 11, 21, 31, 41, 51]).then((data) => {
      expect(data.length).toBe(6);
    });
  });

  test("listEpisodes should return error when a list isn't provided", () => {
    return listEpisodes([]).catch((err) => {
      expect(err.message).toBe("No episode IDs provided");
    });
  });

  test("listEpisodes should return error when episode doesn't exist", () => {
    return listEpisodes([52]).catch((err) => {
      expect(err.message).toBe("Request failed");
    });
  });

  test("listEpisodes should return error when 1 episode doesn't exist in the list", () => {
    return listEpisodes([1, 21, 52]).catch((err) => {
      expect(err.message).toBe("Missing episodes");
    });
  });
});
