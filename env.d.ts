/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: "development" | "production";
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FLASK_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// [mk] for enum ts coding
/**
 * tEnumKeys<typeof nftStateEnum>
 * @returns
 * [ "enum.key1" , "enum.key2"]
 */
type tEnumKeys<tE> = keyof tE;
/**
 * tEnumValues<typeof nftStateEnum>
 * @returns
 * [ enum.value1 , enum.value2 ]
 */
type tEnumValues<tE> = tE[keyof tE];
/**
 * tEnumObj<nftStateEnum, string>
 * @returns
 * { enum.value1 : T , enum.value2 : T }
 */
type tEnumObj<E, T> = { [K in E]: T };
/**
 * tLabelEnumObj<typeof nftStateEnum>
 * @returns
 * { "enum.key1" : enum.value1 , "enum.key2" : enum.value2  }
 */
type tLabelEnumObj<tE> = { [K in keyof tE]: tE[K] };

// [mk] for vuex ts coding
type tVuexDispatch = (type: string, payload?: any) => any;
type tVuexCommit = (type: string, payload?: any) => any;
interface iVuexActionContext<T, R> {
  state: T;
  commit: tVuexCommit;
  dispatch: tVuexDispatch;
}

// [mk] for http provider ts coding
interface iServerResponseWithT<T> {
  code: number;
  data: T | T[];
  msg: string;
}

// [mk] for http provider output
interface iProviderOutput {
  result: boolean;
  msg?: string;
}
interface iProviderOutputWithT<T> {
  result: boolean;
  code?: number;
  data: T | null;
  msg?: string;
}
interface iProviderOutputArrayWithT<T> {
  result: boolean;
  data: T[];
  msg: string;
}
