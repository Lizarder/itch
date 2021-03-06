import { join } from "path";
import butler from "../../util/butler";
import { devNull } from "../../logger";
import Context from "../../context";

export type LaunchType = "native" | "html" | "external" | "native" | "shell";

export default async function launchTypeForAction(
  ctx: Context,
  appPath: string,
  actionPath: string,
): Promise<LaunchType> {
  if (/\.(app|exe|bat|sh)$/i.test(actionPath)) {
    return "native";
  }

  if (/\.html?$/i.test(actionPath)) {
    return "html";
  }

  if (/^https?:/i.test(actionPath)) {
    return "external";
  }

  const fullPath = join(appPath, actionPath);

  const confRes = await butler.configureSingle({
    path: fullPath,
    logger: devNull,
    ctx,
  });
  if (!confRes) {
    return "shell";
  }

  switch (confRes.flavor) {
    case "windows":
    case "windows-script":
    case "macos":
    case "linux":
    case "app-macos":
      return "native";
    default:
      return "shell";
  }
}
