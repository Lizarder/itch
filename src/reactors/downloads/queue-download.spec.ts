import suite, { TestWatcher, actions } from "../../test-suite";

import navigation from "../navigation";
import queueDownload from "./queue-download";

suite(__filename, s => {
  s.case("queueDownload", async t => {
    const w = new TestWatcher();
    navigation(w);
    queueDownload(w);

    t.same(
      Object.keys(w.store.getState().downloads.items).length,
      0,
      "starts off with no downloads",
    );

    await t.rejects(w.dispatch(actions.queueDownload({} as null)));

    const queueAction = actions.queueDownload({
      game: {
        id: 12,
      } as any,
      caveId: null,
      handPicked: false,
      incremental: false,
      reason: "install",
      totalSize: 0,
      upgradePath: null,
      upload: null,
    });
    await w.dispatch(queueAction);
    t.same(
      Object.keys(w.store.getState().downloads.items).length,
      1,
      "queues downloads",
    );

    await w.dispatch(queueAction);
    t.same(
      Object.keys(w.store.getState().downloads.items).length,
      1,
      "doesn't queue download more than once",
    );
    t.same(
      w.store.getState().session.navigation.id,
      "downloads",
      "..but switches to downloads tab",
    );
  });
});
