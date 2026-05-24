let listeners = [];

export function toast(message, type = "success") {
  listeners.forEach((fn) => fn({ message, type }));
}

export function subscribeToast(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}