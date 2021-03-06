// tslint:disable:no-shadowed-variable

import suite, { fixture } from "../test-suite";

import { game, Schema, arrayOf } from "./schemas";
import normalize from "./normalize";

suite(__filename, t => {
  let collectionGamesSchema = new Schema("collectionGames");
  collectionGamesSchema.define({
    games: arrayOf(game),
  });

  t.case("normalize collection games", async t => {
    const apiResponse = fixture.json("api/collection/27968/games");
    const result = normalize(apiResponse, collectionGamesSchema);
    t.true(result.entities.games);
    const g = result.entities.games["72440"];
    t.is(g.canBeBought, true);
    t.is(g.minPrice, 999);
    t.same(g.createdAt, new Date("2016-06-20 10:21:20 +0"));
  });
});
