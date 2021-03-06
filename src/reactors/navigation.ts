import * as actions from "../actions";
import { Watcher } from "./watcher";

import staticTabData from "../constants/static-tab-data";

import { createSelector } from "reselect";

import { IAppState } from "../types";

import { contains } from "underscore";

export default function(watcher: Watcher) {
  watcher.on(actions.clearFilters, async (store, action) => {
    store.dispatch(
      actions.updatePreferences({
        onlyCompatibleGames: false,
        onlyInstalledGames: false,
        onlyOwnedGames: false,
      }),
    );
  });

  watcher.on(actions.navigate, async (store, action) => {
    const state = store.getState();
    const { id, background } = action.payload;

    const { tabData } = state.session;

    const constantTabs = new Set<string>(
      state.session.navigation.tabs.constant,
    );

    if (constantTabs.has(id)) {
      // switching to constant tab, that's good
      if (!background) {
        store.dispatch(actions.focusTab({ id }));
      }
      return;
    }

    if (tabData[id]) {
      // switching to existing tab by id - that's fine
      if (!background) {
        store.dispatch(actions.focusTab({ id }));
      }
      return;
    }

    for (const tabId of Object.keys(tabData)) {
      if (tabData[tabId].path === id) {
        // switching by path is cool
        if (!background) {
          store.dispatch(actions.focusTab({ id: tabId }));
        }
        return;
      }
    }

    const { data } = action.payload;

    // must be a new tab then!
    if (staticTabData[id]) {
      store.dispatch(
        actions.internalOpenTab({
          id,
          background,
          data: {
            path: id,
            ...data,
          },
        }),
      );
    } else {
      store.dispatch(
        actions.openTab({
          background,
          data: {
            path: id,
            ...data,
          },
        }),
      );
    }
  });

  watcher.on(actions.evolveTab, async (store, action) => {
    const { id, path, extras } = action.payload;

    store.dispatch(
      actions.tabEvolved({
        id,
        data: {
          path,
          ...extras,
        },
      }),
    );
  });

  watcher.on(actions.closeAllTabs, async (store, action) => {
    const { transient } = store.getState().session.navigation.tabs;

    // woo !
    for (const id of transient) {
      store.dispatch(actions.closeTab({ id }));
    }
  });

  watcher.on(actions.closeCurrentTab, async (store, action) => {
    const { tabs, id } = store.getState().session.navigation;
    const { transient } = tabs;

    if (contains(transient, id)) {
      store.dispatch(actions.closeTab({ id }));
    }
  });

  watcher.on(actions.downloadStarted, async (store, action) => {
    store.dispatch(actions.navigate({ id: "downloads", background: true }));
  });

  let pathSelector: (state: IAppState) => void;

  watcher.onAll(async (store, action) => {
    if (!pathSelector) {
      pathSelector = createSelector(
        (state: IAppState) => state.session.navigation.id,
        id => {
          setImmediate(() => {
            store.dispatch(actions.tabChanged({ id }));
          });
        },
      );
    }
    pathSelector(store.getState());
  });
}
