// Public barrel — surface of @astravault/alpaca-client.

export { AlpacaClient } from "./client.js";
export {
  discover,
  ALPACA_DISCOVERY_PORT,
  ALPACA_DISCOVERY_QUERY,
  ALPACA_IPV6_MULTICAST,
} from "./discovery.js";
export {
  AlpacaError,
  AlpacaHttpError,
  AlpacaDeviceError,
  AlpacaTimeoutError,
  AlpacaErrorCodes,
  type AlpacaErrorCode,
} from "./errors.js";
export {
  TransactionCounter,
  type AlpacaResponse,
  type AlpacaTransactionMeta,
} from "./transactions.js";
export type {
  AlpacaDeviceType,
  AlpacaConfiguredDevice,
  AlpacaServerDescription,
  DiscoveredServer,
  DiscoveryOptions,
  AlpacaClientOptions,
  AlpacaRequestOptions,
  AlpacaHttpMethod,
  AlpacaParamValue,
  AlpacaParams,
  AlpacaImageArrayResponse,
} from "./types.js";
export {
  EquatorialSystem,
  AlignmentMode,
  CameraState,
  SensorType,
} from "./types.js";
export { TelescopeDevice } from "./devices/telescope.js";
export { CameraDevice } from "./devices/camera.js";
export { FocuserDevice } from "./devices/focuser.js";
export { FilterWheelDevice } from "./devices/filterwheel.js";
export { ObservingConditionsDevice } from "./devices/observingconditions.js";
