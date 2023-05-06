export function detectProvider (timeout = 3000) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (typeof window.pontem === 'undefined') {
      const timer = setTimeout(reject, timeout)
      window.addEventListener('#pontemWalletInjected', (e) => {
        clearTimeout(timer)
        // @ts-ignore
        resolve(e.detail)
      }, { once: true })
    } else {
      // @ts-ignore
      resolve(window.pontem)
    }
  })
}
