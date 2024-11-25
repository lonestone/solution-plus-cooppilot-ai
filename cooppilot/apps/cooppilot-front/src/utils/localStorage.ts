export enum UserLocalStorageKeys {
  ContentType = "content-type",
  SpeakerDevice = "speaker-device",
  MicDevice = "mic-device",
  MicThreshold = "mic-threshold",
}

export function resetUserLocalStorage() {
  for (const key in localStorage) {
    for (const keyPattern of Object.values(UserLocalStorageKeys)) {
      if (new RegExp("^" + keyPattern.replace(/\{id\}/, ".*") + "$").test(key)) {
        localStorage.removeItem(key);
      }
    }
  }
}
