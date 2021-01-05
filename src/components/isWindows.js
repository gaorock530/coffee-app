const userAgent = navigator.userAgent



// const OS_TYPES = {
//   IOS: 'iOS',
//   ANDROID: "Android",
//   WINDOWS_PHONE: "Windows Phone",
//   WINDOWS: 'Windows',
//   MAC_OS: 'Mac OS'
// };

const isMac = userAgent.match(/Mac OS/ig)
const isWin = userAgent.match(/Windows/ig)

module.exports = {isMac, isWin}

