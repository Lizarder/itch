import { Fetcher } from "./types";

import db from "../db";

import normalize from "../api/normalize";
import { user } from "../api/schemas";

import { pathToId, userToTabData } from "../util/navigation";

export default class UserFetcher extends Fetcher {
  constructor() {
    super();
  }

  async work(): Promise<void> {
    const { path } = this.tabData();

    const userId = +pathToId(path);

    let localUser = db.users.findOneById(userId);
    let pushUser = (user: typeof localUser) => {
      if (user) {
        this.push(userToTabData(user));
      }
    };
    pushUser(localUser);

    const normalized = await this.withApi(async api => {
      return normalize(await api.user(userId), { user });
    });

    pushUser(normalized.entities.users[normalized.result.userId]);
  }
}
