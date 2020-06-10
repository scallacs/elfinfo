
import { ELFProgramHeaderEntry } from './types';
import { programHeaderEntryTypeToString, programHeaderFlagsToString } from './strings';
import { Reader } from './reader';

export async function readProgramHeaderEntries(fh: Reader,
    ph_off: number | BigInt, ph_entsize: number, ph_num: number,
    bits: number, bigEndian: boolean): Promise<ELFProgramHeaderEntry[]> {

    if (ph_num == 0) {
        return [];
    }

    const buff = new ArrayBuffer(ph_entsize);
    const view = new DataView(buff);
    const arr = new Uint8Array(buff);
    const readUInt32 = (ix:number) => view.getUint32(ix, !bigEndian);
    const readUInt64 = (ix:number) => view.getBigUint64(ix, !bigEndian);

    const result = new Array(ph_num);

    for (let i = 0; i < ph_num; i++) {
        await fh.read(arr, 0, ph_entsize, (ph_off as number) + i * ph_entsize);
        const type = readUInt32(0);

        let ix = 4;
        let flags, offset, vaddr, paddr, filesz, memsz, align;
        if (bits == 32) {
            offset = readUInt32(ix); ix += 4;
            vaddr = readUInt32(ix); ix += 4;
            paddr = readUInt32(ix); ix += 4;
            filesz = readUInt32(ix); ix += 4;
            memsz = readUInt32(ix); ix += 4;
            flags = readUInt32(ix); ix += 4;
            align = readUInt32(ix); ix += 4;
        } else {
            flags = readUInt32(ix); ix += 4;
            offset = readUInt64(ix); ix += 8;
            vaddr = readUInt64(ix); ix += 8;
            paddr = readUInt64(ix); ix += 8;
            filesz = readUInt64(ix); ix += 8;
            memsz = readUInt64(ix); ix += 8;
            align = readUInt64(ix); ix += 8;
        }

        result[i] = {
            index: i,
            type,
            typeDescription: programHeaderEntryTypeToString(type),
            flags,
            flagsDescription: programHeaderFlagsToString(flags),
            offset,
            vaddr,
            paddr,
            filesz,
            memsz,
            align
        }
    }

    return result;
}