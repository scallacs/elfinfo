import { ELFOpenResult } from "./types";
import * as reader from "./reader";

import { readElf, OpenOptions } from "./parser";

function isReader(item: any): item is reader.Reader {
    return typeof item === 'object' &&
        typeof item.close === 'function' &&
        typeof item.open === 'function' &&
        typeof item.read === 'function' &&
        typeof item.size === 'function' &&
        typeof item.view === 'function';
}

// function isFileHandle(item: any): item is fs.FileHandle {
//     return typeof item === 'object' &&
//         typeof item.fd === 'number' &&
//         typeof item.stat === 'function' &&
//         typeof item.read === 'function';
// }

function isBlob(item: any): item is reader.Blob {
    return typeof item === 'object' &&
        typeof item.size === 'number' &&
        typeof item.arrayBuffer === 'function';
}

const defaultOptions: OpenOptions = {
    readSymbolData: false
};

/**
 * Parse an ELF file.
 * @summary Parsing will be async if a path, blob, or file handle is specified and synchronous if an array or buffer is specified.
 * @param {any} input the path to the ELF file, or the data for the file.
 * @param {function} [callback] When specified, this will be called after the file is done parsing.
 * @returns {Promise<ELFOpenResult>} a result indicating the success or failure of parsing and the data for the ELF file.
 */
export function open(input: Uint8Array | ArrayBuffer | Array<number> | reader.Reader | string | number | string | reader.Blob,
    options?: OpenOptions,
    callback?: (result: ELFOpenResult) => void | null): Promise<ELFOpenResult> {

    let promise: Promise<ELFOpenResult>;

    if (!options) {
        options = defaultOptions;
    }

    if (input instanceof Uint8Array) {
        promise = readElf(reader.buffer(input), options);
    } else if (input instanceof ArrayBuffer) {
        promise = readElf(reader.buffer(input), options);
    } else if (input instanceof Array) {
        promise = readElf(reader.array(input), options);
    } else if (isReader(input)) {
        promise = readElf(input, options);
    } 
    // else if (typeof input === 'number') {
    //     promise = readElf(reader.syncfile(input), options);
    // } 
    // else if (isFileHandle(input)) {
    //     promise = readElf(reader.asyncfile(input), options);
    // } 
    else if (isBlob(input)) {
        promise = readElf(reader.blob(input), options);
    } 
    // else if (typeof input === 'string') {
    //     promise = readElf(reader.file(input), options);
    // } 
    else {
        promise = new Promise((resolve) => {
            resolve({
                success: false,
                errors: ['unsupported input type'],
                warnings: []
            });
        })
    }

    if (callback) {
        promise.then(callback);
    }

    return promise;
}

export * from './reader';
export * from './elf';
export * from './types';
export * from './debug';
export { OpenOptions };