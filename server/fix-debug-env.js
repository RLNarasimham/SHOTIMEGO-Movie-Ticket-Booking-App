if (process.env.DEBUG && process.env.DEBUG.includes('${')) {
    console.warn('DEBUG variable contains template string. Removing it.');
    delete process.env.DEBUG;
}
