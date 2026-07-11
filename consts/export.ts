// The version stamped into every backup file we write and the newest version
// import knows how to read. Bump this whenever the export shape changes in a way
// older importers can't handle; import rejects any file whose version exceeds it
// with a "created by a newer version" message rather than mis-reading the data.
export const CURRENT_EXPORT_VERSION = 3;
