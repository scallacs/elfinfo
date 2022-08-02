// import { FileHandle, Reader } from "../src";

// export function file(elfpath: string): Reader {
//     if (!fs) return error_reader('No filesystem');

//     const state = { path: elfpath, fh: undefined as FileHandle | undefined, size: 0 };
//     return {
//         open: () => fsopen(state.path, 'r')
//             .then(fh => {
//                 state.fh = fh;
//                 return fh.stat().then(ss => { state.size = ss.size });
//             }),
//         read: (length, position) => asyncFileRead(state.fh, length, position),
//         view: (length, position) => asyncFileRead(state.fh, length, position).then(createView),
//         size: () => state.size,
//         close: () => state.fh ? state.fh.close() : Promise.resolve(),
//         path: path.resolve(elfpath)
//     }
// }

// function syncFileRead(
//     file: number,
//     length: number,
//     position?: number
//   ): Promise<Uint8Array> {
//     return new Promise((resolve, reject) => {
//       const result = new Uint8Array(length);
//       fs.read(
//         file,
//         result,
//         0,
//         length,
//         position ?? null,
//         (err: any, bytesRead: number) => {
//           if (err) {
//             reject(err);
//           } else {
//             if (bytesRead < length) {
//               resolve(result.slice(0, bytesRead));
//             } else {
//               resolve(result);
//             }
//           }
//         }
//       );
//     });
//   }

// export function asyncfile(fh: FileHandle, ownshandle?: boolean): Reader {
//     if (!fs) return error_reader('No filesystem');

//     const state = { fh, size: 0, ownshandle };
//     return {
//       // open checks if the file handle is still valid
//       // and gets the size
//       open: () =>
//         state.fh.stat().then((ss: any) => {
//           state.size = ss.size;
//         }),
//       read: (length, position) => asyncFileRead(state.fh, length, position),
//       view: (length, position) =>
//         asyncFileRead(state.fh, length, position).then(createView),
//       size: () => state.size,
//       close: () => (state.ownshandle ? state.fh.close() : Promise.resolve()),
//     };
//   }

//   export function syncfile(handle: number, ownshandle?: boolean): Reader {
//     if (!fs) return error_reader('No filesystem');

//     const state = { ownshandle, handle, size: 0 };
//     return {
//       open: () =>
//         new Promise((resolve, reject) =>
//           fs.fstat(state.handle, (e, ss) => {
//             // open just checks if the file handle is still valid
//             if (e) {
//               reject(e);
//             } else {
//               state.size = ss.size;
//               resolve();
//             }
//           })
//         ),
//       read: (length, position) => syncFileRead(state.handle, length, position),
//       view: (length, position) =>
//         syncFileRead(state.handle, length, position).then(createView),
//       size: () => state.size,
//       close: () =>
//         new Promise((resolve, reject) => {
//           if (state.ownshandle) {
//             fs.close(state.handle, (e) => {
//               if (e) {
//                 reject(e);
//               } else {
//                 resolve();
//               }
//             });
//           } else {
//             resolve();
//           }
//         }),
//     };
//   }
